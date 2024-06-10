import React from 'react';
import { jsPDF } from 'jspdf';
import { Modal, Button } from 'react-bootstrap';

function ModalComponent({ show, handleClose, children }) {
    //const size = Object.keys(children.stats?.matches).length;
    const generatePDF = () => {
        const doc = new jsPDF();

        // Exemple de contenu du PDF avec les informations de l'utilisateur
        const content = `
            Nom: ${children.FirstName} ${children.Lastname}
            Date de naissance: ${new Date(children.BirthDate).toLocaleDateString()}
            Taille: ${children.Height} CM
            Poids: ${children.Weight} KG
            Sport: ${children.Sport?.Name}
            Assistance: ${children.stats?.assists}
            Nombre de but: ${children.stats?.goals}
        `;

        doc.text(content, 10, 10);
        doc.save(`${children.FirstName}.pdf`);
    };
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{children.FirstName}  {children.Lastname}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Date de naissance : {children.BirthDate}</h5>
                <h5>Taille : {children.Height} CM</h5>
                <h5>Poids : {children.Weight} KG</h5>
                <h5>Sport : {children.Sport?.Name} KG</h5>
                <h5>Statistiques:</h5>
                <h5>assistance : {children.stats?.assists} </h5>
                <h5>Nombre de but : {children.stats?.goals}</h5>
                {/*<h5>Nombre de matches: {size}</h5>*/}
                <p>
                    
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
            
            </Modal.Body>
            <Modal.Footer>
            <button className='btn btn-primary' onClick={generatePDF}>Télécharger le rapport en pdf</button>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalComponent;
