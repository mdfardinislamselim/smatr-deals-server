const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string
const uri =
  "mongodb+srv://smart-deals:diZVym3c4TGD8xpK@cluster0.j5l5aiu.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("smart_db");
    const productsCollection = db.collection("produts");
    const bidsCollection = db.collection("bids");
    const userCollection = db.collection("users");

    // users post
    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        res.send("user allready exits");
      } else {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      }
    });

    // users get
    app.get("/user", async (req, res) => {
      const newProduct = req.body;
      const result = await userCollection.insertOne();
      res.send(result);
    });

    // get products
    app.get("/products", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = productsCollection.find(query);
      // const cursor = productsCollection.find().sort({ price_min: 1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //
    app.get("/latest-products", async (req, res) => {
      const cursor = productsCollection
        .find()
        .sort({ created_at: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get singel product
    app.get("/products/:id", async (req, res) => {
      const product = await productsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(product);
    });

    // app.get("/products/:id", async (req, res) => {
    //   const { id } = req.params;

    //   // Check if the ID is a valid ObjectId
    //   if (!ObjectId.isValid(id)) {
    //     return res.status(400).send({ error: "Invalid product ID" });
    //   }

    //   try {
    //     const product = await productsCollection.findOne({
    //       _id: new ObjectId(id),
    //     });

    //     if (!product) {
    //       return res.status(404).send({ error: "Product not found" });
    //     }

    //     res.send(product);
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).send({ error: "Server error" });
    //   }
    // });

    // post products

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // updet products
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          title: updatedProduct.title,
          price_min: updatedProduct.price_min,
          price_max: updatedProduct.price_max,
          email: updatedProduct.email,
          category: updatedProduct.category,
          created_at: updatedProduct.created_at, // fixed
          image: updatedProduct.image,
          status: updatedProduct.status,
          location: updatedProduct.location, // fixed
          seller_image: updatedProduct.seller_image,
          seller_name: updatedProduct.seller_name,
          condition: updatedProduct.condition,
          usage: updatedProduct.usage,
          description: updatedProduct.description,
          seller_contact: updatedProduct.seller_contact,
        },
      };
      const result = await productsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete products
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // get bids
    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.buyer_email = email;
      }
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post bids
    app.post("/bids", async (req, res) => {
      const newProduct = req.body;
      const result = await bidsCollection.insertOne(newProduct);
      res.send(result);
    });

    // delete bids
    app.delete("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bidsCollection.deleteOne(query);
      res.send(result);
    });

    // updet bides
    app.patch("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBid = req.body;
      const query = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
          product: updatedBid.product,
          buyer_image: updatedBid.buyer_image,
          buyer_name: updatedBid.buyer_name,
          buyer_contact: updatedBid.buyer_contact,
          buyer_email: updatedBid.buyer_email,
          bid_price: updatedBid.bid_price,
          status: updatedBid.status,
        },
      };

      const result = await bidsCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.get("/products/bids/:productId", async (req, res) => {
      const productId = req.params.productId;
      const query = { product: productId };
      const cursor = bidsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
