import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const MapComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        navigateLogin();
      }
    })
  })

  useEffect(() => {
    loadModules(['esri/config', 'esri/Map', 'esri/views/MapView'], { css: true })
      .then(([esriConfig, Map, MapView]) => {
        // Adaugă cheia API
        esriConfig.apiKey = 'AAPK6f8e89b5cf0a47948d9b73025c20fe1eX6JYT1csqWTHrDRabpXSs8zaKl_2dCXLhR7MZ5fU15PPlDnhkVzjbCqqPXqCeJtR';

        const map = new Map({
          basemap: 'streets-vector'
        });

        const view = new MapView({
          container: 'mapContainer',
          map: map,
          center: [26.096306, 44.439663],
          zoom: 10
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log('Sign out successful')
      navigateLogin();
    }).catch(error => console.log(error))
  }

  const navigateLogin = () => {
    navigate('/');
  }

  return(
    <div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '0px', borderBottom: '1px solid #ccc' }}>
        <p style={{ margin: 0 }}>Signed in as {currentUser ? currentUser.email : 'Unknown user'}</p>
        <button onClick={handleSignOut}>Logout</button>
      </div>
      <div id="mapContainer" style={{ height: 'calc(100vh - 60px)' }}></div>
    </div>
  )
};

export default MapComponent;
