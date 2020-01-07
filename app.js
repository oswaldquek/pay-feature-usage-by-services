const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { Client } = require('pg')
const client = new Client({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: "connector",
  port: 5432,
  host: "localhost",
  ssl: true
})

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

const testDbConnection = async function() {
  try {
    await client.connect()
    const res = await client.query('SELECT NOW() as now')
    console.log('res: ' + JSON.stringify(res.rows))
    await client.end()
  } catch (err) {
    console.log(err)
    throw err
  }
} 

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

testDbConnection()

app.listen(3000);