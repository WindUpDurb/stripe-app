"use strict";

require("dotenv").load();

const PORT = process.env.PORT || 3000;

let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
let path = require("path");
//let http = require("http");
let pathToStatic = path.join(__dirname, "public");

let mongoose = require("mongoose");
const MONGOURL = process.env.MONGODB_URI || `mongodb://localhost/stripe-app-test`;

mongoose.connect(MONGOURL, function (error) {
    console.log(error || `Connected to MongoDB at ${MONGOURL}`);
});

let app = express();

//let server = http.createServer(app);
//let io = require("socket.io")(server);

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(pathToStatic));

app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));



/*
io.on("connection", function (socket) {
    console.log("Client connected");
});
*/

app.listen(PORT, function (error) {
    console.log(error || `Server listening on port ${PORT}`);
});

module.exports = app;
