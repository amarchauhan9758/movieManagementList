const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");

app.use("/auth", authRoutes);
app.use("/movie", movieRoutes);

connectDB()
  .then(() => {
    console.log("DB is connecting now ");
    app.listen(port, () => {
      console.log("server is running");
    });
  })
  .catch((err) => console.log(err));
