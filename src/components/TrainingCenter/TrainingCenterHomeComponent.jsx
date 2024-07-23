import React, { useState } from 'react';
import HeaderComponent from '../Header/HeaderComponent';
import './TrainingCenterHomeComponent.css';
import TrainingCenterAccountComponent from './TrainingCenterAccountComponent';
import TrainingCenterEventComponent from './TrainingCenterEventComponent';
import TrainingCenterPlayersComponent from './TrainingCenterPlayersComponent';
import TrainingCenterManageComponent from './TrainingCenterManageComponent';

const TrainingCenterHomeComponent = () => {
    const [activeTab, setActiveTab] = useState('Compte');
    const user = JSON.parse(localStorage.getItem('user'));

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Compte':
                return <TrainingCenterAccountComponent setActiveTab={setActiveTab} />;
            case 'Événements':
                return <TrainingCenterEventComponent />;
            case 'Centre de Formation':
                return <TrainingCenterManageComponent />;
            case 'Mes Joueurs':
                return <TrainingCenterPlayersComponent />;
            default:
                return <TrainingCenterAccountComponent setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div>
            <HeaderComponent isAuthenticated={true} user={user} handleLogout={() => { }} />
            <div className="main-page-container">
                <div className="tabs">
                    <button className={activeTab === 'Compte' ? 'active' : ''} onClick={() => setActiveTab('Compte')}>Compte</button>
                    <button className={activeTab === 'Événements' ? 'active' : ''} onClick={() => setActiveTab('Événements')}>Événements</button>
                    {user.role.role === 'ADMIN_FORMATIONCENTER' && (
                        <button className={activeTab === 'Centre de Formation' ? 'active' : ''} onClick={() => setActiveTab('Centre de Formation')}>Centre de Formation</button>
                    )}
                    <button className={activeTab === 'Mes Joueurs' ? 'active' : ''} onClick={() => setActiveTab('Mes Joueurs')}>Mes Joueurs</button>
                </div>
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default TrainingCenterHomeComponent;
