import React, { useState } from 'react'; // Import React and useState hook
import axios from 'axios'; // Import axios for making HTTP requests
import './styles/styles.css'; // Import CSS styles

const Register = ({ toggleView, setUserId }) => { // Define Register component with toggleView and setUserId props
    const [email, setEmail] = useState(''); // State to store email
    const [password, setPassword] = useState(''); // State to store password

    const handleSubmit = async (e) => { // Function to handle form submission
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('/api/register', { email, password }); // Send registration request to server
            setUserId(response.data.id); // Set user ID on successful registration
        } catch (error) {
            alert(error.response.data.error); // Show error message on failed registration
        }
    };

    return (
        <div className="welcome-container"> {/* Container for the registration form */}
            <img src="/logo.png" alt="Budget Bee Logo" className="logo" /> {/* Logo image */}
            <h2 className="title">Register</h2> {/* Title of the registration form */}
            <div>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /> {/* Email input field */}
                <br />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /> {/* Password input field */}
                <br />
                <button onClick={handleSubmit}>Register</button> {/* Register button */}
                <br />
                <button onClick={toggleView}>Have an account? Login</button> {/* Button to toggle to the login view */}
            </div>
        </div>
    );
};

export default Register; // Export the Register component as default