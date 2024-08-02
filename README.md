
# Budget Bee 🐝💰

![Budget Bee Logo](frontend/public/logo.png)

Budget Bee is a comprehensive web application designed to empower users in managing their personal finances. By securely connecting to bank accounts, intelligently categorizing transactions, and visualizing financial data through interactive charts, Budget Bee provides clear insights into spending patterns, enabling informed budgeting decisions.

## 🌟 Features

- **Secure Bank Integration:** Connect seamlessly to bank accounts using Plaid's robust API
- **Smart Transaction Management:** View, manage, and analyze transactions from connected accounts
- **Intelligent Categorization:** Leverage ChatGPT for automatic, accurate transaction categorization
- **Interactive Data Visualization:** Gain insights through dynamic pie charts of spending categories
- **Responsive Design:** Enjoy a seamless experience across desktop and mobile devices

## 🛠️ Technologies

### Frontend
- **React:** Building dynamic user interfaces
- **Recharts:** Creating composable, interactive charts
- **Axios:** Handling HTTP requests
- **CSS Modules:** Styling with local scope and reusability

### Backend
- **Node.js & Express:** Powering the server-side application
- **MongoDB & Mongoose:** Efficient, scalable data storage and modeling
- **Bcrypt:** Secure password hashing
- **Plaid API:** Secure financial data integration
- **OpenAI API:** Intelligent transaction categorization

### DevOps & Tooling
- **Git & GitHub:** Version control and collaboration
- **npm:** Package management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Plaid Developer Account
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Budget-Bee.git
   cd Budget-Bee
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp config.example.js config.js
   # Edit config.js with your MongoDB, Plaid, and OpenAI credentials
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. Open `http://localhost:3000` in your browser

## 📊 Project Structure

```
Budget-Bee/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── config.js
│   └── app.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── styles/
│   │   └── App.js
│   └── public/
└── README.md
```

## 🔐 Security

- Implements secure password hashing with bcrypt
- Utilizes environment variables for sensitive information
- Adheres to Plaid's security best practices for financial data handling

## 🔮 Future Enhancements

- [ ] Implement budget setting and tracking features
- [ ] Add support for multiple currency handling
- [ ] Develop a mobile app version
- [ ] Integrate with additional financial institutions

## 👨‍💻 Author

**Asem Alkhawar**
- GitHub: [@AsemAlkhawar](https://github.com/AsemAlkhawar)
- LinkedIn: [Asem Alkhawar](https://www.linkedin.com/in/asem7)

## 🙏 Acknowledgments

- Plaid for their robust financial data APIs
- OpenAI for the powerful ChatGPT model
- The open-source community for their invaluable libraries and tools

