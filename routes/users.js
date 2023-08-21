const express = require('express')

const { createUser, loginUser} = require('../controllers/users')

const router = express.Router({ mergeParams: true });

// /**
//  * @swagger
//  * tags:
//  *  name: Authentication
//  *  description: login and SignUp User
//  */
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

module.exports = router;