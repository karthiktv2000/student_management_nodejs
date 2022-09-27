const mongoose=require('mongoose');
const collection1 = new mongoose.Schema({
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
    },
    semister: {
      type: Number,
      require: true,
    },
    college: {
      type: String,
      require: true,
    },
    branch: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
  });
  const model = mongoose.model("karthik", collection1, "karthik");
  
  module.exports=model;