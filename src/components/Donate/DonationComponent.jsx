import React, { useState, useEffect } from 'react';
import './DonationComponent.css';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';
import PaypalPaymentComponent from '../Paypal/PaypalPaymentComponent';

function DonationComponent() {
    const [amount, setAmount] = useState(1);

    const initialOptions = {
        "client-id": "AZM-xhZvk9RPx-koGNixiPRRv_BdF3aTvmrw9hxorpC7ewPymOgJJel1hwh4bDTujpCRT__lro3P6KtD",
        currency: "EUR",
        intent: "capture"
    };

    const handleAmountChange = (e) => {
        setAmount(parseFloat(e.target.value));
    };

    useEffect(() => {
        console.log(amount);
    }, [amount]);

    return (
        <div>
            <HeaderComponent />
            <div className="donation-container">
                <h2>Faire un don</h2>
                <p className="donation-text">
                    Votre générosité nous permet de continuer notre mission. Chaque don compte et nous aide à organiser
                    des événements, soutenir nos membres et promouvoir nos activités. Merci pour votre soutien !
                </p>
                <div className='mb-5'>
                    <label htmlFor="amount">Montant du don:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount || ''}
                        onChange={handleAmountChange}
                        placeholder="Entrez le montant en EUR"
                    />
                </div>
                <PayPalScriptProvider options={initialOptions}>
                    <PaypalPaymentComponent 
                        amount={amount} 
                        type={'DONATION'} 
                        disabled={!amount || amount <= 0} 
                    />
                </PayPalScriptProvider>
            </div>
            <FooterComponent />
        </div>
    );
}

export default DonationComponent;
