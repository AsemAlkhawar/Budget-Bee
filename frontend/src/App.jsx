// frontend/src/App.js
import React, { useState } from 'react';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Overview from './Overview.jsx';

const App = () => {
    const [userId, setUserId] = useState('');

    return (
        <div>
            {!userId ? (
                <>
                    <Register />
                    <Login setUserId={setUserId} />
                </>
            ) : (
                <Overview userId={userId} />
            )}
        </div>
    );
};

export default App;
