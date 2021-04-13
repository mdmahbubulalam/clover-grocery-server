const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtufm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("cloverGroceryStore").collection("products");
  const ordersCollection = client.db("cloverGroceryStore").collection("orders");

  console.log('DB connected');

  app.get('/', (req,res) => {
    res.send('Its Working')
  })

  app.post('/addProduct', (req,res) => {
    const product = req.body;
    productsCollection.insertOne(product)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/products', (req,res) => {
    productsCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post('/addOrder', (req,res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req,res) => {
    ordersCollection.find({email:req.query.email})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.delete('/delete/:id', (req,res) => {
    productsCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount>0)
    })
  })
  
});


app.listen(process.env.PORT || port)