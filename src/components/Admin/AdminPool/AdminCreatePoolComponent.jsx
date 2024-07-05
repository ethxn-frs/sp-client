import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminCreatePoolComponent = () => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = 1;

        try {
            const response = await fetch('http://localhost:4000/sondages', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    startDate,
                    endDate,
                    userId: parseInt(userId)
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du sondage');
            }

            const createdSondage = await response.json();
            console.log(createdSondage)
            alert('Sondage créé avec succès!');
            // Reset form
            setName('');
            setStartDate('');
            setEndDate('');
            setErrorMessage('');
            navigate(`/admin/pools/${createdSondage.id}/edit`);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || 'Une erreur est survenue');
            } else if (error.request) {
                setErrorMessage('Erreur réseau : Aucune réponse reçue');
            } else {
                setErrorMessage('Erreur : ' + error.message);
            }
        }
    };

    return (
        <div className="create-sondage-container">
            <h2>Créer un Sondage</h2>
            <form className="create-sondage-form" onSubmit={handleSubmit}>
                <div className="form-group visible">
                    <label>Question du sondage</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group visible">
                    <label>Date de début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group visible">
                    <label>Date de fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit" className="submit-button">Créer</button>
            </form>
        </div>
    );
};

export default AdminCreatePoolComponent;
