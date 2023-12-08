const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const port =  process.env.PORT || 5000;

//
//server conection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aeupb94.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

const productCollection =client.db("productDB").collection("products");

const cartCollection =client.db("productDB").collection("cart");

//post data method
    app.post("/products", async(req, res)=>{
        const product =  req.body;
        const result = await
        productCollection.insertOne(product);
        console.log(result);
        res.send(result);
    });
//post read method
    app.get("/products", async(req, res)=>{
      const result = await productCollection.find().toArray();
      console.log(result);
      res.send(result);
  });

  //get all data

  app.get("/products/:brandName", async(req, res)=>{
  const brandName =req.params.brandName;
  //console.log('brand', brand);
  const query ={brand : brandName};
  const cursor =productCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});


//
// app.get("/products/:brand", async(req, res)=>{
//   const brand =req.params.brand;
//   const query ={brand : brand};
//   const result = await productCollection.find(qyery).toArray();
//   console.log(result);
//   res.send(result);
// });


//cart data post
app.post("/cart/", async(req, res)=>{
  const cart =  req.body;
  const result = await
  cartCollection.insertOne(cart);
  console.log(result);
  res.send(result);
});


//cart data get methood
app.get("/cart", async(req, res)=>{
  const result = await cartCollection.find().toArray();
  console.log(result);
  res.send(result);
});

//cart delete
// app.delete("/users/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log("delete", id);
//   const query = {
//     _id: new ObjectId(id),
//   };
//   const result = await cartCollection.deleteOne(query);
//   console.log(result);
//   res.send(result);
// });

app.delete('/cart/:id', async (req, res) => {
  const id = req.params.id;
  console.log("delete", id);
  const query = {
    _id: new ObjectId(id),
  };
  try {
    const result = await cartCollection.deleteOne(query);
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


  //post delete methood
  app.delete("/products/:id", async(req, res)=>{
    const id = req.params.id;
    console.log('id', id);
    const query ={
      _id : new ObjectId(id),
    }
    const result = await productCollection.deleteOne(query);
    //console.log(result);
    res.send(result);
  });



  //update single data
  
  // app.get("/products/:id", async(req, res)=>{
  //   const id = req.params.id;
  //   //console.log('id', id);
  //   const query ={
  //     _id : new ObjectId(id),
  //   };
  //   const result = await productCollection.findOne(query);
  //   //console.log(result);
  //   res.send(result);
  // });

  //modified update
   app.get("/product/:id", async(req, res)=>{
    const id = req.params.id;
    //console.log('id', id);
    const query ={
      _id : new ObjectId(id),
    };
    const result = await productCollection.findOne(query);
    //console.log(result);
    res.send(result);
  });
  




  //updated data
  app.put("/products/:id", async(req, res)=>{
    const id = req.params.id;
    const data = req.body;
    const options ={upsert:true};
    const filter ={
      _id : new ObjectId(id),
    };
    const updatedData ={
      $set:{
            image:data.image, 
            name:data.name, 
            brand:data.brand, 
            type:data.type, 
            price:data.price, 
            shortDescription:data.shortDescription, 
            rating:data.rating,
      },
    };
    const result = await productCollection.updateOne(filter,updatedData,options);
    res.send(result);


  });




    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);











app.get("/", (req, res) => {
    res.send("Server is running...");
 });


app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});