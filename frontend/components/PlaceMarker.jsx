import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Marker } from 'react-native-maps'

const PlaceMarker = ({ coordinates, title }) => {
    return (
        <Marker
            style={{ height: 30, width: 30 }}
            title={title}
            coordinate={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.003,
                longitudeDelta: 0.01,

            }}
            icon={require('../assets/images/restaurant.png')}
        />
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