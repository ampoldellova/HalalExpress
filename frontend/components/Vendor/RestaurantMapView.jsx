import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { Marker } from 'react-native-maps'
import { COLORS } from '../../styles/theme'

const RestaurantMapView = ({ region }) => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            >
                <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
            </MapView>
        </View>
    )
}

export default RestaurantMapView

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        marginTop: 10,
        borderColor: COLORS.gray2,
        borderRadius: 15,
        overflow: 'hidden',
    },
    map: {
        height: 300,
    },
})