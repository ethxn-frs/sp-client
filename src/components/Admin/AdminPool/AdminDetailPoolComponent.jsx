import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

Chart.register(CategoryScale, LinearScale, BarElement);

function AdminDetailPoolComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sondage, setSondage] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSondage = async () => {
            try {
                const response = await fetch(`http://localhost:4000/sondages/${id}`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération du sondage');
                }
                const data = await response.json();
                setSondage(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du sondage:', error);
                alert('Erreur lors de la récupération du sondage.');
            }
        };

        const fetchAnswers = async () => {
            try {
                const response = await fetch(`http://localhost:4000/sondages/${id}/answers`);
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des réponses');
                }
                const data = await response.json();
                setAnswers(data.answers);
            } catch (error) {
                console.error('Erreur lors de la récupération des réponses:', error);
                alert('Erreur lors de la récupération des réponses.');
            }
        };

        fetchSondage();
        fetchAnswers();
        setLoading(false);
    }, [id]);

    if (!sondage || loading) {
        return <div>Loading...</div>;
    }

    const questionCounts = sondage.questions.map(question => ({
        id: question.id,
        text: question.text,
        count: answers.filter(answer => answer.question.id === question.id).length
    }));

    const chartData = {
        labels: questionCounts.map(q => q.text),
        datasets: [
            {
                label: 'Nombre de réponses',
                data: questionCounts.map(q => q.count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const maxCount = Math.max(...questionCounts.map(q => q.count)) + 1;

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: maxCount,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                },
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Détails du Sondage</h2>
            <div>
                <p><strong>Question du sondage:</strong> {sondage.name}</p>
                <p><strong>Date de début:</strong> {new Date(sondage.startDate).toLocaleString()}</p>
                <p><strong>Date de fin:</strong> {new Date(sondage.endDate).toLocaleString()}</p>
            </div>

            <h3 className="mt-5">Réponses Possibles </h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Texte</th>
                    </tr>
                </thead>
                <tbody>
                    {sondage.questions.map((question) => (
                        <tr key={question.id}>
                            <td>{question.id}</td>
                            <td>{question.text}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h3 className="mt-5">Statistiques des Réponses</h3>
            <Bar data={chartData} options={chartOptions} />

            <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin/pools')}>
                Retour à la liste
            </Button>
        </div>
    );
}

export default AdminDetailPoolComponent;
