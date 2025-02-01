import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import pages from '../../styles/page.style'
import { COLORS, SIZES } from '../../styles/theme'
import { useNavigation } from '@react-navigation/native'

const CartPage = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView >
      <View style={pages.viewOne}>
        <View style={pages.viewTwo}>
          <View style={styles.container}>
            <Image
              style={styles.image}
              source={require('../../assets/images/cart.png')}
            />
            <Text style={styles.text}>
              You havent added anything to your cart yet.
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('HomePage') }}>
              <Text style={styles.buttonText}>Browse Items</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default CartPage

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: SIZES.height / 1.15
  },
  image: {
    width: 200,
    height: 200
  },
  text: {
    fontSize: 14,
    fontFamily: 'regular',
    color: COLORS.gray,
    textAlign: 'center',
    width: '50%',
    marginTop: 10
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 15,
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontFamily: 'regular'
  },
})