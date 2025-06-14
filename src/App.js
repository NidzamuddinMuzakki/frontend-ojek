import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox ,Marker} from '@react-google-maps/api';
import {  isMobile } from 'react-device-detect';
    
const containerStyle = {
  width: '100vw',
  height: '100vh'
};



const GoogleMapWithSearch = () => {
  const [map, setMap] = useState(null);

  const [markers, setMarkers] = useState([]);
 const [location, setLocation] = useState(null);
  const searchBoxRef = useRef(null);

  const onLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = (e) => {
    
    if (searchBoxRef?.current) {
     
      const places = searchBoxRef?.current?.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newMarkers = [{
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }];
        setMarkers(newMarkers);
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          map.setZoom(15);
        }
      }
    }
  };
const [error, setError] = useState(null);
  useEffect(()=>{
    if(error){
      if(error?.message){
        alert(error?.message)
      }
    }
  },[error])
 useEffect(() => {
   if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
           (position) => {
             setLocation({
               lat: position.coords.latitude,
               lng: position.coords.longitude,
             });
           },
           (error) => {
             setError(error.message);
           }
         );
       } else {
         setError('Geolocation is not supported by this browser.');
       }
  }, []);
  console.log(location)

  if ( !location) {
    return <div>Loading...</div>;
  }
  const onMapLoad = (mapInstance) => {
    setMap(mapInstance);
  };
  const handleCariDriver = ()=>{

  }


  return (
    <div>
      <LoadScript  googleMapsApiKey="AIzaSyBOcZfHwQEvLQUFW7AbaJ5-r8rfIhzyBpI" libraries={['places']}>
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}  ref={searchBoxRef}>
          <input
            type="text"

            placeholder="Search Box"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: isMobile?`60%`:`30%`,
              height: `50px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `18px`,
              outline: `none`,
              zIndex:2,
              textOverflow: `ellipses`,
              position: "fixed",
              left: "10px",
              top:'60px',
             
            }}
          />
        </StandaloneSearchBox>
        <div style={{position:'fixed', zIndex:2, left:isMobile?'calc(60% + 20px)':'calc(30% + 20px)', top:'60px'}}>
          <div onClick={()=>handleCariDriver()} style={{display:'flex',cursor:'pointer', padding:'5px 20px',justifyContent:'center',height:'40px', alignItems:'center', background:'white', boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,}}>
            CARI DRIVER
          </div>
        </div>
        <GoogleMap
          map
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
          onLoad={onMapLoad}
        >
           {!markers?.length?<Marker    position={location} />:""}
            {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapWithSearch;