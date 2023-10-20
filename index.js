const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 5000 || process.env.PORT;
//import routes
const userRoute = require("./routes/userRoutes").router




//Routes
app.use("/apis/users",  userRoute) ;




const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`EasyRent backend listening on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.log("An Error Occur " + e.message);
    console.log(MONGO_URI);
  });

app.get("/", (req, res) => {
  res.send("api is  working perfectly");
});
