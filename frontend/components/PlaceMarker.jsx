import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'

const PlaceMarker = ({ coordinates, title }) => {
    return (
        <Marker
            title={title}
            coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.01,

            }}
        >
            <Image
                source={require('../assets/images/restaurant.png')}
                style={{ width: 30, height: 30 }} // Adjust size here
                resizeMode="contain"
            />

        </Marker>
    )
}

export default PlaceMarker

const styles = StyleSheet.create({
    customMarker: {
        height: 'auto',
        width: 'auto'
    },
    markerText: {
        fontSize: 30,
    },
})