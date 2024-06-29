import React, { useState } from 'react'; // Import React and useState hook
import Register from './Register.jsx'; // Import Register component
import Login from './Login.jsx'; // Import Login component
import Overview from './Overview.jsx'; // Import Overview component
import { Helmet } from 'react-helmet'; // Import Helmet for managing document head
import './styles/styles.css'; // Import CSS styles

const App = () => {
    const [userId, setUserId] = useState(''); // State to store user ID
    const [isLoginView, setIsLoginView] = useState(true); // State to toggle between login and register view

    const toggleView = () => {
        setIsLoginView(!isLoginView); // Function to toggle between login and register view
    };

    const handleLogout = () => {
        setUserId(null); // Function to handle user logout
    };

    return (
        <div>
            <Helmet>
                <title>Budget Bee</title> // Set the title of the document
                <link rel="icon" href="/logo.png" /> // Set the favicon of the document
            </Helmet>
            {!userId ? ( // Check if user is not logged in
                isLoginView ? ( // Check if the current view is login
                    <Login setUserId={setUserId} toggleView={toggleView} /> // Render Login component
                ) : (
                    <Register setUserId={setUserId} toggleView={toggleView} /> // Render Register component
                )
            ) : (
                <Overview userId={userId} onLogOut={handleLogout} /> // Render Overview component if user is logged in
            )}
        </div>
    );
};

export default App; // Export the App component as default