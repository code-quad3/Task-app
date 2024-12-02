const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cookieParser =require('cookie-parser');
app.use(cookieParser());
const passport =require('passport');
require('./auth');
const db = require("./db");

require('./worker');
require("dotenv").config();
const cors = require('cors');



app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));

app.use(bodyParser.json());
app.use(passport.initialize());
const personAuthroutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/tasksRoute")
app.use('/auth',personAuthroutes);
app.use('/task',taskRoutes);


app.listen(9000, () => {
    console.log("Listening on port 9000");
  });