import * as React from "react";
import { useWindowDimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
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

  const pendingOrders =
    orders?.filter((order) => order.orderStatus === "Pending") || [];

  const preparingOrders =
    orders?.filter((order) => order.orderStatus === "Preparing") || [];

  const readyForPickupOrders =
    orders?.filter((order) => order.orderStatus === "Ready for pickup") || [];

  const outForDeliveryOrders =
    orders?.filter((order) => order.orderStatus === "Out for delivery") || [];

  const deliveredOrders =
    orders?.filter((order) => order.orderStatus === "Delivered") || [];

  const completedOrders =
    orders?.filter((order) => order.orderStatus === "Completed") || [];

  const cancelledOrders =
    orders?.filter(
      (order) =>
        order.orderStatus === "cancelled by customer" ||
        order.orderStatus === "cancelled by resstaurant"
    ) || [];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <PendingOrders pendingOrders={pendingOrders} />;
      case "second":
        return <PreparingOrders preparingOrders={preparingOrders} />;
      case "third":
        return (
          <ReadyForPickupOrders readyForPickupOrders={readyForPickupOrders} />
        );
      case "fourth":
        return (
          <OutForDeliveryOrders outForDeliveryOrders={outForDeliveryOrders} />
        );
      case "fifth":
        return <DeliveredOrders deliveredOrders={deliveredOrders} />;
      case "sixth":
        return <CompletedOrders completedOrders={completedOrders} />;
      case "seventh":
        return <CancelledOrders cancelledOrders={cancelledOrders} />;
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
          activeColor={COLORS.white}
          inactiveColor={COLORS.gray2}
        />
      )}
    />
  );
}
