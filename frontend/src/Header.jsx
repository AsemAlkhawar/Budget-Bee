import React from 'react'; // Import React
import './styles/Header.css'; // Import CSS styles for the header

const Header = ({ title, onLogout }) => { // Define Header component with title and onLogout props
    return (
        <div className="header-container"> {/* Container for the header */}
            <img src="logo.png" alt="Logo" className="header-logo" /> {/* Logo image */}
            <h1 className="header-title">{title}</h1> {/* Title of the header */}
            <button className="logout-button" onClick={onLogout}>Logout</button> {/* Logout button */}
        </div>
    );
};

export default Header; // Export the Header component as default