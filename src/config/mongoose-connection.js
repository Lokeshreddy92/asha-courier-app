const mongoose = require("mongoose"),
  { deafult: Config } = require("./config");

const connection_url = (
  process.env.DB_CONNECTION_URL || Config.db_connection_url
).trim();

const connect = async () => {
  try {
    await mongoose.connect(connection_url, {
      poolSize: 10,
      keepAlive: true,
      connectTimeoutMS: 30000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected to Mongoose');
  } catch (err) {
    throw new Error('Mongoose Connection Error');
  }
};

module.exports = connect;
