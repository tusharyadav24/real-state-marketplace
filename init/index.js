const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("connected successfully");

    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'6a994eea2d87d9525a24b2df',
    geometry: {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    }
    }));
    await listing.insertMany(initdata.data);

    console.log("data was initialized");

    await mongoose.connection.close();
}
main().catch((err) => {
    console.log(err);
});