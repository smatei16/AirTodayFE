import React, { useRef, useEffect } from 'react';
import { loadModules } from 'esri-loader';

const MapComponent = () => {
    const mapViewRef = useRef(null);

    useEffect(() => {
      const loadMap = async () => {
        
        const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView']);
        const mapProperties = {
            basemap: 'streets',
        };
        const map = new Map(mapProperties);

        const mapViewProperties = {
            container: mapViewRef.current,
            center: [26.096306, 44.439663], // Center of Bucharest
            zoom: 10,
            map: map,
          };
        const view = new MapView(mapViewProperties);
  
        view.container = 'mapContainer';
  
        view.map = map;
      };
  
      loadMap();
    }, []);
  
    return (
      <div id="mapContainer" style={{ width: '100%', height: '1080px' }}></div>
    );
  };
  
  export default MapComponent;