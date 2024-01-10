/* global FeatureLayer */

import React, { useEffect, useState } from 'react';
import { loadModules } from 'esri-loader';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MapComponent.css';

const MapComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeView, setActiveView] = useState(0);
  const navigate = useNavigate();
  let view;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        //navigateLogin();
      }
    });
  }, []);

  const addFavorite = (sensorId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(sensorId)) {
        console.log("Sensor #" + sensorId + " is no longer favorite");
        return prevFavorites.filter((id) => id !== sensorId);
      } else {
        console.log("Sensor #" + sensorId + " is favorite");
        return [...prevFavorites, sensorId];
      }
    });
    
    console.log(favorites);
  };


  const fetchAirlySensorData = async () => {
    try {
      const response = await axios.get(
        'https://airapi.airly.eu/v2/installations/nearest',
        {
          params: {
            lat: 44.439663,
            lng: 26.096306,
            maxDistanceKM: 1000,
            maxResults: 2,
          },
          headers: {
            // Matei
            //'apikey': 'TssNii8X18s027VN30d8CZbMr45rcq72',

            //Raul
            'apikey': 'ryvBA9hSdtMMOw88KClTQLiwZILiaBCJ',
          },
        }
      );

      // Filter sensors only in Romania
      const romaniaSensors = response.data.filter((sensor) => sensor.address.city === 'Municipiul București');

      return romaniaSensors;
    } catch (error) {
      console.error('Error fetching Airly sensor data:', error);
      throw error;
    }
  };

  const fetchAirlySensorDetails = async (sensorID) => {
    try {
      const response = await axios.get(
        'https://airapi.airly.eu/v2/measurements/installation',
        {
          params: {
            indexPollutant: 'PM',
            indexType: 'AIRLY_CAQI',
            installationId: sensorID,
            standardType: 'WHO',
          },
          headers: {
            // Matei
            //'apikey': 'TssNii8X18s027VN30d8CZbMr45rcq72',

            //Raul
            'apikey': 'ryvBA9hSdtMMOw88KClTQLiwZILiaBCJ',
          },
        }
      );
  
      return response;
    } catch (error) {
      console.error('Error fetching Airly sensor details:', error);
      throw error;
    }
  };

  const calculateRatio = (color) => {
    // Assuming color is in the format "#RRGGBB"
    const redValue = parseInt(color.slice(1, 3), 16);
    const greenValue = parseInt(color.slice(3, 5), 16);
    const blueValue = parseInt(color.slice(5, 7), 16);
  
    // Normalize values to range [0, 1]
    const normalizedRed = redValue / 255;
    const normalizedGreen = greenValue / 255;
    const normalizedBlue = blueValue / 255;
  
    // Calculate the perceived intensity using a formula (adjust as needed)
    const perceivedIntensity = (normalizedRed + normalizedGreen + normalizedBlue) / 3;
  
    // Normalize the perceived intensity to the range [0, 1]
    const normalizedIntensity = perceivedIntensity;
  
    return normalizedIntensity;
  };

  useEffect(() => {
    loadModules(['esri/config', 'esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/PopupTemplate', 'esri/geometry/Point', 'esri/geometry/Point', 'esri/Color', 'esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/renderers/HeatmapRenderer'], { css: true })
      .then(([esriConfig, Map, MapView, FeatureLayer, PopupTemplate, Point, SimpleMarkerSymbol, Color, Graphic, GraphicsLayer, HeatmapRenderer]) => {
        // Add your API key
        esriConfig.apiKey = 'AAPK6f8e89b5cf0a47948d9b73025c20fe1eX6JYT1csqWTHrDRabpXSs8zaKl_2dCXLhR7MZ5fU15PPlDnhkVzjbCqqPXqCeJtR';

        const map = new Map({
          basemap: 'arcgis-light-gray' // Use OpenStreetMap Light Gray Canvas
        });

        view = new MapView({
          container: 'mapContainer1',
          map: map,
          center: [26.096306, 44.439663],
          zoom: 10
        });

        // Add Romania County layer to the map
        const romaniaCountyLayer = new FeatureLayer({
          url: 'https://services.arcgis.com/iQ1dY19aHwbSDYIF/arcgis/rest/services/RomaniaCounty/FeatureServer/0',
        });

        map.add(romaniaCountyLayer);

        // Create a home button
        const homeButton = document.createElement('button');
        homeButton.innerHTML = '<img src="../../../public/home.png" alt="Home" size="5" />';
        homeButton.className = 'esri-widget esri-widget--button esri-interactive';

        // Add a click event handler to the home button
        homeButton.addEventListener('click', () => {
          // Set the view to the initial center and zoom
          view.goTo({
            target: [26.096306, 44.439663],
            zoom: 10
          });
        });

        // Add the home button to the view
        view.ui.add(homeButton, 'top-left');

        const addAirlySensorLocations = async () => {
          try {
            const sensorData = await fetchAirlySensorData();
            let renderer;
            
            const heatRenderer = {
              type: "heatmap",
              colorStops: [
                { color: "rgba(63, 40, 102, 0)", ratio: 0 },
                //{ color: "#ffff00", ratio: 1 }
              ],
              maxDensity: 0.003,
              minDensity: 0,
              blurRadius: 20, // Adjust this value
              maxBlurRadius: 50, // Adjust this value
              minRadius: 10
            };
              
            const uniqueRenderer = {
              type: 'unique-value',
              field: 'color',
              uniqueValueInfos: [],
            };

            if (activeView === 2) {
              renderer = heatRenderer;
            } else {
              renderer = uniqueRenderer;
            }

            const filteredSensorData = activeView === 1 ? sensorData.filter(sensor => favorites.includes(sensor.id)) : sensorData;

            const graphics = await Promise.all(filteredSensorData.map(async (sensor) => {
              const details = await fetchAirlySensorDetails(sensor.id);
              const color = details.data.current.indexes[0].color;

              if (activeView === 2) {
                renderer.colorStops.push({
                  color: color,
                  ratio: calculateRatio(color)
                });
              } else {
                renderer.uniqueValueInfos.push({
                  value: color,
                  symbol: {
                    type: 'simple-marker',
                    size: 8,
                    color: color,
                    outline: {
                      color: [255, 255, 255],
                      width: 1,
                    },
                  },
                });;
              }

              return {
                geometry: {
                  type: 'point',
                  longitude: sensor.location.longitude,
                  latitude: sensor.location.latitude,
                },
              attributes: {
                  id: sensor.id,
                  country: sensor.address.country,
                  city: sensor.address.city,
                  street: sensor.address.street,
                  color: color, 
                  PM1: details.data.current.values[0]?.value || null,
                  PM25: details.data.current.values[1]?.value || null,
                  PM10: details.data.current.values[2]?.value || null,
                  pressure: details.data.current.values[3]?.value || null,
                  humidity: details.data.current.values[4]?.value || null,
                  temperature: details.data.current.values[5]?.value || null,
                  description: details.data.current.indexes[0]?.description,
                  advice: details.data.current.indexes[0].advice || null,              
                },
              };
            }));
        
            // Create a graphics layer and add it to the map
            const airlySensorsGraphicsLayer = new FeatureLayer({
              objectIdField: 'id',
              country: 'country',
              source: graphics,
              fields: [
                { "name": "country", "type": "string" },
                { "name": "city", "type": "string" },
                { "name": "street", "type": "string" },
                { "name": 'color', "type": 'string' },
                { "name": 'PM1', "type": 'double' },
                { "name": 'PM25', "type": 'double' },
                { "name": 'PM10', "type": 'double' },
                { "name": 'pressure', "type": 'double' },
                { "name": 'humidity', "type": 'double' },
                { "name": 'temperature', "type": 'double' },
                { "name": 'description', "type": 'string' },
                { "name": 'advice', "type": 'string' }, 
              ],
              renderer: renderer,
              popupTemplate: new PopupTemplate({
                title: '<div style="background: linear-gradient(to bottom right, {color} 15%, rgba(255, 255, 255, 0) 100%); padding: 10px 90px; font-size: 14px;">Airly Sensor #{id}</div>',
                //title: 'Airly Sensor #{id}',
                content: `<div style="font-style: italic;"><div style="font-weight: bold; font-size: 15px">{description}</div>"{advice}"</div>
                          <hr style="margin-top: 10px; margin-bottom: 10px; border: 0.5px solid #ddd;">
                          Country: {country}<br>
                          City: {city}<br>Street: {street}<br>
                          <hr style="margin-top: 10px; margin-bottom: 10px; border: 0.5px solid #ddd;">
                          <div class='column-container'>
                            <div class='column'>PM1: {PM1} µg/m³</div>
                            <div class='column'>Pressure: {pressure} hPa</div>
                          </div>
                          <div class='column-container'>
                            <div class='column'>PM25: {PM25} µg/m³</div>
                            <div class='column'>Humidity: {humidity}%</div>
                          </div>
                          <div class='column-container'>
                            <div class='column'>PM10: {PM10} µg/m³</div>
                            <div class='column'>Temperature: {temperature}°C</div>
                          </div>`,
                actions: [{
                  id: 'addFavorite', // Add the id property
                  image: "star.png", // Add the path to your star icon
                  title: 'Add to Favorites',
                  className: 'esri-icon-favorite',
                }],
                className: 'esri-popup__content',
              }),
            });
            
            map.add(airlySensorsGraphicsLayer);
          } catch (error) {
            console.error('Error adding Airly sensor locations to the map:', error);
          }
        };

        addAirlySensorLocations();

        view.popup.on("trigger-action", (event) => {
          if (event.action.id === "addFavorite" && activeView == 0) {
            addFavorite(view.popup.selectedFeature.attributes.id)
          }
        });
      })
      .catch((err) => console.error(err));
  }, [activeView]);


  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => { 
        console.log('Sign out successful');
        navigateLogin();
      })
      .catch((error) => console.log(error));
  };

  const navigateLogin = () => {
    navigate('/');
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f8f9fa', padding: '0px', borderBottom: '1px solid #ccc' }}>
        <p style={{ margin: 0 }}>Signed in as {currentUser ? currentUser.email : 'Unknown user'}</p>
        <button onClick={handleSignOut}>Logout</button>
        <select onChange={(e) => setActiveView(Number(e.target.value))} value={activeView}>
          <option value={0}>All Sensors</option>
          <option value={1}>Favorite Sensors</option>
          <option value={2}>Pollution Map</option>
        </select>
      </div>
      <div id="mapContainer1" style={{ height: 'calc(100vh - 60px)' }}></div>
    </div>
  );
};
export default MapComponent;
