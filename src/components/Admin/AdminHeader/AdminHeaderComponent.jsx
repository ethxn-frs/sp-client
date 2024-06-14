import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import EditProfileModal from '../AdminUser/EditProfileModal';

function AdminHeaderComponent() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Sidebar>
            <Menu>
                <p>Connectée en tant que :</p>
                {user ? (
                    <p onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                        {user.firstname} {user.lastname}
                    </p>
                ) : (
                    <p>Utilisateur non connecté</p>
                )}
                <SubMenu label="Tableau de bord">
                    <MenuItem component={<Link to="/admin" />}>Accueil</MenuItem>
                    <MenuItem component={<Link to="/admin/analyse" />}>Analyse</MenuItem>
                </SubMenu>
                <MenuItem component={<Link to="/admin/planning/create" />}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar2-week-fill" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5M8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5z" />
                    </svg>
                    CALENDRIER
                </MenuItem>
                <SubMenu label="UTILISATEURS">
                    <MenuItem component={<Link to="/admin/users/create" />}>Créer un utilisateur</MenuItem>
                    <MenuItem component={<Link to="/admin/users" />}>Liste des utilisateurs</MenuItem>
                </SubMenu>
                <SubMenu label="DOCUMENTS">
                    <MenuItem component={<Link to="/admin/documents/create" />}>Créer un document</MenuItem>
                    <MenuItem component={<Link to="/admin/documents" />}>Liste des documents</MenuItem>
                </SubMenu>
                <SubMenu label="SONDAGES">
                    <MenuItem component={<Link to="/admin/pools/create" />}>Créer un sondage</MenuItem>
                    <MenuItem component={<Link to="/admin/pools" />}>Liste des sondages</MenuItem>
                </SubMenu>
                <SubMenu label="CENTRES DE FORMATION">
                    <MenuItem component={<Link to="/admin/formations-centers/create" />}>Créer un CF</MenuItem>
                    <MenuItem component={<Link to="/admin/formations-centers" />}>Liste des CF</MenuItem>
                </SubMenu>
                <SubMenu label="CLUBS">
                    <MenuItem component={<Link to="/admin/clubs/create" />}>Créer un club</MenuItem>
                    <MenuItem component={<Link to="/admin/clubs" />}>Liste des clubs</MenuItem>
                </SubMenu>
                <SubMenu label="JOUEURS">
                    <MenuItem component={<Link to="/admin/players/create" />}>Créer un joueur</MenuItem>
                    <MenuItem component={<Link to="/admin/players" />}>Liste des joueurs</MenuItem>
                </SubMenu>
                <SubMenu label="SPORTS">
                    <MenuItem component={<Link to="/admin/sports/create" />}>Créer un sport</MenuItem>
                    <MenuItem component={<Link to="/admin/sports" />}>Liste des sports</MenuItem>
                </SubMenu>
                <MenuItem component={<Link to="/logout" />}>DECONNEXION</MenuItem>
            </Menu>
            {user && (
                <EditProfileModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    user={user}
                />
            )}
        </Sidebar>
    );
}

export default AdminHeaderComponent;