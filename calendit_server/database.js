const {Client} = require('pg')

const client = createPool({
    host: "localhost",
    user: "postgres",
    password: "rootuser",
    port: 5432,
    database: "postgres"
})

client.connect();

client.query(`Select * from users`, (err, res)=>{
    if (!err){
        console.log(res.rows);
    } else {
        console.log(err.message);
    }
    client.end;
})