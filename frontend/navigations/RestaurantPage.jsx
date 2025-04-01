import * as React from "react";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { COLORS } from "../styles/theme";
import Menu from "../screens/Vendor/Menu";
import Directions from "../screens/Vendor/Directions";
import Reviews from "../screens/Vendor/Reviews";
import "react-native-gesture-handler";

const FirstRoute = () => <Menu />;

const SecondRoute = ({ item }) => <Directions item={item} />;

const ThirdRoute = ({ item }) => <Reviews item={item} />;

const RestaurantPage = ({ item }) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Menu" },
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
        activeColor={COLORS.secondary}
        inactiveColor={COLORS.white}
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

export default RestaurantPage;
