import { auth, googleProvider } from '../config/firebase';
import {createUserWithEmailAndPassword, signInWithPopup, signOut} from 'firebase/auth'
import { useState } from 'react';
export const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email)
    const handleSignInClick = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log(`error in handleSignInClick: ${error}`)
        }
    }
    const handleSignInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (error) {
            console.log(`error in handleSignInWithGoogle: ${error}`)
        }
    }
    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(`error in handleLogout: ${error}`)
        }
    }

    return (
        <div>
            <div>
                <input placeholder="Email..." onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div>
                <input 
                placeholder="Password..." 
                onChange={(e)=>setPassword(e.target.value)}
                type="password"/>
            </div>
            <div>
                <button onClick={handleSignInClick}>Sign In</button> 
            </div>
            <div>
                <button onClick={handleSignInWithGoogle}>Sign In With Google</button>
            </div>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}