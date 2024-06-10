import React, { useState } from 'react';
import './DonationComponent.css';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../contexts/StringConfig';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';

const DonationForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleStripeSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                email: email,
            },
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Merci pour votre don!');
        }
    };

    const handlePayPalApprove = (data, actions) => {
        return actions.order.capture().then((details) => {
            setMessage(`Merci pour votre don, ${details.payer.name.given_name}!`);
        });
    };

    return (
        <div className="donation-form-container">
            <form onSubmit={handleStripeSubmit} className="donation-form">
                <div className="form-group">
                    <label htmlFor="amount">Montant du don</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Nom</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="card-element">Informations de la carte</label>
                    <CardElement id="card-element" />
                </div>
                <button type="submit" className="donation-button" disabled={!stripe}>
                    Faire un don par carte
                </button>
                {message && <p>{message}</p>}
            </form>

            <h3>PayPal</h3>
            <PayPalScriptProvider options={{ "client-id": "votre_client_id_paypal" }}>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: amount,
                                },
                            }],
                        });
                    }}
                    onApprove={handlePayPalApprove}
                />
            </PayPalScriptProvider>
        </div>
    );
};

const DonationComponent = () => {
    return (
        <div>
            <HeaderComponent />
            <div className="donation-container">
                <h2>Faire un don</h2>
                <Elements stripe={stripePromise}>
                    <DonationForm />
                </Elements>
            </div>
            <FooterComponent />
        </div>
    );
};

export default DonationComponent;
