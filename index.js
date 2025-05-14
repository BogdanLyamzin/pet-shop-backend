const express = require('express');
const cors = require('cors');

const sequelize = require('./database/database');

const Category = require('./database/models/category');
const Product = require('./database/models/product');

const categories = require('./routes/categories');
const sale = require('./routes/sale');
const order = require('./routes/order');
const products = require('./routes/products');
const contacts = require("./routes/contacts");

const {PORT = 3333} = process.env;

Category.hasMany(Product);

const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

app.use('/categories', categories);
app.use('/products', products);
app.use('/sale', sale);
app.use('/order', order);
app.use("/contacts", contacts);

const start = async () =>{
    try{
        await sequelize.sync();

        const port = Number(PORT);
        
        app.listen(port, ()=>{
            console.log(`\n\nServer started on ${port} port...`)
        })
    }catch(err){
        console.log(err);
    }
}
start();
