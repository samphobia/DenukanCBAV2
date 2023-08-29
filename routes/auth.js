const express = require("express")
const { getMe } = require("../controllers/auth")
const { protectRoute } = require("../middleware/auth");

const router = express.Router()

 /**
  * @swagger
  * /api/auth/me:
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
router.get("/me", protectRoute, getMe)

module.exports = router;