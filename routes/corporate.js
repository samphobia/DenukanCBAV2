const express = require("express");
const { createCorporate, getAllCorporate } = require('../controllers/corporate')

const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: Corporate
 *  description: Manage Corporate Customers
 */


 /** 
 * @swagger
 * /api/customer/createcorporate:
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
 *    tags: [Corporate]
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
router.post("/createcorporate", createCorporate);

 /**
  * @swagger
  * /api/customer/createcorporate:
  *  get:
  *    summary: gets all corporate customers
  *    description: gets all corporate customers 
  *    tags: [Corporate]
  *    responses: 
  *      200:
  *        description: Corporate user loaded successfully
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *      400:
  *        description: There was an error loading the Corporate customers
  * 
  */
 router.get("/createcorporate", getAllCorporate);

module.exports = router;