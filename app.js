const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const db = require('./datasources/connector')

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

const testDbConnection = async function() {
  try {
    const res = await db.query('select now() as now')
    console.log(JSON.stringify(res.rows))
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