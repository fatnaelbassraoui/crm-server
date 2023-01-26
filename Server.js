const express = require("express");
const mongoose = require("mongoose");
const loginRoute = require("./Routes/login");
const newUsersRoute = require("./Routes/signUp");
const newCustomersRoute = require("./Routes/customers");
const calenderForm = require("./Routes/calenderForm");

require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", loginRoute);
app.use("/", newUsersRoute);
app.use("/", newCustomersRoute);
app.use("/", calenderForm);

mongoose.connect(process.env.DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "An error is occurred"));

db.once("open", () => {
  console.log("db connected");
});

app.listen(PORT, () => console.log(`Server running correctly on port ${PORT}`));
