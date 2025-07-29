const axios = require("axios");
const { apiBaseUrl, apiDTDCBaseUrl, DTDCAPIKEY } = require("../config/api.config");

exports.calculatePricing = async ({
  order_type_user,
  origin,
  destination,
  weight,
  length,
  height,
  breadth,
  cod_amount,
  cod,
  authToken,
}) => {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/franchise/shipments/calculate_pricing`,
      {
        order_type_user,
        origin,
        destination,
        weight,
        length,
        height,
        breadth,
        cod_amount,
        cod,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to calculate pricing"
    );
  }
};

exports.courierList = async ({ authToken }) => {
  try {
    const response = await axios.get(
      `${apiBaseUrl}/franchise/shipments/courier`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to get courier list"
    );
  }
};


exports.cancelShipment = async ({ reqData, authToken, }) => {

  try {
    const response = await axios.post(
      `${apiBaseUrl}/franchise/shipments/cancel_shipment`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

exports.createShipment = async ({ payload, authToken, }) => {

  try {
    const response = await axios.post(
      `${apiBaseUrl}/franchise/shipments`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

exports.trackShipment = async ({ reqData, authToken, }) => {

  try {
    const response = await axios.post(
      `${apiBaseUrl}/franchise/shipments/track_shipment`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
exports.calculateShipment = async ({ reqData, authToken, }) => {

  try {
    const response = await axios.post(
      `${apiBaseUrl}/franchise/shipments/calculate_pricing`,
      reqData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

exports.createDTDCShipment = async ({ payload }) => {

  try {
    const authToken = DTDCAPIKEY;
    const response = await axios.post(
      `${apiDTDCBaseUrl}/customer/integration/consignment/softdata`,
      payload,
      {
        headers: {
          "api-key": `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

exports.createDTDCLabel = async ({ refNumber }) => {

  try {
    const authToken = DTDCAPIKEY;
    console.log(refNumber, authToken);
    const response = await axios.get(
      `${apiDTDCBaseUrl}/customer/integration/consignment/shippinglabel/stream?reference_number=${refNumber}&label_code=SHIP_LABEL_4X6&label_format=pdf`,
      {
        headers: {
          "api-key": `${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    return error.response?.data;
  }
};