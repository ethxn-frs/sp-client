import { PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';
import React, { useEffect } from 'react';

const PaypalPaymentComponent = ({ amount }) => {
    useEffect(() => {
        console.log("Updated amount in PaypalPaymentComponent: ", amount);
    }, [amount]);

    const createOrder = async (data, actions) => {
        try {
            const response = await fetch("http://localhost:4000/transactions/create-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: amount }),
            });

            const order = await response.json();
            return order.id;
        } catch (error) {
            console.error("Error creating PayPal order:", error);
            alert("There was an error creating the PayPal order. Please try again.");
        }
    };

    const onApprove = async (data, actions) => {
        try {
            const response = await fetch("http://localhost:4000/transactions/capture-paypal-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderID: data.orderID }),
            });

            const details = await response.json();
            Swal.fire({
                title: 'Merci pour votre don!',
                text: `Transaction complétée par ${details.payer.name.given_name}. Vous faites vivre l'association !`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
            });
        } catch (error) {
            console.error("Error capturing PayPal order:", error);
            alert("There was an error capturing the PayPal order. Please try again.");
        }
    };

    return (
        <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
        />
    );
}

export default PaypalPaymentComponent;