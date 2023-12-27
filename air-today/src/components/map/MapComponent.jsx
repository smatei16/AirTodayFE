import React, { useEffect } from 'react';
import { loadModules } from 'esri-loader';

const MapComponent = () => {
  useEffect(() => {
    loadModules(['esri/config', 'esri/Map', 'esri/views/MapView'], { css: true })
      .then(([esriConfig, Map, MapView]) => {
        // Adaugă cheia API
        esriConfig.apiKey = 'AAPK6f8e89b5cf0a47948d9b73025c20fe1eX6JYT1csqWTHrDRabpXSs8zaKl_2dCXLhR7MZ5fU15PPlDnhkVzjbCqqPXqCeJtR';

        const map = new Map({
          basemap: 'streets'
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

  return <div id="mapContainer" style={{ height: '100vh' }}></div>;
};

export default MapComponent;
