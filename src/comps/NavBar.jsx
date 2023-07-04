import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="nav-bar">
            <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
            {isOpen && (
                <ul className="dropdown-menu">
                    <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/discriminator" onClick={() => setIsOpen(false)}>Discriminator</Link></li>
                </ul>
            )}
        </nav>
    );
};

export default Navigation;
