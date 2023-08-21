require("dotenv").config()
const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const connectDB = require("./config/database");
const User = require('./models/user');
const Merchant = require('./models/merchant');
const Contact = require('./models/contact');
const Phone = require('./models/phone');
const cors = require('cors')

const sequelize = require('./config/database')


// dotenv.config({ path: "./config/config.env" })

// connectDB()

const users = require("./routes/users");
const merchant = require("./routes/merchant");

const options = {
  definition: {
    openapi:  "3.0.0",
    info: {
      title: "Denukan CoreBanking API Collections",
      version: "1.0.0",
      description: "DENUKAN SOFTWARE API v2.2"
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          schema: 'bearer',
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      }
    ],
    servers: [
      // {
      //   url: "https://cerise-life-jacket.cyclic.app/"
              
      // },
      {
        url: "http://localhost:4002/"
      }
    ],
  },

  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()

app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));



app.use('/api/user', users);
app.use('/api/merchant', merchant);

// User.hasOne(Merchant)
// Merchant.belongsTo(User, {constraints: true, onDelete: 'CASACADE'})
// Merchant.hasMany(Contact);
// Contact.belongsTo(Merchant);
// Contact.hasMany(Phone);
// Phone.belongsTo(Contact);

const port = process.env.PORT || 4002;
const devEnvironment = process.env.NODE_ENV;

const server =  app.listen(port, async () => {
  try {
     console.log(`server started in ${devEnvironment} mode on port ${port}`);
  } catch (err) {
     console.log("server didn't start", err);
  }
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);

  //close server and exit process
  server.close(() => {
     process.exit(1);
  });
});