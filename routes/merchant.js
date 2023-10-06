const express = require("express");

const {
  createMerchant,
  loginMerchant,
  getAllUsers,
  getUserById,
  updateUser,
  verifyMerchant, 
  getAllMerchant} = require("../controllers/merchant");
  const { authorizeRoute } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

 /**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: login and SignUp Merchant
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     Merchant:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         name:
 *           type: string
 *           description: The name of your merchant
 *         email:
 *           type: string
 *           description: The email of merchant
 *         password:
 *           type: string
 *           description: Whether you have finished reading the book
 *         role:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         name: Denukan
 *         email: info@denukan.com
 *         password: Alexander K. Dewdney
 *         role: Admin
 */

/** 
 * @swagger
 * /api/merchant:
 *  post:
 *    summary: creates a Merchant
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              merchantName:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              sortCode:
 *                type: string
 *              colorCode:
 *                type: string
 *              description:
 *                type: string
 *              instagram:
 *                type: string
 *              facebook:
 *                type: string
 *              twitter:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: created new Merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error creating a merchant
 *
 */
router.post("/", createMerchant);


/** 
 * @swagger
 * /api/merchant/verifymerchant:
 *  post:
 *    summary: verifies a Merchant sing OTP
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              otp:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: created new Merchant
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error creating a merchant
 *
 */
router.post("/verifymerchant", authorizeRoute, verifyMerchant);

/**
 * @swagger
 * /api/merchant/login:
 *  post:
 *    summary: login merchant
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              merchantId:
 *                type: string
 *              password:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: login merchant successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error logging the merchant
 *
 */
router.post("/login", loginMerchant);

 /**
  * @swagger
  * /api/merchant:
  *  get:
  *    summary: gets all Merchant
  *    description: gets all Merchants 
  *    tags: [Authentication]
  *    responses: 
  *      200:
  *        description: Merchant loaded successfully
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *      400:
  *        description: There was an error loading the merchant
  * 
  */
router.get("/", getAllMerchant);

 /**
  * @swagger
  * /api/merchant/{id}:
  *  get:
  *    summary: gets Merchant by id
  *    tags: [Authentication]
  *    parameters:
  *       - in: path
  *         name: id
  *         schema:
  *            type: array
  *            items:
  *               type: string
  *         required: true
  *         description: news Article ID
  *    responses: 
  *      200:
  *        description: Merchant loaded successfully
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *      400:
  *        description: There was an error loading the Merchant
  * 
  */
// router.get("/:id", getUserById);

/**
 * @swagger
 * /api/merchant/{id}:
 *  put:
 *    summary: updates a merchant
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: merchant updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error creating the news merchant
 *
 */
// router.put("/:id", updateUser);



/**
 * @swagger
 * /api/merchant/reset-password:
 *  post:
 *    summary: Reset merchant's password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              new password:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: password has been reset
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description:  error with the process
 *
 */
// router.post("/reset-password", resetPassword)


module.exports = router;
