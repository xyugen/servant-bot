require('dotenv').config();
const axios = require('axios');

const encodedParams = new URLSearchParams();
encodedParams.set("f", "8khz_8bit_mono");
encodedParams.set("c", "mp3");
encodedParams.set("r", "2");
encodedParams.set("hl", "en-us");
encodedParams.set("src", "");

const options = {
  method: "POST",
  url: "https://voicerss-text-to-speech.p.rapidapi.com/",
  params: {
    key: process.env.VOICE_RSS_API_KEY,
  },
  headers: {
    "content-type": "application/x-www-form-urlencoded",
    "X-RapidAPI-Key": "30e6267decmsh6a70771fbbcf348p178513jsn34182e072570",
    "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
  },
  data: encodedParams,
};

const textToSpeech = async (text) => {
    encodedParams.set("src", text);

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

module.exports = { textToSpeech };