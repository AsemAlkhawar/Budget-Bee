// frontend/src/Overview.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = ({ userId }) => {
    const [linkToken, setLinkToken] = useState('');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchLinkToken = async () => {
            const response = await axios.post('http://localhost:3001/create_link_token', { uid: userId });
            setLinkToken(response.data.link_token);
        };

        const fetchTransactions = async () => {
            const response = await axios.post('http://localhost:3001/get_access_token', { uid: userId });
            setTransactions(response.data.transactions);
        };

        fetchLinkToken();
        fetchTransactions();
    }, [userId]);

    return (
        <div>
            <h2>Overview</h2>
            <p>Link Token: {linkToken}</p>
            <h3>Transactions:</h3>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>{transaction.name}: {transaction.amount}</li>
                ))}
            </ul>
        </div>
    );
};

export default Overview;
