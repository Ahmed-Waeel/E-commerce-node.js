// Enviroment Variables 
require('dotenv').config();

// Routes
const routes = require('./Routes/Router')

// Dependencies
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
mongoose.set({ "strictQuery": false })

// Port
const port = process.env.PORT;

// Used Packages in Express App
app.use(cors());
app.use(bodyParser.json());
app.use(routes);
app.listen(port, () => console.log(`Server is listening at http://localhost:${port}`))

// Database Connection
dbConnection().then(() => console.log("mongodb is connected")).catch(err => console.log(err));
async function dbConnection() { mongoose.connect(process.env.MONGO_URL) }


app.all('/', (req, res) => res.send({ code: 200, message: "Connected" }))
module.exports = app