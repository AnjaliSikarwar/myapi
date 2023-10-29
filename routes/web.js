const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()


//usercontroller
router.get('/getalluser',UserController.getalluser)
router.post('/userinsert',UserController.userinsert)
router.post('/loginUser',UserController.loginUser)
router.get('/logoutUser',UserController.logoutUser)
router.get('/view',UserController.View)
router.get('/updatePassword',UserController.updatePassword)
router.get('/updateProfile',UserController.updateProfile)







module.exports = router