import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RestaurantContext } from '../../contexts/RestaurantContext';

const Info = () => {
  const navigation = useNavigation();
  const { restaurantObj, setRestaurantObj } = useContext(RestaurantContext)
  // console.log(uidata.foods.title)

  return (
    <View style={{ marginTop: 5, marginBottom: 50 }}>
      {/* <FlatList
        data={uidata.foods}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 5 }}
        scrollEnabled
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ left: 12 }}>
            <CategoryFoodComp item={item} onPress={() => navigation.navigate('food-nav', item)} />
          </View>
        )}
      /> */}
    </View>
  )
}

export default Info

const styles = StyleSheet.create({})