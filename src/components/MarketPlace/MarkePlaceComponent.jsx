import React, { useState, useEffect } from 'react';
import HeaderComponent from '../Header/HeaderComponent';
import FooterComponent from '../Footer/FooterComponent';
function MarketPlaceComponent() {

    const [data, setData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const handleShowModal = (item) => {
        setModalContent(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getallplayer = async () => {
        try {
            // Effectuer les requêtes en parallèle pour améliorer les performances
            const response = await fetch('http://localhost:4000/players', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            if (!response.ok) {
                throw new Error(`Échec de la récupération des données: Vérifier les réponses des API.`);
            }
            const player = await response.json(); 
            console.log( player.player)
            return player.player;
        } catch (error) {
            alert("Erreur lors de la récupération des player. Veuillez réessayer.");
            
            return null;  // Retourne null pour indiquer un échec
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const player = await getallplayer();
            if (player) {
                setData(player);
            }
        };
        fetchUsers();
    }, []);

    return (

        <div className="">
            <HeaderComponent/>
            <div className="projet-card-list">
                {data && data.map((item, index) => (
                    <div className="projet-card-list-content">
                        <div className="projet-card-list-image">
                            {item.Image ? (
                                <img src={`http://localhost:4000/${item.Image.url}`} alt={`${item.FirstName} ${item.Lastname}`} />
                            ) : (
                                <img src="" alt="Default" />
                            )}
                        </div>
                        <div className="projet-card-list-details">
                            <h5> {item.FirstName} {item.Lastname}</h5>
                            <div className="projet-card-list-text">
                                <p>Some quick example text to build on the card title and make up
                                    Some quick example text to build on the card title and make up
                                    Some quick example text to build on the card title and make up.</p>
                            </div>

                            <button className="detail-button" onClick={() => handleShowModal(item)}>Détail</button>
                        </div>
                    </div>
                ))}
            </div>
            {/* <ModalComponent show={showModal} handleClose={handleCloseModal} children={modalContent} /> */}
            <FooterComponent/>
        </div>
    );
}

export default MarketPlaceComponent