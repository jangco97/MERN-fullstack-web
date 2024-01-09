const axios = require("axios");

const HttpError = require("../models/httpError");

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  console.log(response.data);
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "해당 주소에 대한 위도 및 경도를 찾지 못했습니다.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
