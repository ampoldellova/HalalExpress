import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect } from "react";
import { Linking } from "react-native";

const PAYMONGO_API_URL = "https://api.paymongo.com/v1";
const PAYMONGO_URL = "https://api.paymongo.com";
const PAYMONGO_SECRET_KEY = "sk_test_5Ach5aZsrXzFmdv1MDaPiaVc";

const createPaymentIntent = async (amount, currency = "PHP") => {
  const response = await axios.post(
    `${PAYMONGO_API_URL}/payment_intents`,
    {
      data: {
        attributes: {
          amount: amount * 100, // Amount in centavos
          payment_method_allowed: ["gcash"],
          currency,
        },
      },
    },
    {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const attachPaymentMethod = async (paymentIntentId, paymentMethodId) => {
  const response = await axios.post(
    `${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}/attach`,
    {
      data: {
        attributes: {
          payment_method: paymentMethodId,
          return_url: `https://www.paymongo.com/`,
        },
      },
    },
    {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const createPaymentMethod = async (phone, email, name) => {
  const response = await axios.post(
    `${PAYMONGO_API_URL}/payment_methods`,
    {
      data: {
        attributes: {
          type: "gcash",
          billing: {
            phone: phone,
            email: email,
            name: name,
          },
        },
      },
    },
    {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const retrievePaymentIntent = async (paymentIntentId) => {
  const response = await axios.get(
    `${PAYMONGO_API_URL}/payment_intents/${paymentIntentId}`,
    {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const createRefund = async (amount, notes, paymentId) => {
  try {
    const response = await axios.post(
      `${PAYMONGO_URL}/refunds`,
      {
        data: {
          attributes: {
            amount: amount,
            notes: notes,
            payment_id: paymentId,
            reason: "requested_by_customer",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const retrieveRefund = async (refundId) => {
  const response = await axios.get(`${PAYMONGO_URL}/refunds/${refundId}`, {
    headers: {
      Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export {
  createPaymentIntent,
  attachPaymentMethod,
  createPaymentMethod,
  retrievePaymentIntent,
  createRefund,
  retrieveRefund,
};
