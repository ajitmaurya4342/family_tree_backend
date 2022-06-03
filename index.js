require("module-alias/register");
const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const app = express();
const knex = require("./config/database");
var cors = require("cors");
var async = require("async");
const readline = require('readline');
const moment =require("moment");
var CronJob = require('cron').CronJob;
var request = require('request');
app.use(cors());
const http = require("http");
const c = require("config");
const { clearInterval } = require("timers");

global.knexConnection = knex;

app.use(bodyParser.json());

require("@/routes/")(app);


const server = http.createServer(app);

//At Every 6 Hour
// var job = new CronJob('0 */6 * * *', function() {
 
// }, null, true, 'Asia/Kolkata');
// job.start();


server.listen(PORT, () => {
  console.log(`the server is running on ${PORT} and date is ${new Date()}`);
});
