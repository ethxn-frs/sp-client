import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminListUserComponent() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const getAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Échec de la récupération des utilisateurs: ${response.status} (${response.statusText})`);
            }

            const users = await response.json();
            return users.user;
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            Swal.fire('Erreur', "Erreur lors de la récupération des utilisateurs. Veuillez réessayer.", 'error');
            return null;
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getAllUsers();
            if (users) {
                setData(users);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous ne pourrez pas revenir en arrière!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:4000/users/${id}/delete`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        throw new Error(result.message || 'Erreur lors de la suppression de l\'utilisateur');
                    }

                    setData(data.filter(item => item.id !== id));
                    Swal.fire('Supprimé!', 'Utilisateur supprimé avec succès!', 'success');
                } catch (error) {
                    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
                    Swal.fire('Erreur', error.message || "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer.", 'error');
                }
            }
        });
    };

    const handleDetail = (id) => {
        navigate(`/admin/users/${id}`);
    };

    return (
        <div>
            <div className='Card-title'><h2>Liste des Utilisateurs</h2></div>
            <table className="table table-borderless">
                <thead className='table-light'>
                    <tr>
                        <th>NOM</th>
                        <th>PRENOMS</th>
                        <th>EMAIL</th>
                        <th>DATE DE NAISSANCE</th>
                        <th>DATE ANCIENNETE</th>
                        <th>ROLE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                            <td>{new Date(item.birthDate).toLocaleDateString()}</td>
                            <td>{new Date(item.createDate).toLocaleDateString()}</td>
                            <td>{item.role.role}</td>
                            <td>
                                <Button variant="info" onClick={() => handleDetail(item.id)}>Voir</Button>
                                <Button variant="danger" onClick={() => handleDelete(item.id)}>Supprimer</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminListUserComponent;
