import React, { useState } from 'react'; // Import React and useState hook
import axios from 'axios'; // Import axios for making HTTP requests
import './styles/styles.css'; // Import CSS styles

const Login = ({ setUserId, toggleView }) => { // Define Login component with setUserId and toggleView props
    const [email, setEmail] = useState(''); // State to store email
    const [password, setPassword] = useState(''); // State to store password

    const handleSubmit = async (e) => { // Function to handle form submission
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('/api/login', { email, password }); // Send login request to server
            setUserId(response.data.id); // Set user ID on successful login
        } catch (error) {
            alert(error.response.data.error); // Show error message on failed login
        }
    };

    return (
        <div className="welcome-container"> {/* Container for the login form */}
            <img src="/logo.png" alt="Budget Bee Logo" className="logo" /> {/* Logo image */}
            <h2 className="title">Login</h2> {/* Title of the login form */}
            <div>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> {/* Email input field */}
                <br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /> {/* Password input field */}
                <br />
                <button onClick={handleSubmit}>Login</button> {/* Login button */}
                <br />
                <button onClick={toggleView}>No account? Sign up</button> {/* Button to toggle to the register view */}
            </div>
        </div>
    );
};

export default Login; // Export the Login component as default