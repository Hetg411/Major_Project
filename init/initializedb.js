const mongoose = require("mongoose");
const listing = require("../Models/testlisting.js");
const data = require("../init/data.js");
const axios = require("axios");

const URL = "mongodb://127.0.0.1:27017/wonderlust";
const API_KEY = "AIzaSyD9Oz1yoUXrCaDOUbxOaILSs1Qey_XrHlc"; // Use your real key

main().then(() => {
  console.log("Connected to database");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(URL);
}

async function funck() {
  await listing.deleteMany({});

  const enrichedData = [];

  for (let obj of data.data) {
    try {
      const address = `${obj.location}, ${obj.country}`;
      const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: API_KEY,
        },
      });

      const location = geoRes.data.results[0]?.geometry?.location;
      if (!location) {
        console.log(`No geocode found for: ${address}`);
        continue;
      }

      // ✅ Add geometry field in GeoJSON format
      obj.geometry = 
        
    [location.lng, location.lat]
      ;

      enrichedData.push(obj);

    } catch (err) {
      console.log(`Error processing location: ${obj.location}, ${obj.country}`, err.message);
    }
  }

  await listing.insertMany(enrichedData);
  console.log("✅ Data with geometry saved successfully");
}

funck();
