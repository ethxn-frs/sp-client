import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import EditProfileModal from './EditProfileModal';

const UserInfoAlertComponent = ({ user }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    useEffect(() => {
        if (!user.firstname || !user.lastname || !user.address || user.firstname.trim() === '' || user.lastname.trim() === '' || user.address.trim() === '') {
            setShowAlert(true);
        }
    }, [user]);

    const handleOpenModal = () => {
        setShowEditProfileModal(true);
    };

    const handleCloseModal = () => {
        setShowEditProfileModal(false);
    };

    return (
        <>
            {showAlert && (
                <Alert variant="warning" className="d-flex justify-content-between align-items-center">
                    <span>Attention, votre compte n'est pas rempli correctement. Cliquez ici pour compléter vos informations.</span>
                    <Button variant="link" onClick={handleOpenModal} className="text-decoration-none">
                        Compléter le profil
                    </Button>
                </Alert>
            )}
            <EditProfileModal
                show={showEditProfileModal}
                handleClose={handleCloseModal}
                user={user}
            />
        </>
    );
};

export default UserInfoAlertComponent;