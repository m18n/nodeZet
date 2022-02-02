const express = require('express')
const exphbs=require('express-handlebars')
const mainroute=require('./routes/main')
const adminRoutes=require("./routes/admin")
var cookieParser = require('cookie-parser')
const config = require('./config')
const PORT = process.env.PORT || 3000
const app = express()
const hbs=exphbs.create({
    defaultLayout:'main',
    extname:'hbs',
    helpers: require('./handlebars-helpers.js')
})
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.engine('hbs',hbs.engine)
app.set('view engine','hbs')
app.set('views','views')
app.use('/public', express.static('public'));
app.use(mainroute)
app.use('/adminzet',adminRoutes)
conn=0
vasa=23
console.log("START\n");

async function StartAPP() {
    const mysql = require('mysql2/promise');
   
    conn = await mysql.createConnection({
        host: "localhost",
        user: "root",
        database: config.database,
        password: config.password
    });
    app.listen(PORT, () => {
        console.log("SERVER START")
    })

}
StartAPP()
