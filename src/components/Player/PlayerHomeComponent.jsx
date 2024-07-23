import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import PlayerManageComponent from './PlayerManageComponent';
import PlayerAccountComponent from './PlayerAccountComponent';
import PlayerEventsComponent from './PlayerEventsComponent';
import HeaderComponent from '../Header/HeaderComponent';

const PlayerHomeComponent = () => {
    const [key, setKey] = useState('account');
    const user = JSON.parse(localStorage.getItem('item'));

    return (
        <div>
            <HeaderComponent isAuthenticated={true} user={user} handleLogout={() => { }} />
            <Container className="mt-5">
                <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                    <Tab eventKey="account" title="Compte Utilisateur">
                        <PlayerAccountComponent />
                    </Tab>
                    <Tab eventKey="events" title="Événements">
                        <PlayerEventsComponent />
                    </Tab>
                    <Tab eventKey="profile" title="Profil Joueur">
                        < PlayerManageComponent />
                    </Tab>

                </Tabs>
            </Container>
        </div>
    );
}

export default PlayerHomeComponent;
