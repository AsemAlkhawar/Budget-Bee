import React, { useState, useEffect } from 'react'; // Import React, useState, and useEffect hooks
import axios from 'axios'; // Import axios for making HTTP requests
import { PlaidLink } from 'react-plaid-link'; // Import PlaidLink component for Plaid integration
import Transactions from './Transactions'; // Import Transactions component
import PieChartDisplay from './PieChartDisplay'; // Import PieChartDisplay component
import Header from './Header'; // Import Header component
import './styles/Overview.css'; // Import CSS styles

const Overview = ({ userId, setUserId, onLogOut }) => { // Define Overview component with userId, setUserId, and onLogOut props
    const [linkToken, setLinkToken] = useState(''); // State to store Plaid link token
    const [transactions, setTransactions] = useState([]); // State to store transactions
    const [categorizedTransactions, setCategorizedTransactions] = useState({}); // State to store categorized transactions

    useEffect(() => {
        checkAccessToken(); // Check access token when userId changes
    }, [userId]);

    const fetchLinkToken = async () => { // Function to fetch Plaid link token
        try {
            const response = await axios.post('/api/create_link_token', { uid: userId });
            setLinkToken(response.data.link_token); // Set link token
        } catch (error) {
            console.error('Error fetching link token:', error); // Log error
        }
    };

    const fetchTransactions = async () => { // Function to fetch transactions
        try {
            const transactionsResponse = await axios.post('/api/get_transactions', { uid: userId });
            setTransactions(transactionsResponse.data.transactions); // Set transactions

            const categorizeResponse = await axios.post('/api/categorize_transactions', { uid: userId });
            setCategorizedTransactions(categorizeResponse.data.categorizedTransactions); // Set categorized transactions
        } catch (error) {
            console.error('Error fetching transactions:', error); // Log error
        }
    };

    const checkAccessToken = async () => { // Function to check if user has access token
        try {
            const response = await axios.post('/api/check_access_token', { uid: userId });
            if (response.data.hasAccessToken) {
                await fetchTransactions(); // Fetch transactions if access token exists
            } else {
                await fetchLinkToken(); // Fetch link token if no access token
            }
        } catch (error) {
            console.error('Error checking access token:', error); // Log error
        }
    };

    const handleOnSuccess = async (public_token) => { // Function to handle successful Plaid link
        try {
            await axios.post('/api/get_access_token', { public_token, uid: userId });
            await fetchTransactions(); // Fetch transactions after getting access token
        } catch (error) {
            console.error('Error fetching transactions:', error); // Log error
        }
    };

    const pieChartData = Object.entries(categorizedTransactions) // Prepare data for pie chart
        .map(([category, items], index) => {
            const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
            return {
                name: category,
                value: totalAmount,
            };
        })
        .filter(item => item.value > 0); // Filter out categories with zero value

    return (
        <div className="overview-container"> {/* Container for the overview */}
            <Header title="Account Overview" onLogout={onLogOut} /> {/* Header component */}
            {linkToken && transactions.length < 1 ? ( // Check if link token exists and no transactions
                <div className="plaid-link-container"> {/* Container for Plaid link */}
                    <h2>Connect Your Bank Account</h2> {/* Title */}
                    <p>Please connect your bank account to view and categorize your transactions.</p> {/* Description */}
                    <PlaidLink
                        token={linkToken}
                        onSuccess={handleOnSuccess}
                        className="plaid-link-button"
                    >
                        Connect a bank account
                    </PlaidLink> {/* Plaid link button */}
                </div>
            ) : (
                <div className="columns-container"> {/* Container for columns */}
                    <div className="column"> {/* Column for transactions */}
                        <Transactions title="Transactions" transactions={transactions} /> {/* Transactions component */}
                    </div>
                    <div className="column"> {/* Column for categorized transactions */}
                        {Object.keys(categorizedTransactions).length > 0 ? (
                            Object.entries(categorizedTransactions).map(([category, items], index) => (
                                <Transactions key={index} title={category} transactions={items} /> 
                            ))
                        ) : (
                            <p>No categorized transactions available.</p> 
                        )}
                    </div>
                    <div className="column"> {/* Column for pie chart */}
                        <PieChartDisplay title="Transactions by Category" data={pieChartData} /> {/* PieChartDisplay component */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview; // Export the Overview component as default