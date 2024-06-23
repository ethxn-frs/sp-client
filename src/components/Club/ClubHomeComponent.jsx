import React, { useState } from 'react';
import HeaderComponent from '../Header/HeaderComponent';
import './ClubHomeComponent.css';
import ClubAccountComponent from './ClubAccountComponent';
import ClubEventComponent from './ClubEventComponent';
import ClubMarketPlaceComponent from './ClubMarketPlaceComponent';
import ClubManageComponent from './ClubManageComponent';

const ClubHomeComponent = () => {
    const [activeTab, setActiveTab] = useState('Compte');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user.role);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Compte':
                return <ClubAccountComponent setActiveTab={setActiveTab} />;
            case 'Événements':
                return <ClubEventComponent />;
            case 'Club':
                return <ClubManageComponent />;
            case 'MarketPlace':
                return <ClubMarketPlaceComponent />;
            default:
                return <ClubAccountComponent setActiveTab={setActiveTab} />;
        }
    };

    return (
        <div>
            <HeaderComponent isAuthenticated={true} user={user} handleLogout={() => { }} />
            <div className="main-page-container">
                <div className="tabs">
                    <button className={activeTab === 'Compte' ? 'active' : ''} onClick={() => setActiveTab('Compte')}>Compte</button>
                    <button className={activeTab === 'Événements' ? 'active' : ''} onClick={() => setActiveTab('Événements')}>Événements</button>
                    {user.role.role === 'ADMIN_CLUB' && (
                        <button className={activeTab === 'Club' ? 'active' : ''} onClick={() => setActiveTab('Club')}>Club</button>
                    )}
                    <button className={activeTab === 'MarketPlace' ? 'active' : ''} onClick={() => setActiveTab('MarketPlace')}>MarketPlace</button>
                </div>
                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ClubHomeComponent;
