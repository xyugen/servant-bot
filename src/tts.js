require('dotenv').config();
const axios = require('axios');

const encodedParams = new URLSearchParams();
encodedParams.set("f", "8khz_8bit_mono");
encodedParams.set("c", "mp3");
encodedParams.set("r", "0");
encodedParams.set("v", "Mike");
encodedParams.set("hl", "en-us");
encodedParams.set("src", "");

const textToSpeech = async (text) => {
  encodedParams.set("src", text);

  const options = {
      method: "POST",
      url: "https://voicerss-text-to-speech.p.rapidapi.com/",
      params: {
          key: process.env.VOICE_RSS_API_KEY,
      },
      headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "voicerss-text-to-speech.p.rapidapi.com",
          "Accept": "audio/mpeg",
      },
      responseType: "arraybuffer",
      data: encodedParams,
  };

  try {
      const response = await axios.request(options);

      return response.data;
  } catch (error) {
      console.error(error);
  }
};

module.exports = { textToSpeech };