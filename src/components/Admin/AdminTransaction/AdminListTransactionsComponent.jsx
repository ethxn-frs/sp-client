import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import './AdminListTransactionsComponent.css';

const statusOptions = [
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CREATED', label: 'Created' }
];

const AdminListTransactionsComponent = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [filters, setFilters] = useState({
        status: '',
        donorEmail: '',
        dateFrom: '',
        dateTo: '',
        page: 1,
        limit: 5
    });
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        fetchTransactions();
    }, [searchParams]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams).toString();
            const response = await fetch(`http://localhost:4000/transactions?${query}`);
            const data = await response.json();
            setTransactions(data.transactions);
            setTotalTransactions(data.total);

            // Update filter values from URL parameters
            setFilters({
                status: searchParams.get('status') || '',
                donorEmail: searchParams.get('donorEmail') || '',
                dateFrom: searchParams.get('dateFrom') || '',
                dateTo: searchParams.get('dateTo') || '',
                page: parseInt(searchParams.get('page')) || 1,
                limit: parseInt(searchParams.get('limit')) || 5
            });
        } catch (error) {
            setError('Error fetching transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();
        const filteredFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        setSearchParams(filteredFilters);
    };

    const handleResetFilters = () => {
        setFilters({
            status: '',
            donorEmail: '',
            dateFrom: '',
            dateTo: '',
            page: 1,
            limit: 5
        });
        setSearchParams({});
    };

    const handlePageChange = (newPage) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            page: newPage
        }));
        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            page: newPage
        });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container className="mt-5">
            <h2>Transactions</h2>
            <Form onSubmit={handleFilterSubmit}>
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="status"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">Select Status</option>
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="donorEmail">
                            <Form.Label>Donor Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="donorEmail"
                                value={filters.donorEmail}
                                onChange={(e) => handleFilterChange('donorEmail', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="dateFrom">
                            <Form.Label>Date From</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFrom"
                                value={filters.dateFrom}
                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group controlId="dateTo">
                            <Form.Label>Date To</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateTo"
                                value={filters.dateTo}
                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                        <Button type="submit" variant="primary" className="me-2">
                            Filtrer
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleResetFilters}>
                            Réinitialiser
                        </Button>
                    </Col>
                </Row>
            </Form>
            <Table striped bordered hover responsive className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Adresse Ip</th>
                        <th>Id Comande</th>
                        <th>Status</th>
                        <th>Montant</th>
                        <th>Devise</th>
                        <th>Prénom Nom</th>
                        <th>Email</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.ipAddress}</td>
                            <td>{transaction.orderId}</td>
                            <td>{transaction.status}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.currency}</td>
                            <td>{transaction.donorName}</td>
                            <td>{transaction.donorEmail}</td>
                            <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="pagination-controls">
                <Button
                    disabled={filters.page === 1}
                    onClick={() => handlePageChange(filters.page - 1)}
                >
                    Previous
                </Button>
                <span>Page {filters.page}</span>
                <Button
                    disabled={filters.page * filters.limit >= totalTransactions}
                    onClick={() => handlePageChange(filters.page + 1)}
                >
                    Next
                </Button>
            </div>
        </Container>
    );
};

export default AdminListTransactionsComponent;
