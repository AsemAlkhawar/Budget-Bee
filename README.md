# Budget Bee

Budget Bee is a comprehensive web application designed to help users manage their personal finances by connecting to their bank accounts, categorizing transactions, and visualizing financial data through interactive charts. The app aims to provide users with clear insights into their spending patterns, helping them to make informed budgeting decisions.

## Features

- **Bank Account Integration:** Connect securely to bank accounts using Plaid.
- **Transaction Management:** View and manage transactions from connected bank accounts.
- **Categorization:** Automatic categorization of transactions to help users track spending habits.
- **Data Visualization:** Interactive pie charts to visualize spending by category.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Tools and Technologies

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **Recharts:** A composable charting library built on React components.
- **Backend:**
  - **Node.js:** JavaScript runtime built on Chrome's V8 JavaScript engine.
  - **Express:** Web application framework for Node.js.
  - **MongoDB:** NoSQL database for storing user and transaction data.
  - **Mongoose:** Object Data Modeling (ODM) library for MongoDB and Node.js.
- **APIs:**
  - **Plaid:** Provides APIs for developers to interact with banks and financial institutions.
- **Hosting/Deployment:**
  - **Heroku:** Cloud platform for hosting and managing applications.
  - **GitHub:** Source code management and version control.

## Installation and Setup

Follow these steps to get Budget Bee up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB
- A Plaid account

### Cloning the Repository

```bash
git clone https://github.com/your-username/Budget-Bee.git
cd Budget-Bee
```

### Setting Up the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and populate it with your MongoDB URI, Plaid client ID, and secret:
   ```plaintext
   MONGO_URI=your_mongodb_uri
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Setting Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

## Author

- **Asem Alkhawar**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Plaid for financial data APIs.
- Heroku for hosting solutions.
- All open-source contributors whose libraries facilitated this project.
