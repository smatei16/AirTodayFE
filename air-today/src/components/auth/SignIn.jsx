import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import { auth } from "../../firebase";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigateMap();
      }).catch((error) => {
        console.log(error);
        switch(error.code){
          case 'auth/invalid-credential':
            setLoginError("Invalid credentials");
            console.log('Invalid credentials');
            break;
          default:
          console.log(error.message);
          break;
        }
      });
  }

  const navigateMap = () => {
    navigate('/map');
  }

  return (
    <div>
      <nav class="nav2">
        <img src={logo} alt="Logo" className='logo' height="50" onClick={() => navigate("/")}></img>
      </nav>
      <div class="main-content1">
        <div class="box">
          <span class="borderLine"></span>
          <form onSubmit={signIn}>
            <h2>Sign In</h2>
            <div class="inputBox">
              <input type="email" required="required" value={email} onChange={(e) => setEmail(e.target.value)}/>
              <span>Email</span>
              <i></i>
            </div>
            <div class="inputBox">
              <input type="password" required="required" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <span>Password</span>
              <i></i>
            </div>
            <div class="links">
              <a>New to AirToday?</a>
              <a href="/register">Create an account!</a>
              {/* <a className="mb-0">New to AirToday? <Link to="/register">Create an account!</Link></a> */}
              {/* <a href="#">New to AirToday? Create an account!</a> */}
            </div>
            <input type="submit" value="Login"/>
            {loginError && <p class="error">{loginError}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn;