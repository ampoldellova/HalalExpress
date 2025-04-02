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

const renderScene = SceneMap({
  first: PendingOrders,
  second: PreparingOrders,
  third: ReadyForPickupOrders,
  fourth: OutForDeliveryOrders,
  fifth: DeliveredOrders,
  sixth: CompletedOrders,
  seventh: CancelledOrders,
});

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
