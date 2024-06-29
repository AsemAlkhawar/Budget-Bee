import React from 'react'; // Import React
import './styles/Transactions.module.css'; // Import CSS module for Transactions
import './styles/styles.css'; // Import general CSS styles

const Transactions = ({ title, transactions }) => { // Define Transactions component with title and transactions props
    const totalAmount = transactions.reduce((total, transaction) => total + transaction.amount, 0); // Calculate total amount of transactions

    return (
        <div className="container"> {/* Container for the transactions table */}
            <h3>{title}</h3> {/* Title of the transactions table */}
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => ( // Map through transactions to create table rows
                        <tr key={index}>
                            <td>{index + 1}</td> {/* Transaction number */}
                            <td>{transaction.name}</td> {/* Transaction name */}
                            <td>{transaction.date}</td> {/* Transaction date */}
                            <td>${transaction.amount.toFixed(2)}</td> {/* Transaction amount */}
                        </tr>
                    ))}
                    <tr className="total-row"> {/* Row for total amount */}
                        <td colSpan="3"><strong>Total</strong></td> {/* Total label */}
                        <td><strong>${totalAmount.toFixed(2)}</strong></td> {/* Total amount */}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Transactions; // Export the Transactions component as default