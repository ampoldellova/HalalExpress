import * as React from "react";
import { View, useWindowDimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { COLORS } from "../styles/theme";
import "react-native-gesture-handler";
import Products from "../screens/Supplier/Products";
import Directions from "../screens/Supplier/Directions";
import Reviews from "../screens/Supplier/Reviews";

const FirstRoute = () => <Products />;

const SecondRoute = ({ item }) => <Directions item={item} />;

const ThirdRoute = ({ item }) => <Reviews item={item} />;

const SupplierPage = ({ item }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Products" },
    { key: "second", title: "Directions" },
    { key: "third", title: "Reviews" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <FirstRoute />;
      case "second":
        return <SecondRoute item={item} />;
      case "third":
        return <ThirdRoute item={item} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    const { key, ...propsWithoutKey } = props;
    return (
      <TabBar
        key={key}
        {...propsWithoutKey}
        indicatorStyle={{ backgroundColor: COLORS.secondary }}
        style={{ backgroundColor: COLORS.primary }}
        labelStyle={{ fontWeight: "bold" }}
        activeColor={COLORS.white}
        inactiveColor={COLORS.gray2}
      />
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};

export default SupplierPage;
