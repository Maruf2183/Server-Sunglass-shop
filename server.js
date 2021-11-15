const express = require('express');
const app = express();
const cors = require('cors');
const mongodb = require('mongodb');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const name = process.env.DB_USER
const pass = process.env.DB_PASS
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.get('/', (res, req) => {
    req.json('servaer connected successfully')
})

const uri = `mongodb+srv://${name}:${pass}@cluster0.rtxhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('database connect successfully');
        const database = client.db('eyeHouse');
        const productData = database.collection('pruductdata');
        const userRegister = database.collection('users');
        const orderedData = database.collection('orderedData');
        const reviewsData = database.collection('reviewsData');


        // POSTING FUNCTION START HERE ===>>>
        // PRODUCT ADDING TO DATABASE
        app.post('/products', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await productData.insertOne(data);
            res.json(result);
            console.log(`posting result is`, result);
        });
        // USER ADDING TO DATABASE
        app.post('/users', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await userRegister.insertOne(data);
            res.json(result);
            console.log(`posting result is`, result);
        });
        // ORDERS DETAILS ADDING TO DATABASE DIRECT GOOGLE LOGGING
        app.put('/users', async (req, res) => {
            const data = req.body;
            console.log(data);
            const quary = { email: data.email};
            const updatedata = { $set:data}
            const upsert={upsert:true}
            const result = await userRegister.updateOne(quary,updatedata,upsert);
            res.json(result);
            console.log(`putting result is`, result);
            
            
        });
        // ORDERS DETAILS ADDING TO DATABASE
        app.post('/orders', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await orderedData.insertOne(data);
            res.json(result);
            console.log(`posting result is`, result);
        });

        // REVIEW ADDING TO DATABASE
        app.post('/review', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await reviewsData.insertOne(data);
            res.json(result);
            console.log(`posting result is`, result);
        });
        // POSTING DATA END HERE <<<====


        // GETTING SINGLE DATA BY FILTERED WITH EMAIL function start here ===>>
        // USERS ORDERED DATA ONLY LOGGED IN USE GETTING 
        app.post('/order', async (req, res) => {
            const email = req.body.email;
            console.log(email);
            const quary = { email: email }
            const datas= orderedData.find(quary);
            const packedata = await datas.toArray();
            res.json(packedata);
            console.log(`getting by email is`,packedata);
        });
        // getting single data by filtering by email end here <<<===


        // GETTING ALL DATA FUNCTION START HERE  ===>>>
        // GETTING PRODUCTS DATA FOR SHOWING  HOMEPAGE
        app.get('/products', async (req, res) => {
            const cursor = productData.find({})
            const data = await cursor.toArray()
            res.json(data)
        });
        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const quary= { _id:ObjectId(productId)}
            const result = await productData.findOne(quary);
            res.json(result)
        });
        // GETTNG LOGGED IN USERS DATA 
        app.get('/users', async (req, res) => {
            const cursor = userRegister.find({})
            const data = await cursor.toArray()
            res.json(data)

        });
        //GETTTING ORDERS ALL DATA 
        app.get('/orders', async (req, res) => {
            const cursor = orderedData.find({})
            const data = await cursor.toArray()
            res.json(data)
        });
        // GETTING REVIEWS DATA 
        app.get('/review', async (req, res) => {
            const cursor = reviewsData.find({})
            const data = await cursor.toArray()
            res.json(data)
            console.log(`review called sir`);
        });
        // Getting All Function End Here <<<====


        // UPDATING FUNCTION START HERE ===>>>
        // UPDATTING ORDERS CONDITON 
        app.put('/orders/:id', async (req, res) => {
            console.log(req.params.id);
            const reqToUpdate = req.params.id
            const quary = { _id:ObjectId(reqToUpdate)}
            const updateData={$set:{status:'Order Accepted'}}
            const result = await orderedData.updateOne(quary,updateData);
            res.json(result);
            console.log(`update result is`, result);
        });
        // MAKING ADMIN
        app.put('/users/admin', async (req, res) => {
            const adminEmail = req.body.email;
            console.log(adminEmail);
            const quary = {email: adminEmail }
            const roleForAdding={$set:{role:'admin'}}
            const result = await userRegister.updateOne(quary,roleForAdding)
            res.json(result);
            console.log(`admin making`,result);
        });
      
        // CHEEKING ADMIN CONDITION 
        app.get('/users/adminCondition/:email', async (req, res) => {
            const userEmail = req.params.email;
            const quary = { email: userEmail }
            console.log(userEmail);
            let isdmin = false;
            const role = await userRegister.findOne(quary);
            if (role?.role === 'admin') {
                isdmin = true;
               
            };
            res.json({ admin: isdmin });
            console.log(role);
        });
            
            




        // REMOVING DATA FUNCTION START HERE ===>>>
        app.delete('/products/:id', async (req, res) => {
            console.log(req.params.id);
            const deleteID = req.params.id;
            const quary = { _id: ObjectId(deleteID) };
            const result = await productData.deleteOne(quary);
            res.json(result)
        });
        app.delete('/orders/:id', async (req, res) => {
            console.log(req.params.id);
            const reqToDeleteData = req.params.id;
            const quary = { _id: ObjectId(reqToDeleteData) };
            const result = await orderedData.deleteOne(quary);
            res.json(result);
            console.log(`delete result is`, result);
        });
        // delete function end here  <<<===






    }
    finally {

    }

}
run().catch(error => console.log(error));












app.listen(port, () => {
    console.log(`listening to port`, port);
})


/*
await client.connect();
        const database = client.db('eyeHouse');
        const productData = database.collection('pruductdata');
        const userRegister = database.collection('users');
        const orderedData = database.collection('orderedData');
        const reviewsData = database.collection('reviewsData');
*/

