import React from "react";
import { Link } from 'react-router-dom';

export function ProfileCard(props) {
    const { profile, firstTwoTeams } = props;
    
    return (
        <main style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <div className="profile-card">
                <div className="profile-pic">
                    <img src={profile.picture || "./img/blacksnsicon.jpg"} alt="empty profile picture"/>
                </div>

                <div className="name">
                    <h1>{profile.name}</h1>
                    <p>({profile.pronouns || 'Pronouns'})</p>
                    <Link to="/editProfile"><span className="material-symbols-outlined" aria-label="settings">settings</span></Link>
                </div>

                <div className="buttons">
                    <a href="https://www.16personalities.com/free-personality-test" target="_blank"><button className="mbti">{profile.mbti || 'MBTI'}</button></a>
                    <button className="pet-peeve">{profile.petpeeve || 'Pet Peeve'}</button>
                    <button className="hobby">{profile.hobby || 'Hobby'}</button>
                    <a href="https://open.spotify.com/" target="_blank"><button className="fave-song">{profile.favsong || 'Favorite Song'}</button></a>
                </div>

                <div className="teams">
                    <h2>Affiliated Teams:</h2>
                    <ul>
                        {firstTwoTeams.map((team, index) => (
                            <Link key={index} to={"/teams/" + team}><div className="rectclass">
                                <p>{team}</p>
                            </div></Link>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}
