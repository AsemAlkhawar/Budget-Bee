import React, { useState, useEffect } from 'react';

function Test1() {
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetch('/')
            .then(res => res.text())
            .then(
                msg => {
                    setMsg(msg);
                    console.log(msg);
                }
            ).catch(err => console.error('Error fetching data:', err));
    }, []);

    return (
        <div>
            {msg && <p>{msg} + 5</p>}  // Display the message in the component
        </div>
    );
}

export default Test1;
