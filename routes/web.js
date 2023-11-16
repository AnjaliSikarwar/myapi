const express = require('express')
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const router = express.Router()



//usercontroller
router.get('/getalluser',UserController.getalluser)
router.post('/userinsert',UserController.userinsert)
router.post('/loginUser',UserController.loginUser)
router.get('/logoutUser',UserController.logoutUser)
router.get('/view',UserController.View)
router.post('/updatepassword/:_id',UserController.updatePassword)
router.get('/updateprofile/:id',UserController.updateProfile)


//product Controller
router.get('/getAllProducts',ProductController.getAllProducts)
router.post('/createProduct',ProductController.createProduct)
router.get('/getProductDetail',ProductController.getProductDetail)
router.get('/getAdminProduct',ProductController.getAdminProduct)
router.post('/updateProduct',ProductController.updateProduct)
router.get('/deleteProduct',ProductController.deleteProduct)






module.exports = router