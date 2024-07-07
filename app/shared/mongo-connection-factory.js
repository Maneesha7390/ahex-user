const mongoose =  require('mongoose')
const logger = require('./logger')
const dotenv =  require('dotenv')
const CONSTANTS = require('../shared/constants')

module.exports = {
    connect,
    connectionFactory,
    isReady
}


const options = {
    connectTimeoutMS: 5000,
    maxPoolSize: 50,
  };

let ISREADY = false;
let baseConnectionString;
let connectionString;
const connections = new Map();

function baseConnectionURL(){
    dotenv.config({path: `${__dirname}/../.env`})
    connectionString = process.env.MONGODB_BASE_URL
    // console.log('connectionString....', connectionString)
    return connectionString
}

subscribeToEvents(mongoose.connection, CONSTANTS.DATABASE_NAME);


async function connect(){
    try{
        baseConnectionString = baseConnectionURL()
        const cluster_connection = await mongoose.createConnection(baseConnectionString, options)
        subscribeToEvents(cluster_connection, CONSTANTS.DATABASE_NAME);
        connections.set('ahex-user', cluster_connection);
    }catch(err){
        logger.error(`Error connecting to the database`);
        throw err
    }
}


function isReady() {
    return ISREADY;
  };
  
function connectionFactory() {
    {
      const dbName = 'ahex-user';
      if (connections.has(dbName)) {
        return connections.get(dbName);
      } else {
        baseConnectionString = baseConnectionURL();
        const connection = mongoose.createConnection(baseConnectionString, options);
        subscribeToEvents(connection, dbName);
        connections.set(dbName, connection);
        return connection;
      }
    }
  };

  async function subscribeToEvents(connection, name){
    connection.addListener('connecting', (args)=>{logger.info(`Connecting to ${name} database`); ISREADY = false})
    connection.on('connected', (args)=>{logger.info(`connected to ${name} database`); ISREADY = true})
    connection.on('disconnected', (args)=>{logger.error(`Disconnected fom ${name} database`); ISREADY = false})
    connection.addListener('disconnecting', (args)=>{logger.error(`Disconnecting from ${name} database`); ISREADY = false})
    connection.addListener('reconnected', (args)=>{logger.error(`Reconnected to ${name} database`); ISREADY = true})
    connection.addListener('error',function(err){
        logger.error(err.message)
        ISREADY = false
        throw new Error(`Error Connecting to ${name} database`)
    })
}