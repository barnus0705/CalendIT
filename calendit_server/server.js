const PgClient = require('./database.js');
const express = require('express');
const { createHash } = require('crypto');
const cors = require('cors');
const app = express();
const port = 5000;


app.use(cors());

app.use(express.json());
app.listen(port, ()=>{
    console.log(`Server is Now on ${port} port`)
})
app.post('/login', async (req, res) =>{
    const client = new PgClient;
    client.connect();
    const loginData = await client.query('Select "Email","Password" from "Users"."User" Where "Email" = $1 And "Password" = $2 ',
                [req.body.email,createHash("sha256").update(req.body.password).digest("hex")]);
    if(loginData.rows.length === 0){
        res.status(500).send("");
        console.log("Login Failed")
        return;
    }
    res.status(200).json(loginData.rows[0]);
    console.log("Login Succesfull")
});

app.post('/users', async (req, res) =>{
    const client = new PgClient;

    client.connect();

    console.log('checking email');
    const email =  await client.query('Select "Email" From "Users"."User" Where "Email" = $1', [req.body.email]);
    console.log('email checked');
    if (email.rows.length !== 0){
        res.status(500).send("");
        return;
    }

    console.log('email not present');
    client.query('INSERT INTO "Users"."User" ("Password", "Email") VALUES ($1, $2);', [
        createHash('sha256').update(req.body.password).digest('hex'),req.body.email],
        (error, result) => {
        console.log('inserted, sending data');
        if (error) throw error
        res.status(200).send("");
    });
    console.log('query sent');
});

app.get('/users', async (req, res) => {
    const client = new PgClient();

    client.connect();

    const users = await client.query('Select "Email", "Password" From "Users"."User"');
    res.send(users.rows).json();
});