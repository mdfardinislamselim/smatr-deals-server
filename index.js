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

    // get products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // post products
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // updet products
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updeteProducts = req.body;
      const query = { _id: new ObjectId(id) };
      const updet = {
        title: updeteProducts.title,
        price_min: updeteProducts.price_min,
        price_max: updeteProducts.price_max,
        email: updeteProducts.email,
        category: updeteProducts.category,
        created_at: updeteProducts.category,
        image: updeteProducts.image,
        status: updeteProducts.status,
        location: updeteProducts.status,
        seller_image: updeteProducts.seller_image,
        seller_name: updeteProducts.seller_name,
        condition: updeteProducts.condition,
        usage: updeteProducts.usage,
        description: updeteProducts.description,
        seller_contact: updeteProducts.seller_contact,
      };
    });

    // delete products
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
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
