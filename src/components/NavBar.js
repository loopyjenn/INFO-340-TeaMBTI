import React from "react";
import icon from './iconblue.png';
import { Link } from "react-router-dom";


export function NavBar(props) {
    return (
    <nav>
    <Link to="/home"><img src={icon} alt="four circles around person" className="icon" /></Link>
    <ul>
        <li><Link to="/home" aria-label="home">Home</Link></li>
        <li><Link to="/profile" aria-label="profile">Profile</Link></li>
        <li><Link to="/teams" aria-label="teams">Teams</Link></li>
        <li><Link to="/compatability" aria-label="compatability">Compatability</Link></li>
    </ul>
    </nav>
    );
}