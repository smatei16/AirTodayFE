import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import { Link } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='sign-in-container'>
      <form onSubmit={signIn}>
        <h1 className="mb-4">Log In</h1>
        <div className="mb-3">
          <input type='email' className='form-control' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type='password' className='form-control' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit' className='btn btn-primary'>Log In</button>
      </form>

      <div className="mt-3">
        <p className="mb-0">New to AirToday? <Link to="/register">Create an account!</Link></p>
      </div>
    </div>
  )
}

export default SignIn;
