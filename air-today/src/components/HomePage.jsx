// App.js

import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import './HomePage.css';
import logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulează actualizarea automată a numerelor
    const userInterval = setInterval(() => {
      setUserCount((prevCount) => prevCount + 1);
    }, 3000);

    const sensorsInterval = setInterval(() => {
      setProductCount((prevCount) => prevCount + 5);
    }, 5000);

    const queriesInterval = setInterval(() => {
      setOrderCount((prevCount) => prevCount + 2);
    }, 7000);

    return () => {
      clearInterval(userInterval);
      clearInterval(sensorsInterval);
      clearInterval(queriesInterval);
    };
  }, []);

  const usersEnd = 100;
  const citiesEnd = 100;
  const sensorsEnd = 100;

  return (
    <div className="landing-page">
      <nav class='nav3'>
        <img src={logo} alt="Logo" className='logo' height="50" onClick={() => navigate("/home")}></img>
        <div className="nav-buttons">
          <button className='button-32' onClick={() => navigate("/login")}>Sign In</button>
          <button className='button-32' onClick={() => navigate("/register")}>Sign Up</button>
        </div>
      </nav>
      <div className="main-content">
      <section>
        <h3 class="heading">Users</h3>
        <div class="columnhome">
            <CountUp class="counter" start={0} end={usersEnd} duration={2} separator=','></CountUp>
        </div>
    </section>
    <section>
        <h3 class="heading">Cities</h3>
        <div class="columnhome">
          <CountUp class="counter" start={0} end={citiesEnd} duration={2} separator=','></CountUp>
        </div>
    </section>
    <section>
        <h3 class="heading">Sensors</h3>
        <div class="columnhome">
          <CountUp class="counter" start={0} end={sensorsEnd} duration={2} separator=','></CountUp>+
        </div>
    </section>
      </div>
      <div class="footer">
        <p class="copyright">&copy; 2023 AirToday. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
