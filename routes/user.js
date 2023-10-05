const express = require("express");

const { createUser, userLogin } = require("../controllers/user");
const { authorizeRoute } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });


 /**
 * @swagger
 * tags:
 *  name: User
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
 * /api/user:
 *  post:
 *    summary: Allows a Merchant create a user 
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *              role:
 *                type: string
 *              password:
 *                type: string
 *    tags: [User]
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
router.post("/", authorizeRoute, createUser);

router.post("/login", userLogin)

module.exports = router;
