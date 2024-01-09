import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

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
        navigateSignIn();
      }).catch((error) => {
        // console.log(error);
        switch(error.code){
          case 'auth/email-already-in-use':
            setPasswordError("Email already in use");
            console.log(`email address already in use.`);
            break;
          default:
          console.log(error.message);
          break;
        }

      });
  }

  const navigateSignIn = () => {
    navigate('/');
  }

  return (
    <div>
      <nav class="nav1">
        <img src={logo} alt="Logo" class='logo' height="50" onClick={() => navigate("/")}></img>
      </nav>
      <div class="main-content2">
        <div class="box">
          <span class="borderLine"></span>
          <form onSubmit={signUp}>
            <h2>Create account</h2>
            <div class="inputBox1">
              <input type="email" required="required" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <span>Email</span>
              <i></i>
            </div>
            <div class="inputBox1">
              <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <span>Password</span>
              <i></i>
            </div>
            <ul class="requirements-list">
              <li>At least 8 characters</li>
              <li>At least one capital letter</li>
              <li>At least one number</li>
            </ul>
            <div class="inputBox1">
              <input type="password" required="required" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              <span>Confirm your password</span>
              <i></i>
            </div>
            <div class="links">
              <a>Already registered?</a>
              <a href="/login">Sign In</a>
              {/* <a className="mb-0">New to AirToday? <Link to="/register">Create an account!</Link></a> */}
              {/* <a href="#">New to AirToday? Create an account!</a> */}
            </div>
            <input type="submit" value="Register"/>
            {passwordError && <p class="error">{passwordError}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
