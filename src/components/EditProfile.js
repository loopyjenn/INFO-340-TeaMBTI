import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { UploadImages } from "./UploadImages";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from 'firebase/auth';


export function EditProfile(props) {
    const { profile, setProfile, mbtiOption } = props;
    const auth = getAuth();
    const db = getDatabase();
    
    const [formData, setFormData] = useState(profile);
    const [showMbtiForm, setShowMbtiForm] = useState(false);
    const [showUpload, setShowUpload] = useState(true);
    const [profilePicture, setProfilePicture] = useState(profile.picture || '');

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
   
    const handleMbtiChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            mbtiData: {
                ...formData.mbtiData,
                [name]: value
            }
        });
    };
   
    /*
    const handleSubmit = () => {
        setProfile({ ...formData, picture: profilePicture });
    };
    */

    const handleSubmit = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const profileRef = ref(db, 'profiles/' + user.uid);
                await set(profileRef, { ...formData, picture: profilePicture });
                setProfile({ ...formData, picture: profilePicture });
                alert('Profile updated successfully');
            } else {
                alert('No user is signed in');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    
    const handleMbtiSubmit = () => {
        if (
            formData.mbtiData &&
            (formData.mbtiData.EI < 50 ||
            formData.mbtiData.SN < 50 ||
            formData.mbtiData.TF < 50 ||
            formData.mbtiData.JP < 50 ||
            formData.mbtiData.EI > 100 ||
            formData.mbtiData.SN > 100 ||
            formData.mbtiData.TF > 100 ||
            formData.mbtiData.JP > 100 )
        ) {
            alert("Percentages must be equal to or greater than 50, and less than 100.");
        } else {
            console.log("MBTI Data submitted", formData.mbtiData);
            setShowMbtiForm(false);
            handleSubmit();
        }
    };

    return (
        <main style={{ minHeight: '100vh', overflowY: 'auto' }}>
            <section className="profile-card">
                <img onClick={() => setShowMbtiForm(!showMbtiForm)} className="edit-percent" src="./img/editmbti.png" alt="Edit MBTI" />
                <div className="profile-pic" onClick={() => setShowUpload(true)}>
                <img src={profilePicture || "./img/blacksnsicon.jpg"} onClick={() => setShowUpload(true)} alt="empty profile picture" />
                </div>
                {showUpload && <UploadImages setProfilePicture={setProfilePicture} />}
                <div className="profile-info">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <div className="name-label">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className='pronouns-label'>
                            <label htmlFor="pronouns">Pronouns</label>
                            <input type="text" className="form-control" id="pronouns" name="pronouns" value={formData.pronouns} onChange={handleChange} />
                        </div>
                        <select className="edit-profile" id="types" name="mbti" value={formData.mbti} onChange={handleChange}>
                            <option value="starter">Edit MBTI</option>
                            {mbtiOption.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <input type="text" placeholder="Edit Pet Peeve" className="edit" id="petpeeve" name="petpeeve" value={formData.petpeeve} onChange={handleChange}></input>
                        <input type="text" placeholder="Edit Hobby" className="edit" id="hobby" name="hobby" value={formData.hobby} onChange={handleChange}></input>
                        <input type="text" placeholder="Edit Favorite Song" className="edit" id="favsong" name="favsong" value={formData.favsong} onChange={handleChange}></input>
                        <Link to="/profile">
                            <input type="button" className='btn btn-outline-dark' value="Submit" onClick={handleSubmit} />
                        </Link>
                    </form>
                </div>
                {showMbtiForm && (
                <div className="mbti-container">
                    <div className="mbti-form-user">
                        <label htmlFor="EI">E/I Percentage:</label>
                        <input type="number" id="EI" name="EI" value={(formData.mbtiData && formData.mbtiData.EI) || ''} onChange={handleMbtiChange} />
                        <label htmlFor="SN">S/N Percentage:</label>
                        <input type="number" id="SN" name="SN" value={(formData.mbtiData && formData.mbtiData.SN) || ''} onChange={handleMbtiChange} />
                        <label htmlFor="TF">T/F Percentage:</label>
                        <input type="number" id="TF" name="TF" value={(formData.mbtiData && formData.mbtiData.TF) || ''} onChange={handleMbtiChange} />
                        <label htmlFor="JP">J/P Percentage:</label>
                        <input type="number" id="JP" name="JP" value={(formData.mbtiData && formData.mbtiData.JP) || ''} onChange={handleMbtiChange} />
                        <button type="button" className="submit-button" onClick={handleMbtiSubmit}>Save MBTI</button>
                        <img className="infoicon" src="../img/info.png" alt="info icon" />
                        <div className="infodesc">
                        Visit 16personalities.com, and under "Your Profile" and "Overview", copy the percentages of each type for your personality!
                        </div>
                    </div>
                </div>
                )
                }
            </section>
        </main>
    );
}
