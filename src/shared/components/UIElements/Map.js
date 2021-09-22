import React,{useRef, useEffect} from "react";

import "./Map.css";

const Map=props=>{

    const mapRef = useRef();

    const { center, zoom } = props;

    useEffect(() => {
    new window.Microsoft.Maps.Map(mapRef.current, {
    credentials: 'AkrIzusk2InF94nhdSc6Y75ONDTSTrU9BtBvQBViDHMBss9YVEmURRzmAkcdHaAO',
    center: new window.Microsoft.Maps.Location(center.lat, center.lng),
    mapTypeId: window.Microsoft.Maps.MapTypeId.aerial,
    zoom: zoom
      });
    }, [center, zoom]);

    return (<div 
    ref={mapRef} 
    className={`map ${props.className}`} 
    style={props.style}
    id="map"
    >

    </div>);
};

export default Map;