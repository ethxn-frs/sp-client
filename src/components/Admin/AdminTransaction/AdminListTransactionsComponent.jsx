import React, { useEffect, useState } from 'react';
import './AdminListTransactionsComponent.css';

const AdminListTransactionsComponent = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:4000/transactions');
            const data = await response.json();
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    return (
        <div className="admin-transactions-container">
            <h2>Transactions</h2>
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Donor Name</th>
                        <th>Donor Email</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
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
            </table>
        </div>
    );
};

export default AdminListTransactionsComponent;
