import React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

const containerStyle = {
    width: 'auto',
    height: '200px',
    borderRadius: 15,
}

const SupplierMapLocation = ({ coords }) => {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBb5KicFxg9zwfu05AjPuacFyT0AtwW6sE',
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {

        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    const center = {
        lat: coords?.latitude || 0,
        lng: coords?.longitude || 0,
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapTypeId='satellite'
        >
            <Marker position={center} />
        </GoogleMap>
    ) : (
        <></>
    )
}

export default SupplierMapLocation