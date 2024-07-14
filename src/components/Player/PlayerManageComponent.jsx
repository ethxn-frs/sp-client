import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import UploadDialogComponent from '../UploadDialog/UploadDialogComponent';

const PlayerManageComponent = () => {
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const userId = JSON.parse(localStorage.getItem('user')).id;

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await fetch(`http://localhost:3030/users/${userId}/player`);
                const data = await response.json();
                if (!data.image.some(img => img.name === 'Add new image')) {
                    data.image.push({ path: 'https://via.placeholder.com/150', name: 'Add new image' });
                }
                setPlayer(data);
            } catch (error) {
                Swal.fire('Erreur', 'Impossible de récupérer les informations du joueur', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [userId]);

    const handleImageClick = (index) => {
        console.log(index)
        setSelectedImageIndex(index);
        setShowUploadModal(true);
    };

    const handleUploadModalClose = () => {
        setShowUploadModal(false);
        setSelectedImageIndex(null);
    };

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "black" }}
                onClick={onClick}
            />
        );
    };

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "black" }}
                onClick={onClick}
            />
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Card className="mb-3">
            <Card.Body>
                <h5 className="card-title">Profil du Joueur</h5>
                {player && (
                    <>
                        <p><strong>Nom :</strong> {player.lastName}</p>
                        <p><strong>Prénom :</strong> {player.firstName}</p>
                        <p><strong>Taille :</strong> {player.height} cm</p>
                        <p><strong>Poids :</strong> {player.weight} kg</p>
                        <h5 className="mt-4">Statistiques</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Statistique</th>
                                    <th>Valeur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {player.stats && Object.entries(player.stats).map(([key, value]) => (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <h5 className="mt-4">Photos</h5>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Slider {...settings} style={{ width: '540px' }}>
                                {player.image && player.image.map((img, index) => (
                                    <div key={index}>
                                        <img 
                                            src={img.path} 
                                            alt={img.name} 
                                            onClick={() => handleImageClick(index)} 
                                            style={{ cursor: 'pointer', width: '100%', height: '258px', objectFit: 'cover' }} 
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <Button variant="primary">Modifier le profil</Button>
                    </>
                )}
            </Card.Body>
            <UploadDialogComponent
                open={showUploadModal}
                handleClose={handleUploadModalClose}
                entityType="player"
                id={player.id}
                index={selectedImageIndex}
            />
        </Card>
    );
}

export default PlayerManageComponent;
