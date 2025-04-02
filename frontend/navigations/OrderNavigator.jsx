import * as React from "react";
import { useWindowDimensions, ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import PendingOrders from "../components/Orders/PendingOrders";
import CompletedOrders from "../components/Orders/CompletedOrders";
import CancelledOrders from "../components/Orders/CancelledOrders";
import PreparingOrders from "../components/Orders/PreparingOrders";
import OutForDeliveryOrders from "../components/Orders/OutForDeliveryOrders";
import ReadyForPickupOrders from "../components/Orders/ReadyForPickupOrders";
import DeliveredOrders from "../components/Orders/DeliveredOrders";
import { COLORS } from "../styles/theme";

const routes = [
  { key: "first", title: "Pending" },
  { key: "second", title: "Preparing" },
  { key: "third", title: "Ready for pickup" },
  { key: "fourth", title: "Out for delivery" },
  { key: "fifth", title: "Delivered" },
  { key: "sixth", title: "Completed" },
  { key: "seventh", title: "Cancelled" },
];

export default function OrderNavigator({ orders }) {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <PendingOrders orders={orders} />;
      case "second":
        return <PreparingOrders orders={orders} />;
      case "third":
        return <ReadyForPickupOrders orders={orders} />;
      case "fourth":
        return <OutForDeliveryOrders orders={orders} />;
      case "fifth":
        return <DeliveredOrders orders={orders} />;
      case "sixth":
        return <CompletedOrders orders={orders} />;
      case "seventh":
        return <CancelledOrders orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          scrollEnabled={true}
          tabStyle={{ width: layout.width / 3 }}
          indicatorStyle={{ backgroundColor: COLORS.secondary }}
          style={{ backgroundColor: COLORS.primary }}
          activeColor={COLORS.secondary}
          inactiveColor={COLORS.white}
        />
      )}
    />
  );
}
