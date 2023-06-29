const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser")
const mysql = require("mysql");
require("dotenv").config();

const app = express();
const port = 8000;

let my_hbs = exphbs.create({
    extname : '.hbs',
    helpers: {
        produit: function(value,times){
            return value * times;
        }
    }
})


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('hbs', my_hbs.engine);
app.set('view engine', 'hbs');

const pool = mysql.createPool({
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

pool.getConnection((err,conn) => {
    if(err)
        throw err;
    console.log("connected ID " + conn.threadId);
});

const routes = require("./server/routes/location")
app.use("/", routes);


app.listen(port, () => console.log(`server at http://localhost:${port}`));