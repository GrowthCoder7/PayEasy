const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/PayEasy");
// .then(() => {
//   console.log("Connection Setup successful");
// })
// .catch((err) => {
//   console.log(err);
// });

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

const BankSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Users = mongoose.model("Users", userSchema);
const Banks = mongoose.model("Banks", BankSchema);

module.exports = {
  Users,
  Banks,
};
