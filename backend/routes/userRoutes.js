const router = require('express').Router()
const { signup, login, searchUser } = require("../controllers/userController")
const authMiddleWare = require("../middlewares/authMiddleware")


router.post("/signup", signup)
router.post('/login', login)
router.get('/', authMiddleWare, searchUser)

module.exports = router;