import React from 'react';
import { Alert } from 'react-bootstrap';

const CotisationWarning = ({ daysLeft }) => {
    return (
        <Alert variant="warning" className="cotisation-warning">
            <strong>Attention !</strong> Vous devez payer votre cotisation pour continuer à utiliser nos services. Il vous reste {daysLeft} jours pour effectuer le paiement.
        </Alert>
    );
};

export default CotisationWarning;
