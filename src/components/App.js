import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { NavBar } from './NavBar.js';
import { Header } from './Header.js';
import { Footer } from './Footer.js';
import { EditProfile } from './EditProfile.js';
import { SignIn } from './SignIn.js';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Teams } from './Teams';
import { Dashboard } from './Home.js';
import { Compatability } from "./compatability.js"
import { ProfileCard } from './ProfileCard.js';
import { getDatabase, ref, onValue } from 'firebase/database';
import '../../src/index.css';

export default function App() {
    const auth = getAuth();

    function ProtectedRoute({ user, children }) {
        if (!user) {
            return <Navigate to="/signin" replace />;
        }
        return children;
    }

    const mbtiOption = [
        { label: 'INTJ', value: 'INTJ' },
        { label: 'INTP', value: 'INTP' },
        { label: 'ENTJ', value: 'ENTJ' },
        { label: 'ENTP', value: 'ENTP' },
        { label: 'INFJ', value: 'INFJ' },
        { label: 'INFP', value: 'INFP' },
        { label: 'ENFJ', value: 'ENFJ' },
        { label: 'ENFP', value: 'ENFP' },
        { label: 'ISTJ', value: 'ISTJ' },
        { label: 'ISFJ', value: 'ISFJ' },
        { label: 'ESTJ', value: 'ESTJ' },
        { label: 'ESFJ', value: 'ESFJ' },
        { label: 'ISTP', value: 'ISTP' },
        { label: 'ISFP', value: 'ISFP' },
        { label: 'ESTP', value: 'ESTP' },
        { label: 'ESFP', value: 'ESFP' },
    ];

    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (user) {
                const db = getDatabase();
                const profileRef = ref(db, 'profiles/' + user.uid);
                onValue(profileRef, (snapshot) => {
                    const data = snapshot.val();
                    setProfile(data || {});
                });
            } else {
                setProfile({});
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const [profile, setProfile] = useState({
        name: 'Name',
        pronouns: 'Pronouns',
        mbti: 'MBTI',
        petpeeve: 'Pet Peeve',
        hobby: 'Hobby',
        favsong: 'Favorite Song',
        mbtiData: {
            EI: 50,
            SN: 50,
            TF: 50,
            JP: 50
        }
    });

    const [firstTwoTeams, setFirstTwoTeams] = useState([]);

    return (
        <div>
            <NavBar />
            <Header />
            <Routes>
                {user && (
                    <>
                        <Route path="/editProfile" element={
                            <ProtectedRoute user={user}>
                                <EditProfile profile={profile} setProfile={setProfile} mbtiOption={mbtiOption} />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute user={user}>
                                <ProfileCard profile={profile} firstTwoTeams={firstTwoTeams} />
                            </ProtectedRoute>
                        } />
                        <Route path="/home" element={
                            <ProtectedRoute user={user}>
                                <Dashboard firstTwoTeams={firstTwoTeams} mbtiData={profile.mbtiData} mbtiType={profile.mbti} />
                            </ProtectedRoute>
                        } />
                        <Route path="/teams" element={
                            <ProtectedRoute user={user}>
                                <Teams setFirstTwoTeams={setFirstTwoTeams} profile={profile} setProfile={setProfile} mbtiOption={mbtiOption} />
                            </ProtectedRoute>
                        } />
                        <Route path="/teams/:teamName" element={
                            <ProtectedRoute user={user}>
                                <Teams profile={profile} setProfile={setProfile} mbtiOption={mbtiOption} setFirstTwoTeams={setFirstTwoTeams} />
                            </ProtectedRoute>
                        } />
                        <Route path="/compatability" element={
                            <ProtectedRoute user={user}>
                                <Compatability profile={profile} />
                            </ProtectedRoute>
                        } />
                    </>
                )}
                {!user && <Route path="/" element={<SignIn />} />}
            </Routes>
            <Footer />
        </div>
    );
}
