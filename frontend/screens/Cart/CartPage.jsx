import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import pages from '../../styles/page.style'
import { COLORS, SIZES } from '../../styles/theme'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import axios from 'axios'
import baseUrl from '../../assets/common/baseUrl'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BackBtn from '../../components/BackBtn'
import CartProducts from '../../components/Cart/CartProducts'
import Button from '../../components/Button'

const CartPage = () => {
  const navigation = useNavigation()
  const [cartItems, setCartItems] = useState([])

  const getCartItems = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        }
      }

      const response = await axios.get(`${baseUrl}/api/cart/`, config)
      setCartItems(response.data.cartItems)
    } catch (error) {
      console.log(error.message)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getCartItems();
    }, [])
  );
  return (
    <SafeAreaView >
      <View style={pages.viewOne}>
        <View style={pages.viewTwo}>
          {cartItems.length > 0 ? (
            <View style={{ marginHorizontal: 20, marginTop: 15 }}>
              <BackBtn onPress={() => navigation.goBack()} />
              <Text style={styles.heading}>Your Cart</Text>

              <FlatList
                data={cartItems}
                keyExtractor={(item) => item._id}
                style={{ height: SIZES.height / 1.4 }}
                renderItem={({ item }) => (
                  <CartProducts item={item} getCartItems={getCartItems} />
                )}
              />
              <Button title='C H E C K O U T' isValid={true} onPress={() => { }} />
            </View>
          ) : (
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
          )}
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
    marginTop: 10,
    textAlign: 'center'
  },
  buttonText: {
    color: 'white',
    fontFamily: 'regular'
  },
  heading: {
    fontFamily: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10
  },
})