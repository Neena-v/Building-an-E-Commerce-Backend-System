const axios = require("axios");

async function fetchRecommendationsFromRapidMiner({ userId }) {

  const base = process.env.RAPIDMINER_BASE_URL;
  const endpoint = process.env.RAPIDMINER_ENDPOINT;

  const url = `${base}${endpoint}`;
  const resp = await axios.post(url, { userId });

  return resp.data;
}
module.exports = { fetchRecommendationsFromRapidMiner };
