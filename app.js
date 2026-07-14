const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3001 } = process.env;
//app.use(cors()) enables CORS (Cross-Origin Resource Sharing). Think of it like a bouncer at a club — without it, browsers would block requests coming from a different domain(e.g., your front end on port 3000 talking to your back end on port 3001). This line says "let them in!"
app.use(cors());

//mongoose.connect(...)This connects your app to your MongoDB database called wtwr_db. The .then() logs a success message, and .catch() handles any connection errors.
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);
//app.use(express.json()) tells Express to automatically parse incoming JSON data from requests. Without it, req.body would be empty when someone sends JSON to your server.
app.use(express.json());
//app.use("/", mainRouter) hands off all incoming requests to your main router, which then directs traffic to the right route handlers.
app.use("/", mainRouter);
//app.listen(3001, ...) starts the server and tells it to listen for requests on port 3001.
app.listen(3001, () => {
  console.log(`Listening on port ${PORT}`);
});
