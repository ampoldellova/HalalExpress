import axios from "axios"


const calculateDistanceAndTime = async (startLat, startLng, destinationLat, destinationLng, mode = 'bicycle') => {

  const data = JSON.stringify({
    "mode": mode,
    "sources": [{ "location": [startLng, startLat] }],
    "targets": [{ "location": [destinationLng, destinationLat] }]
  });

  const config = {
    method: 'post',
    url: 'https://api.geoapify.com/v1/routematrix?apiKey=7540990e27fa4d198afeb6d69d3c048e',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };
  
  try {
    const response = await axios(config);
    const distance = response.data.sources_to_targets[0][0].distance;
    const duration = response.data.sources_to_targets[0][0].time / 60;
    const ratePerKm = 0.0058;
    const price = distance * ratePerKm;
    const finalPrice = price.toFixed(2)
    return {
      distance,
      duration,
      finalPrice
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

const extractNumbers = (inputStr) => {
  if (typeof inputStr !== 'string') {
    return [];
  }
  const matched = inputStr.match(/\d+/g);
  return matched ? matched.map(num => parseInt(num, 10)) : [];
}

export default {
  calculateDistanceAndTime,
  extractNumbers
}