const PgClient = require('./database.js');
const express = require('express');
const { createHash } = require('crypto');
const cors = require('cors');
const app = express();
const port = 5000;
const {v4 : uuid} = require('uuid');
const {google} = require('googleapis');
const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar',
];
const nodemailer = require("nodemailer");
const adminUser = async (user) =>{
    const client = new PgClient();
    client.connect();
    user = await client.query('SELECT * FROM "Users"."User" WHERE "Admin" = true')
    console.log("Admin users in db: "+user.rows.length+" no need to create");
    if (user.rows.length === 0){
        const readline = require('node:readline');
        const { stdin: input, stdout: output } = require('node:process');
        const rl = readline.createInterface(input,output)
        console.log("We dont have an admin user so you need to give me one!\n")
        rl.question(`Give me an email address (lorem.ipsum@lorem.ipsum):\n`,(email) =>{
            rl.question(`Give me a password (8 long min: 1 A, 1 a, 1 number):\n`, (password) =>{
                client.query('INSERT INTO "Users"."User" ("Password", "Email", "Admin") VALUES ($1, $2, true);', [
                        createHash('sha256').update(password).digest('hex'),email],
                    (error, result) => {
                        console.log('inserted, sending data');
                        if (error) throw error
                    });
            });
        });
    }
}
adminUser()
async function send(userEmail,text,dateStart,dateEnd,title, subject){

    const trasnporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'calendittestuser@gmail.com',
            pass: 'xvocbnvhipxgeimg'
        }
    });
    const mailOptions = {
        from: 'calendittestuser@gmail.com',
        to: `${userEmail}`,
        subject: `${subject}`,
        html: `
                <h1>CalendIT</h1>
                <br>
                <p>${text}</p>
                <br>
                <h2>${title}</h2>
                <p>${dateStart}</p>
                <p>${dateEnd}</p>
                <br>
                <p>Please contact us on <br>calendittestuser@gmail.com<br>For further questions</p>
              `
    };
    await trasnporter.sendMail(mailOptions, (err, info)=>{
        if (err){
            console.log(err);
        }else {
            console.log('email sent: '+ info.response);
        }
    });
}

app.use(cors());
app.use(express.json());
app.listen(port, ()=>{
    console.log(`Server is Now on ${port} port`)
})
app.post('/login', async (req, res) =>{
    const client = new PgClient;
    client.connect();
    const loginData = await client.query('Select * from "Users"."User" Where "Email" = $1 And "Password" = $2 ',
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

    const users = await client.query('Select * From "Users"."User"');
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
   const userEmails = await client.query('SELECT "Email" FROM "Users"."User" WHERE "Admin" = false;');
   const eventDate = await client.query('SELECT "title","start_date","end_date" FROM "Users"."Events" WHERE "event_id" = $1', [req.params.id])
   for (let i = 0; i<userEmails.rows.length;i++){
     await send(`${userEmails.rows[i].Email}`,
          "We canceled the appointment, for company issues. If you have other time to meet please contact us",
          `${eventDate.rows[0].start_date}`, `${eventDate.rows[0].end_date}`, `${eventDate.rows[0].title}`,"Appointment Suspended");
   }
   client.query('DELETE FROM "Users"."Events" WHERE event_id = $1;', [req.params.id],
   async (error, result) => {
       console.log('deleted, sending data');
       if (error) throw error;
       res.status(200).send("");
   });

});

app.get('/events', async (req, res) =>{
    const client = new PgClient();
    client.connect();
    const events =  await client.query('SELECT * FROM "Users"."Events";');
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
            conferenceData: {
                createRequest: {
                    requestId: uuid(),
                }
            },
            summary: eventData[i].title,
            description: eventData[i].notes,
            colorId: Math.floor(Math.random() * 11) + 1
        }
        console.log(event);
        await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1
        }, err => {

        });
    }

});
