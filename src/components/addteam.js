import React, { useState } from 'react';

function NavBar() {
    return (
        <nav>
            <a href="../project-jsorror/index.html"><img src="./img/iconblue.png" alt="four circles around person" className="icon" /></a>
            <ul>
                <li><a href="../project-jsorror/index.html" aria-label="home">Home</a></li>
                <li><a href="../project-jsorror/profile.html" aria-label="profile">Profile</a></li>
                <li><a href="../project-jsorror/teams.html" aria-label="teams">Teams</a></li>
            </ul>
        </nav>
    );
}

// // function SideBar() {
// //     const [teams, setTeams] = useState(['The Daily', 'Team 1']);
// //     const [newTeamName, setNewTeamName] = useState('');

// //     const addTeam = () => {
// //         if (newTeamName) {
// //             setTeams([...teams, newTeamName]);
// //             setNewTeamName('');
// //         }
// //     };

// //     return (
// //         <div id="sidebar">
// //             <div id="teams-menu">
// //                 {teams.map((team, index) => (
// //                     <div className="team" key={index}><span>{team}</span></div>
// //                 ))}
// //                 <input 
// //                     type="text"
// //                     value={newTeamName}
// //                     onChange={(e) => setNewTeamName(e.target.value)}
// //                     placeholder="Add new team..."
// //                 />
// //                 <button onClick={addTeam}>+ Add Team</button>
// //             </div>
// //         </div>
// //     );
// // }

function MainContent() {
    const [teamName, setTeamName] = useState('');
    const [teamList, setTeamList] = useState([]);
    const [profiles, setProfiles] = useState([]);

    const handleAddTeam = () => {
        if (teamName !== '') {
            setTeamList([...teamList, teamName]);
            setTeamName(teamName);
        }
    };

    const handleAddProfile = () => {
        if (profiles.length < 6) {
            const newProfile = {
                name: 'Name',
                mbti: 'MBTI',
                petPeeve: 'Pet Peeve',
                hobby: 'Hobby',
                favoriteSong: 'Favorite Song',
                isEditing: true
            };
            setProfiles([...profiles, newProfile]);
        } 
    };

    const handleInputChange = (index, field, value) => {
        const updatedProfiles = [...profiles];
        updatedProfiles[index][field] = value;
        setProfiles(updatedProfiles);
    };

    const handleSave = (index) => {
        const updatedProfiles = [...profiles];
        updatedProfiles[index].isEditing = false;
        setProfiles(updatedProfiles);
    };

    const handleEdit = (index) => {
        const updatedProfiles = [...profiles];
        updatedProfiles[index].isEditing = true;
        setProfiles(updatedProfiles);
    };

    return (
        <main>
            <header>
                <input
                    id="team-name"
                    type="text"
                    placeholder="Team Name..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <img
                    src="./img/check.png"
                    alt="checkmark icon"
                    onClick={handleAddTeam}
                />
                <div className="profile" onClick={handleAddProfile}>
                    <div id="circle">
                        <img src="./img/plus.png" alt="addition icon" />
                    </div>
                </div>
            </header>
            <div className="rect">
                {profiles.map((profile, index) => (
                    <Profile
                        key={index}
                        profile={profile}
                        index={index}
                        onInputChange={handleInputChange}
                        onSave={handleSave}
                        onEdit={handleEdit}
                    />
                ))}
            </div>
            <div className="rectteamslist">
                <h3>My Teams</h3>
                {teamList.map((team, index) => (
                    <h4 key={index} style={{ top: (25 + index * 10) + '%' }}>{team}</h4>
                ))}
                <a><img src="./img/plus.png" alt="addition icon" /></a>
            </div>
            <h2 className="comph2">Compatibility</h2>
            <h3 className="comph3">Create New Compatibility Assessment</h3>
            <div className="createform">
                <CompatibilityForm profiles={profiles} />
            </div>
        </main>
    );
}

function Profile({ profile, index, onInputChange, onSave, onEdit }) {
    let profileContent;

    if (profile.isEditing) {
        profileContent = (
            <div>
                <input
                    type="text"
                    value={profile.name}
                    placeholder="Name"
                    onChange={(e) => onInputChange(index, 'name', e.target.value)}
                />
                <input
                    type="text"
                    value={profile.mbti}
                    placeholder="MBTI"
                    onChange={(e) => onInputChange(index, 'mbti', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Pet Peeve"
                    value={profile.petPeeve}
                    onChange={(e) => onInputChange(index, 'petPeeve', e.target.value)}
                />
                <input
                    type="text"
                    value={profile.hobby}
                    placeholder="Hobby"
                    onChange={(e) => onInputChange(index, 'hobby', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Favorite Song"
                    value={profile.favoriteSong}
                    onChange={(e) => onInputChange(index, 'favoriteSong', e.target.value)}
                />
                <button className="savebutton" onClick={() => onSave(index)}>Save</button>
            </div>
        );
    } else {
        profileContent = (
            <div>
                <h5>{profile.name}</h5>
                <button className="tag">{profile.mbti}</button>
                <button className="tag">{profile.petPeeve}</button>
                <button className="tag">{profile.hobby}</button>
                <button className="tag">{profile.favoriteSong}</button>
                <button className="editbutton" onClick={() => onEdit(index)}>Edit</button>
            </div>
        );
    }

    return (
        <div className="newprofile">
            <div id="newcircle"></div>
            {profileContent}
        </div>
    );
}

function CompatibilityForm({ profiles }) {
    return (
        <form>
            <select id="members" name="members">
                <option value="starter" selected>Choose Member #1</option>
                {profiles.map((profile, index) => (
                    <option key={index} value={"member" + {index}}>
                        {profile.name}
                    </option>
                ))}
            </select>
            <select id="members2" name="members2">
                <option value="starter" selected>Choose Member #2</option>
                {profiles.map((profile, index) => (
                    <option key={index} value={"member" + {index}}>
                        {profile.name}
                    </option>
                ))}
            </select>
            <input className="compsubmit" type="submit" value="Run Test" />
        </form>
    );
}

function Footer() {
    return (
        <footer>
            <p>&copy; 2024 teaMBTI</p>
        </footer>
    );
}

export { NavBar, MainContent, Footer };
