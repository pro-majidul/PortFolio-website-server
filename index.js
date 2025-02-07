const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({ mess: 'server is running ' })
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xihi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection


        const projectCollection = client.db('projectDB').collection('projects')

        app.get('/projects', async (req, res) => {
            const result = await projectCollection.find().toArray()
            res.send(result)
        })
        app.get('/projects/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const data = await projectCollection.findOne(query)
            res.send(data)
        })
        app.post('/projects', async (req, res) => {
            const data = req.body;
            const result = await projectCollection.insertOne(data);
            res.send(result)
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
    console.log(`Local Server is running on port ${port}`)
})