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
        },
        somme: function(rows){
            return rows.reduce(function(result, item){
                return result + (item.jour * item.taux)
            },0)
        },
        minimal: function(rows){
            var min = rows[0].jour * rows[0].taux
            rows.forEach(element => {
                if((element.jour*element.taux) < min)
                    min = element.jour*element.taux
            });
            return min
        },
        maximal: function(rows){
            var max = rows[0].jour * rows[0].taux
            rows.forEach(element => {
                if((element.jour*element.taux) > max)
                    max = element.jour*element.taux
            });
            return max
        }
    }
})


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.engine('hbs', my_hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

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