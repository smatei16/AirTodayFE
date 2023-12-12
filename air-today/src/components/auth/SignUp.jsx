import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const signUp = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Check if password meets requirements (capital letter and number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least one capital letter and one number and minimum 8 characters');
      return;
    }

    // Clear password error if no issues
    setPasswordError('');

    // Continue with creating the user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      }).catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className='sign-up-container'>
      <form onSubmit={signUp}>
        <h1>Create account</h1>
        <div className="form-group">
          <label>Email:</label>
          <input type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <ul className="requirements-list">
          <li>At least 8 characters</li>
          <li>At least one capital letter</li>
          <li>At least one number</li>
        </ul>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type='password' placeholder='Confirm your password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {passwordError && <div className="password-error">{passwordError}</div>}
        <button type='submit'>Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp;
