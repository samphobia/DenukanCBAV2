require("dotenv").config()
const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const cors = require('cors')

const sequelize = require('./config/database')


// dotenv.config({ path: "./config/config.env" })

// connectDB()

const merchant = require("./routes/merchant");
const user = require("./routes/user");
const auth = require("./routes/auth")
const customer = require("./routes/customer")
const corporate = require("./routes/corporate")
const account = require("./routes/account")

const options = {
  definition: {
    openapi:  "3.1.0",
    info: {
      title: "Denukan CoreBanking API Collections",
      version: "1.0.0",
      description: "DENUKAN COREBANKING SOFTWARE API v2.2",
      contact:{
        "name": "Denukan Network Limited",
        "url": "https://denukan.com",
        "email": "info@denukan.com"
      },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
    },
   
    servers: [
      {
        url: "https://doubtful-tan-peplum.cyclic.cloud",
        description: "Test server"
              
      },
      {
        url: "https://denukan-cbav-2-ej0jwupik-samphobia.vercel.app",
        description: "Test server"
              
      },
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
// app.use(bodyParser.urlencoded({ extended: false })



app.use('/api/merchant', merchant);
app.use('/api/user', user);
app.use('/api/auth', auth)
app.use('/api/customer', customer)
app.use('/api/corporate', corporate)

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