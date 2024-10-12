import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { TeamsCharts } from './TeamsCharts';

function Teams({ profile, setFirstTwoTeams, mbtiOption }) {
    const [teamName, setTeamName] = useState('');
    const [teamList, setTeamList] = useState([]);
    const [currentTeamIndex, setCurrentTeamIndex] = useState(null);
    const { teamName: paramTeamName } = useParams();
    const [showMbtiForm, setShowMbtiForm] = useState(false);
    const [mbtiData, setMbtiData] = useState({});
    const [editingProfileIndex, setEditingProfileIndex] = useState(null);
    const navigate = useNavigate();
    const [selectedProfiles, setSelectedProfiles] = useState([]);
    const [showCheckmark, setShowCheckmark] = useState(true);

    const db = getDatabase();

    const addTeamToFirebase = (teamName, profiles) => {
        const teamRef = ref(db, 'teams/' + teamName);
        set(teamRef, { teamName, profiles })
            .then(() => console.log('Team added to Firebase'))
            .catch((error) => console.error("Error adding team to Firebase: ", error));
        setShowCheckmark(false);
    };

    const fetchTeamsFromFirebase = () => {
        const teamsRef = ref(db, 'teams');
        onValue(teamsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const teams = Object.values(data);
                setTeamList(teams);
            } else {
                setTeamList([]);
            }
        });
    };

    const handleAddTeam = () => {
        if (teamName !== '') {
            const newTeam = { teamName, profiles: [{ ...profile, isDefaultProfile: true }] };
            addTeamToFirebase(teamName, newTeam.profiles);
            setTeamList(prevTeamList => {
                const updatedTeamList = [...prevTeamList, newTeam];
                setCurrentTeamIndex(updatedTeamList.length - 1);
                return updatedTeamList;
            });
            setTeamName('');
            setShowCheckmark(false);
        }
    };
    
    const handleAddProfile = () => {
        if (currentTeamIndex !== null) {
            const currentProfiles = teamList[currentTeamIndex].profiles;
            if (currentProfiles.length < 6) {
                const newProfile = {
                    name: 'Name',
                    mbti: 'MBTI',
                    petpeeve: 'Pet Peeve',
                    hobby: 'Hobby',
                    favsong: 'Favorite Song',
                    isEditing: true,
                    isDefaultProfile: false
                };
                const updatedProfiles = [...currentProfiles, newProfile];
                const updatedTeamList = [...teamList];
                updatedTeamList[currentTeamIndex].profiles = updatedProfiles;
                setTeamList(updatedTeamList);
                addProfileToFirebase(teamName, updatedProfiles);
            }
        }
    };

    // const handleCompatibilityFormSubmit = (e, member1Index, member2Index) => {
    //     e.preventDefault();
    //     if (member1Index !== null && member2Index !== null) {
    //         const profiles = teamList[currentTeamIndex].profiles;
    //         setSelectedProfiles([profiles[member1Index], profiles[member2Index]]);
    //         navigate('/compatability', { state: { profiles: [profiles[member1Index], profiles[member2Index]] } });
    //     } else {
    //         alert('Please select two members.');
    //     }
    // };

    useEffect(() => {
        if (paramTeamName) {
            let teamIndex = null;
            for (let i = 0; i < teamList.length; i++) {
                if (teamList[i].teamName === paramTeamName) {
                    teamIndex = i;
                    setCurrentTeamIndex(i);
                    setTeamName(paramTeamName);
                    break;
                }
            }
            if (teamIndex === null) {
            }
        }
    }, [paramTeamName, teamList]);
    

    useEffect(() => {
        fetchTeamsFromFirebase();
    }, []);
    
    const addProfileToFirebase = (teamName, updatedProfiles) => {
        const teamRef = ref(db, 'teams/' + teamName + '/profiles');
        set(teamRef, updatedProfiles)
            .then(() => console.log('Profile added to Firebase'))
            .catch((error) => console.error("Error adding profile to Firebase: ", error));
    };
    
    const handleInputChange = (index, field, value) => {
        const updatedTeamList = [...teamList];
        updatedTeamList[currentTeamIndex].profiles[index][field] = value;
        setTeamList(updatedTeamList);
        updatedTeamList[currentTeamIndex].profiles[index].isEditing = true;
    };

    const handleSave = (index) => {
        const updatedTeamList = [...teamList];
        updatedTeamList[currentTeamIndex].profiles[index].isEditing = false;
        setTeamList(updatedTeamList);
        updateProfilesInFirebase(updatedTeamList[currentTeamIndex].profiles);
    };

    const handleEdit = (index) => {
        const updatedTeamList = teamList.map((team, teamIndex) => {
            if (teamIndex !== currentTeamIndex) return team;
            return {
                ...team,
                profiles: team.profiles.map((profile, profileIndex) => {
                    if (profileIndex === index) {
                        return { ...profile, isEditing: true };
                    } else {
                        return { ...profile, isEditing: false };
                    }
                })
            };
        });
        setTeamList(updatedTeamList);
    };
    

    const handleDelete = (index) => {
        const updatedTeamList = [...teamList];
        updatedTeamList[currentTeamIndex].profiles = updatedTeamList[currentTeamIndex].profiles.filter((_, i) => i !== index);
        setTeamList(updatedTeamList);
        updateProfilesInFirebase(updatedTeamList[currentTeamIndex].profiles);
    };

    const updateProfilesInFirebase = (profiles) => {
        const teamRef = ref(db, 'teams/' + teamName + '/profiles');
        set(teamRef, profiles)
            .then(() => console.log('Profiles updated in Firebase'))
            .catch((error) => console.error("Error updating profiles in Firebase: ", error));
    };

    const handleTeamSelect = (index) => {
        setCurrentTeamIndex(index);
        setTeamName(teamList[index].teamName);
    };

    const handleMbtiInputChange = (e) => {
        const { name, value } = e.target;
        const updatedMbtiData = { ...mbtiData };
        updatedMbtiData[editingProfileIndex] = {
            ...updatedMbtiData[editingProfileIndex],
            [name]: value
        };
        setMbtiData(updatedMbtiData);
    };
    
    const handleMbtiFormSubmit = (e) => {
        e.preventDefault();
        const currentProfileMbtiData = mbtiData[editingProfileIndex];
        if (
            currentProfileMbtiData &&
            (currentProfileMbtiData.EI < 50 ||
            currentProfileMbtiData.SN < 50 ||
            currentProfileMbtiData.TF < 50 ||
            currentProfileMbtiData.JP < 50 ||
            currentProfileMbtiData.EI > 100 ||
            currentProfileMbtiData.SN > 100 ||
            currentProfileMbtiData.TF > 100 ||
            currentProfileMbtiData.JP > 100 )
        ) {
            alert("Percentages must be equal to or greater than 50, and less than 100.");
        } else {
            setShowMbtiForm(false);
            setEditingProfileIndex(null);
            
            const currentProfileIndex = editingProfileIndex;
            const updatedProfiles = [...teamList[currentTeamIndex].profiles];
            updatedProfiles[currentProfileIndex].mbtiData = currentProfileMbtiData;
            const teamRef = ref(db, 'teams/' + teamName + '/profiles');
            set(teamRef, updatedProfiles)
                .then(() => console.log('MBTI data updated in Firebase'))
                .catch((error) => console.error("Error updating MBTI data in Firebase: ", error));
        }
    };

    const resetToDefaultState = () => {
        if (teamName !== '') {
            setTeamName('');
            setCurrentTeamIndex(null);
        }
        setShowCheckmark(true); 
    };
    

    const showMbtiFormForProfile = (index) => {
        setShowMbtiForm(true);
        setEditingProfileIndex(index);
        if (!mbtiData[index]) {
            setMbtiData({
                ...mbtiData,
                [index]: { EI: '', SN: '', TF: '', JP: '' }
            });
        }
    };

    const [firstTwoTeamNames, setFirstTwoTeamNames] = useState([]);

    useEffect(() => {
        if (teamList.length >= 2) {
            setFirstTwoTeamNames([teamList[0].teamName, teamList[1].teamName]);
        }
    }, [teamList]);
    

    return (
        <div>
        <main>
            <header>
                <input
                    id="team-name"
                    type="text"
                    placeholder="Team Name..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                {showCheckmark && (
                    <img
                        className="checkmark"
                        src="../img/check.png"
                        alt="checkmark icon"
                        onClick={handleAddTeam}
                    />
                )}
                {currentTeamIndex !== null && (
                    <div className="profile" onClick={handleAddProfile}>
                        <div id="circle">
                            <img src="../img/plus.png" alt="addition icon" />
                        </div>
                    </div>
                )}
            </header>
            <div className="rect">
                    {currentTeamIndex !== null && teamList[currentTeamIndex] && teamList[currentTeamIndex].profiles.map((profile, index) => (
                        <Profile
                            key={index}
                            profile={profile}
                            index={index}
                            onInputChange={handleInputChange}
                            onSave={handleSave}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            setShowMbtiForm={() => showMbtiFormForProfile(index)}
                            mbtiOption={mbtiOption}
                        />
                    ))}
            </div>
            
            <div className="rectteamslist">
                <h3>My Teams</h3>
                {teamList.map((team, index) => (
                    <Link key={index} to={"/teams/" + team.teamName} onClick={() => handleTeamSelect(index)}>
                        <h4 style={{ top: (25 + index * 10) + '%' }}>{team.teamName}</h4>
                    </Link>
                ))}
                <a onClick={resetToDefaultState}>
                    <img src="../img/plus.png" alt="addition icon" />
                </a>
            </div>
            {/* <h2 className="comph2">Compatibility</h2>
            <h3 className="comph3">Create New Compatibility Assessment</h3>
            <div className="createform">
                {currentTeamIndex !== null && <CompatibilityForm profiles={teamList[currentTeamIndex].profiles} onSubmit={handleCompatibilityFormSubmit} />}
            </div> */}
            <div>
                {showMbtiForm && editingProfileIndex !== null && (
                    <form className="mbti-form" onSubmit={handleMbtiFormSubmit}>
                        <div className="input-group">
                            <label htmlFor="EI">E/I Percentage:</label>
                            <input
                                type="number"
                                id="EI"
                                name="EI"
                                value={mbtiData[editingProfileIndex].EI}
                                onChange={handleMbtiInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="SN">S/N Percentage:</label>
                            <input
                                type="number"
                                id="SN"
                                name="SN"
                                value={mbtiData[editingProfileIndex].SN}
                                onChange={handleMbtiInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="TF">T/F Percentage:</label>
                            <input
                                type="number"
                                id="TF"
                                name="TF"
                                value={mbtiData[editingProfileIndex].TF}
                                onChange={handleMbtiInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="JP">J/P Percentage:</label>
                            <input
                                type="number"
                                id="JP"
                                name="JP"
                                value={mbtiData[editingProfileIndex].JP}
                                onChange={handleMbtiInputChange}
                            />
                        </div>
                        <button type="submit" className="submit-button">Save MBTI</button>
                    </form>
                )}
            </div>
        </main>
        {profile.isEditing && (
                <TeamsCharts
                    profiles={[profile]}
                    customClass="teams-chart"
                />
            )}
        </div>
    );
}    

function Profile({ profile, index, onInputChange, onSave, onEdit, onDelete, setShowMbtiForm, mbtiOption }) {
    let profileContent;

    if (profile.isEditing) {
        profileContent = (
            <div className="profile-content">
                <input
                    type="text"
                    value={profile.name}
                    placeholder="Name"
                    onChange={(e) => onInputChange(index, 'name', e.target.value)}
                />
                <select
                    className="teams"
                    value={profile.mbti}
                    onChange={(e) => onInputChange(index, 'mbti', e.target.value)}
                >
                    <option value="" >Select MBTI</option>
                    {mbtiOption.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Pet Peeve"
                    value={profile.petpeeve}
                    onChange={(e) => onInputChange(index, 'petpeeve', e.target.value)}
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
                    value={profile.favsong}
                    onChange={(e) => onInputChange(index, 'favsong', e.target.value)}
                />
                <button className="savebutton" onClick={() => onSave(index)}>Save</button>
            </div>
        );
    } else {
        profileContent = (
            <div className="profile-content">
                <h5>{profile.name || 'Name'}</h5>
                <button className="tag" id="mbti">{profile.mbti || 'MBTI'}</button>
                <button className="tag" id="petpeeve">{profile.petpeeve || 'Pet Peeve'}</button>
                <button className="tag" id="hobby">{profile.hobby || 'Hobby'}</button>
                <button className="tag" id="favsong">{profile.favsong || 'Favorite Song'}</button>
                {!profile.isDefaultProfile && <button className="editbutton" onClick={() => onEdit(index)}>Edit</button>}
            </div>
        );
    }
    
    const mbtiChartData = profile.isEditing && profile.mbtiData && (
        <TeamsCharts mbtiData={profile.mbtiData} mbtiType={profile.mbti} />
    ) || null;

    return (
        <div className="newprofile">
            <div id="newcircle"></div>
            {!profile.isDefaultProfile && profile.isEditing && <button className="calcbutton" onClick={setShowMbtiForm}><img src="../img/editmbti.png" alt="Edit MBTI" /></button>}
            {!profile.isDefaultProfile && <button className="delbutton" onClick={() => onDelete(index)}><img src="../img/trash.png" alt="Delete" /></button>}
            {profileContent}
            {mbtiChartData}
        </div>
    );
}

// function CompatibilityForm({ profiles, onSubmit }) {
//     const [member1Index, setMember1Index] = useState(null);
//     const [member2Index, setMember2Index] = useState(null);

//     const handleMember1Change = (e) => {
//         setMember1Index(e.target.value);
//     };
    
//     const handleMember2Change = (e) => {
//         setMember2Index(e.target.value);
//     };
    
//     return (
//         <form className="team" onSubmit={(e) => onSubmit(e, member1Index, member2Index)}>
//             <select id="members" name="members" onChange={handleMember1Change}>
//                 <option value="starter" disabled>Select Member #1</option>
//                 {[{ name: "Select Member #1", hidden: true }, ...profiles].map((profile, index) => {
//                     let displayStyle = 'block';
//                     if (profile.hidden) {
//                         displayStyle = 'none';
//                     }
//                     return (
//                         <option key={index} value={index} style={{ display: displayStyle }}>
//                             {profile.name}
//                         </option>
//                     );
//                 })}
//             </select>
//             <select id="members2" name="members2" onChange={handleMember2Change}>
//                 <option value="starter" disabled>Select Member #2</option>
//                 {[{ name: "Select Member #2", hidden: true }, ...profiles].map((profile, index) => {
//                     let displayStyle = 'block';
//                     if (profile.hidden) {
//                         displayStyle = 'none';
//                     }
//                     return (
//                         <option key={index} value={index} style={{ display: displayStyle }}>
//                             {profile.name}
//                         </option>
//                     );
//                 })}
//             </select>
//             <button className="compsubmit" type="submit" value="Run Test">Run Test</button>
//         </form>
//     );
// }

export { Teams };