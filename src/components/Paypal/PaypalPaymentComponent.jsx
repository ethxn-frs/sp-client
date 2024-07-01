import { PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';
import React, { useCallback, useEffect } from 'react';

const PaypalPaymentComponent = ({ amount, type, cotisationId, onPaymentSuccess }) => {
    useEffect(() => {
        console.log("Updated amount in PaypalPaymentComponent: ", amount);
    }, [amount]);

    const createOrder = useCallback(async (data, actions) => {
        try {
            console.log(amount)
            const response = await fetch("http://localhost:4000/transactions/create-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: amount, type: type }), // Ajouter le type
            });

            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            Swal.fire("Erreur", "Il y a eu une erreur lors de la création de la commande PayPal. Veuillez réessayer.", "error");
        }
    }, [amount]);

    const onApprove = async (data, actions) => {
        try {
            const response = await fetch("http://localhost:4000/transactions/capture-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderID: data.orderID, cotisationId }), // Ajouter cotisationId si présent
            });

            const details = await response.json();
            Swal.fire({
                title: 'Merci pour votre paiement!',
                text: `Transaction complétée par ${details.payer.name.given_name}.`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                if (onPaymentSuccess) onPaymentSuccess();
            });
        } catch (error) {
            console.error("Error capturing PayPal order:", error);
            Swal.fire("Erreur", "Il y a eu une erreur lors de la capture de la commande PayPal. Veuillez réessayer.", "error");
        }
    };

    return (

        <PayPalButtons
            key={amount}
            createOrder={createOrder}
            onApprove={onApprove}
        />
    );
}

export default PaypalPaymentComponent;