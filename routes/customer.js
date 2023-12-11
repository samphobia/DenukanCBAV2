const express = require("express");
const { createCustomer, getAllCustomers, updateCustomer } = require('../controllers/customer');
const { authorizeUser, authenticateUser } = require("../middleware/auth");

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Customer
 *  description: Manage Customer
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The name of your user
 *         firstName:
 *           type: string
 *           description: The name of your user
 *         lastName:
 *           type: string
 *           description: The email of user
 *         nationality:
 *           type: string
 *           description: password of the user
 *         dob:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *         sex:
 *           type: string
 *           description: password of the user
 *         stateOfOrigin:
 *           type: string
 *           description: password of the user
 *         sector:
 *           type: string
 *           description: password of the user
 *         residentState:
 *           type: string
 *           description: password of the user
 *         residentCity:
 *           type: string
 *           description: password of the user
 *       example:
 *         name: Denukan
 *         email: info@denukan.com
 *         password: Alexander
 *         role: Admin
 */


 /** 
 * @swagger
 * /api/customer/createcustomer:
 *  post:
 *    summary: creates a customer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                type: string
 *              nationality:
 *                type: string
 *              dob:
 *                type: date
 *              education:
 *                type: string
 *              sex:
 *                type: string
 *              stateOfOrigin:
 *                type: string
 *              sector:
 *                type: string
 *              residentState:
 *                type: string
 *              residentCity:
 *                type: string
 *              residentAddress:
 *                type: string
 *              officeAddress:
 *                type: string
 *              officePhone:
 *                type: string
 *              homePhone:
 *                type: string
 *              mobilePhone:
 *                type: string
 *              nextOfKinPhone:
 *                type: string
 *              nextOfKinAddress:
 *                type: string
 *              nextOfKinEmail:
 *                type: string
 *              nameOfNOK:
 *                type: string
 *              meansOfID:
 *                type: string
 *              IDNo:
 *                type: string
 *              IDExpiryDate:
 *                type: string
 *              referrerName:
 *                type: string
 *              referrerPhone:
 *                type: string
 *              IDIssueDate:
 *                type: string
 *              isCustomerGroup:
 *                type: string
 *              isCustomersignatory:
 *                type: string
 *              introducer:
 *                type: string
 *              introducerId:
 *                type: string
 *              BVN:
 *                type: string
 *              businessCategory:
 *                type: string
 *              isCustomerRelated:
 *                type: string
 *    tags: [Customer]
 *    responses:
 *      200:
 *        description: created new user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error creating the news user
 *
 */
router.post("/createcustomer", authenticateUser, createCustomer);

 /**
  * @swagger
  * /api/customer/createcustomer:
  *  get:
  *    summary: gets all customers
  *    description: gets all users 
  *    tags: [Customer]
  *    responses: 
  *      200:
  *        description: User loaded successfully
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *      400:
  *        description: There was an error loading the User
  * 
  */
router.get("/getallcustomers", authenticateUser, getAllCustomers);


router.patch("/updatecustomer/:customerId", authenticateUser,  updateCustomer);

module.exports = router;