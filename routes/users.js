const express = require("express");

const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  getMe,
  resetPassword } = require("../controllers/users");

const router = express.Router({ mergeParams: true });

 /**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: login and SignUp User
 */

 /**
 * @swagger
 * components:
 *   schemas:
 *     User:
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
 *           description: The name of your user
 *         email:
 *           type: string
 *           description: The email of user
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
 *    summary: creates a user
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
 *              password:
 *                type: string
 *              role:
 *                type: string
 *    tags: [Authentication]
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
router.post("/", createUser);

/**
 * @swagger
 * /api/user/login:
 *  post:
 *    summary: login user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    tags: [Authentication]
 *    responses:
 *      200:
 *        description: login user successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error logging the user
 *
 */
router.post("/login", loginUser);

 /**
  * @swagger
  * /api/user:
  *  get:
  *    summary: gets all Users
  *    description: gets all users 
  *    tags: [Authentication]
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
router.get("/", getAllUsers);

 /**
  * @swagger
  * /api/user/{id}:
  *  get:
  *    summary: gets User by id
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
  *        description: User loaded successfully
  *        content:
  *          application/json:
  *            schema:
  *              type: object
  *      400:
  *        description: There was an error loading the User
  * 
  */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/user/{id}:
 *  put:
 *    summary: updates a user
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
 *        description: user updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *      400:
 *        description: There was an error creating the news user
 *
 */
router.put("/:id", updateUser);

 /**
  * @swagger
  * /api/user/me:
  *  get:
  *    summary: gets logged in user
  *    tags: [Authentication]
  *    security:
  *      - bearerAuth: []
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
router.get("/me", getMe)

/**
 * @swagger
 * /api/user/reset-password:
 *  post:
 *    summary: Reset user's password
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
router.post("/reset-password", resetPassword)


module.exports = router;
