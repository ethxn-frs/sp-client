import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const userDistributionData = {
    labels: ['Admin', 'Joueurs', 'Clubs', 'Centres de Formation'],
    datasets: [
        {
            label: "Répartition des utilisateurs",
            data: [23, 34, 12, 15],
            backgroundColor: ['Red', 'Blue', 'Orange', 'Yellow'],
        },
    ],
};

const playerDistributionData = {
    labels: ['Football', 'Basketball', 'Tennis', 'Natation'],
    datasets: [
        {
            label: "Répartition des joueurs",
            data: [40, 30, 20, 10],
            backgroundColor: ['Green', 'Purple', 'Orange', 'Cyan'],
        },
    ],
};

const clubDistributionData = {
    labels: ['Football', 'Basketball', 'Tennis', 'Natation'],
    datasets: [
        {
            label: "Répartition des clubs",
            data: [25, 15, 35, 25],
            backgroundColor: ['Blue', 'Orange', 'Yellow', 'Green'],
        },
    ],
};

const formationCenterDistributionData = {
    labels: ['Football', 'Basketball', 'Tennis', 'Natation'],
    datasets: [
        {
            label: "Répartition des centres de formation",
            data: [30, 20, 25, 25],
            backgroundColor: ['Purple', 'Blue', 'Orange', 'Cyan'],
        },
    ],
};

const clubSportDistributionData = {
    labels: ['Football', 'Basketball', 'Tennis', 'Natation'],
    datasets: [
        {
            label: "Répartition des clubs par sport",
            data: [30, 10, 25, 35],
            backgroundColor: ['Cyan', 'Purple', 'Orange', 'Green'],
        },
    ],
};

const formationCenterSportDistributionData = {
    labels: ['Football', 'Basketball', 'Tennis', 'Natation'],
    datasets: [
        {
            label: "Répartition des centres de formation par sport",
            data: [20, 25, 15, 40],
            backgroundColor: ['Red', 'Blue', 'Yellow', 'Purple'],
        },
    ],
};

const userDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartitions des utilisateurs',
        },
    },
};

const playerDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartition des joueurs par sport',
        },
    },
};

const clubDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartition des clubs par sport',
        },
    },
};

const formationCenterDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartition des centres de formation par sport',
        },
    },
};

const clubSportDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartition des clubs par sport',
        },
    },
};

const formationCenterSportDistributionOptions = {
    plugins: {
        title: {
            display: true,
            text: 'Répartition des centres de formation par sport',
        },
    },
};

function AdminAnalyseComponent() {
    return (
        <div className='projet-analyse'>
            <h2 className="text-center my-4">Analyse des données</h2>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={userDistributionData} options={userDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={userDistributionData} options={userDistributionOptions} />
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={playerDistributionData} options={playerDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={playerDistributionData} options={playerDistributionOptions} />
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={clubDistributionData} options={clubDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={clubDistributionData} options={clubDistributionOptions} />
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={formationCenterDistributionData} options={formationCenterDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={formationCenterDistributionData} options={formationCenterDistributionOptions} />
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={clubSportDistributionData} options={clubSportDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={clubSportDistributionData} options={clubSportDistributionOptions} />
                </div>
            </div>
            <div className='Card-double'>
                <div className='Card-small-double'>
                    <Doughnut data={formationCenterSportDistributionData} options={formationCenterSportDistributionOptions} />
                </div>
                <div className='Card-small-double'>
                    <Bar data={formationCenterSportDistributionData} options={formationCenterSportDistributionOptions} />
                </div>
            </div>
        </div>
    );
}

export default AdminAnalyseComponent;
