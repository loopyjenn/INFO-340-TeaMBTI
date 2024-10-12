import React from "react";

export function Navigation(props) {
    return (
        <nav>
        <a href="../project-jsorror/index.html"><img src="./img/iconblue.png" alt="four circles around person" class="icon"/></a>
        <a href="index.html"><img src="img/iconblue.png" alt="four circles around person" class="icon"/></a>
        <ul>
            <li><a href="index.html" aria-label="home">Home</a></li>
            <li><a href="profile.html" aria-label="profile">Profile</a></li>
            <li><a href="teams.html" aria-label="teams">Teams</a></li>
        </ul>
        </nav>
    );
}