import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES } from '../../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { RatingInput } from 'react-native-stock-star-rating';
import Counter from '../../components/Cart/Counter';

const Product = ({ route, navigation }) => {
    const item = route.params.item;
    const [count, setCount] = useState(1);
    const [preference, setPreference] = useState('');

    return (
        <SafeAreaView>
            <ScrollView style={{ backgroundColor: COLORS.offwhite, height: SIZES.height }}>
                <View>
                    <Image source={{ uri: item.imageUrl.url }}
                        style={{
                            width: SIZES.width,
                            height: SIZES.height / 3.4,
                            borderBottomLeftRadius: 15,
                            borderBottomRightRadius: 15
                        }} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backbtn}>
                        <Entypo name="chevron-small-left" size={30} color="white" />
                    </TouchableOpacity>

                    <View style={styles.rating}>
                        <View style={styles.innerRating}>
                            <RatingInput
                                rating={Number(item.rating)}
                                size={22}
                            />
                            <TouchableOpacity style={styles.ratingBtn} onPress={() => { }}>
                                <Text style={styles.btnText}>Open the Store</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                        <Text style={[styles.title, { width: 250 }]}>{item.title}</Text>
                        <Text style={styles.title}>₱{item.price * count}</Text>
                    </View>

                    <Text style={styles.small}>{item.description}</Text>

                    <Text style={[styles.title, { marginBottom: 10, marginTop: 20 }]}>Preferences</Text>
                    <View style={styles.input}>
                        <TextInput
                            placeholder='Add specific instructions'
                            value={preference} onChangeText={(value) => setPreference(value)}
                            autoCapitalize={false}
                            autoCorrect={false}
                            style={{ flex: 1 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 20 }}>
                        <Text style={[styles.title, { marginBottom: 10 }]}>Quantity</Text>
                        <Counter count={count} setCount={setCount} />
                    </View>
                </View>

            </ScrollView>
            <View style={{ position: 'absolute', bottom: -40, alignItems: "center", width: "100%" }}>
                <View style={styles.suspended}>
                    <View style={styles.cart}>
                        <View style={styles.cartRow}>
                            <TouchableOpacity onPress={() => { }} style={styles.cartBtn}>
                                <AntDesign name='pluscircleo' size={24} color={COLORS.lightWhite} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('order-page')} style={{ backgroundColor: COLORS.primary, paddingHorizontal: 80, borderRadius: 30 }}>
                                <Text style={[styles.title, { color: COLORS.lightWhite, marginTop: 5, alignItems: "center" }]}>Order</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => { }} style={styles.cartBtn}>
                                <Text style={[styles.title, { color: COLORS.lightWhite, marginTop: 5, alignItems: "center" }]}>{0}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Product

const styles = StyleSheet.create({
    backbtn: {
        marginLeft: 12,
        alignItems: "center",
        zIndex: 999,
        position: 'absolute',
        top: SIZES.large,
        backgroundColor: COLORS.primary,
        borderRadius: 99
    },
    sharebtn: {
        marginRight: 12,
        alignItems: "center",
        zIndex: 999,
        right: 0,
        position: 'absolute',
        top: SIZES.xxLarge,
    },
    restbtn: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    container: {
        marginHorizontal: 12,
        marginTop: 10
    },
    title: {
        fontSize: 22,
        fontFamily: 'medium',
        color: COLORS.black
    },
    small: {
        fontSize: 13,
        fontFamily: 'regular',
        color: COLORS.gray,
        textAlign: "left",
    },
    tags: {
        right: 10,
        marginHorizontal: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        padding: 5
    },
    input: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        backgroundColor: COLORS.offwhite,
        height: 50,
        borderRadius: 8,
        paddingHorizontal: 12,
        alignItems: "center",
        flexDirection: 'row'
    },
    suspended: {
        position: 'absolute',
        zIndex: 999,
        bottom: 50,
        width: "100%",
        alignItems: "center"
    },
    cart: {
        width: SIZES.width - 24,
        height: 60,
        justifyContent: "center",
        backgroundColor: COLORS.primary1,
        borderRadius: 30
    },
    cartRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        marginHorizontal: 12
    },
    cartBtn: {
        width: 40,
        height: 40,
        borderRadius: 99,
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        alignItems: "center"
    },
    rating: {
        height: 50,
        justifyContent: "center",
        width: "100%",
        position: "absolute",
        backgroundColor: "#00fff",
        zIndex: 999,
        bottom: 5,
        borderRadius: 15,
    },
    innerRating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 12
    },
    ratingBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 9,
        padding: 6
    },
    btnText: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.white
    },
})