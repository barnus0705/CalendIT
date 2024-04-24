const PgClient = require('./database.js');
const express = require('express');
const { createHash } = require('crypto');
const cors = require('cors');
const app = express();
const port = 5000;

const {google} = require('googleapis');

const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar',
];

app.use(cors());
app.use(express.json());
app.listen(port, ()=>{
    console.log(`Server is Now on ${port} port`)
})
app.post('/login', async (req, res) =>{
    const client = new PgClient;
    client.connect();
    const loginData = await client.query('Select "Email","Password","ID" from "Users"."User" Where "Email" = $1 And "Password" = $2 ',
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

app.post('/events/add', async (req, res) => {
    const client = new PgClient();
    client.connect();
    console.log(req.body);

    client.query('INSERT INTO "Users"."Events" ("title", "start_date", "end_date", "notes", "allday", "rrule", "userid") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING event_id;',
        [req.body.title, req.body.startDate, req.body.endDate, req.body.notes, req.body.allDay, req.body.rRule, req.body.id],
        async (error, result) => {
            console.log('inserted, sending data');
            if (error) throw error;
            const data =  await client.query('SELECT * FROM "Users"."Events" WHERE event_id = $1', [result.rows[0].event_id]);
            console.log(data);
            res.status(200).send(data.rows[0]);
        }
    );

});

app.post('/events/change', async (req, res) => {
    const client = new PgClient();
    client.connect();

    let toUpdate = [];
    let updateValues = [];
    let keyMap = {
        'endDate': 'end_date',
        'startDate': 'start_date',
        'rRule': 'rrule',
        'allDay': 'allday'
    };

    const eventId = Object.keys(req.body)[0];
    const data = req.body[eventId];

    for (const entry of Object.entries(data)) {
        const key = entry[0];
        if (typeof keyMap[key] !== 'undefined') {
            toUpdate.push(keyMap[key]);
        } else {
            toUpdate.push(key);
        }
        updateValues.push(entry[1]);
    }
    updateValues.push(eventId)

    const updateList = toUpdate.reduce((prev, curr, ind) => {
        if (prev === '')
            return `${curr} = \$${ind + 1}`
        else
            return `${prev}, ${curr} = \$${ind + 1}`
    }, '');

    client.query(`UPDATE "Users"."Events" SET ${updateList} WHERE event_id = \$${updateValues.length};`, updateValues,
        async (error, result) => {
            console.log('changed, sending data');
            if (error) throw error;
            res.status(200).send("");
        }
    );

});
app.delete('/events/:id', async (req, res) =>{
   const client = new PgClient();
   client.connect();

    client.query('DELETE FROM "Users"."Events" WHERE event_id = $1;', [req.params.id],
    async (error, result) => {
        console.log('deleted, sending data');
        if (error) throw error;
        res.status(200).send("");
    });

});

app.get('/events/:id', async (req, res) =>{
    const client = new PgClient();
    client.connect();
    const events =  await client.query('SELECT * FROM "Users"."Events" WHERE "userid" = $1 ORDER BY event_id ASC ', [req.params.id]);
    res.send(events.rows);
});

app.get('/auth/google', (req,res) => {
    const oAuth2Client = new google.auth.OAuth2(
        "985996713619-9li10t5jorb36afo70hdnqmnad8b2mlr.apps.googleusercontent.com",
        "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",
        "http://localhost:5000/auth/redirect"
    );

    const url = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.redirect(url);
});

app.get('/auth/redirect',  async (req, res) =>{
    const token = req.query.code
    res.redirect(`http://localhost:5173/main?token=${token}`);
});

app.post('/auth/google/upload', async (req, res) =>{
    const oAuth2Client = new google.auth.OAuth2(
        "985996713619-9li10t5jorb36afo70hdnqmnad8b2mlr.apps.googleusercontent.com",
        "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",
        "http://localhost:5000/auth/redirect"
    );

    const { tokens } = await oAuth2Client.getToken(req.body.token);

    console.log(tokens);

    oAuth2Client.setCredentials(tokens);

    const eventData = req.body.data.map(data => {
            return{
                title: data.title,
                notes: data.notes,
                endDate: new Date(data.endDate).toISOString(),
                startDate: new Date(data.startDate).toISOString()
            };
    });

    const calendar = google.calendar({
        version: "v3",
        auth: oAuth2Client
    })

    for(let i = 0; i<eventData.length;i++){
        const event = {
            start: {
                dateTime: eventData[i].startDate,
            },
            end: {
                dateTime: eventData[i].endDate,
            },
            summary: eventData[i].title,
            description: eventData[i].notes,
            colorId: Math.floor(Math.random() * 11) + 1
        }
        console.log(event);
        await calendar.events.insert({
            calendarId: 'primary',
            resource: event
        }, err => {

        });
    }

});
