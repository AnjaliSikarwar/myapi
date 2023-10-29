const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dael2ocmy',
    api_key: '358966132936553',
    api_secret: 'ogV5HSW5zSMFf4o7abwHIP2YUlw'
});
class UserController{

    static getalluser = async(req,res)=>{
        try {
            res.send('hello user')
        } catch (error) {
            console.log(error)
        }
    }

    static userinsert = async (req, res) => {
        const { name, email, password, confirmpassword } = req.body
        const file = req.files.image
        // image upload code 
        const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'profileimageapi'
        })
        const user = await UserModel.findOne({ email: email })
        // console.log(image_upload)
        if (user) {
            res
                .status(401)
                .json({ status: "failed", message: "This email is already exits" });
        } else {
            if (name && email && password && confirmpassword) {
                if (password == confirmpassword) {
                    try {
                        const hashpassword = await bcrypt.hash(password, 10);
                        const result = new UserModel({
                            name: name,
                            email: email,
                            password: hashpassword,
                            confirmpassword: confirmpassword,
                            image: {
                                public_id: image_upload.public_id,
                                url: image_upload.secure_url,
                            }
                        })
                        await result.save()
                        res.status(201).json({
                            status: "success",
                            message: "Registration Successfully",
                        })
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    res
                        .status(401)
                        .json({ status: "error", message: "password and confirmpassword does not match" });
                }
            } else {
                res
                    .status(401)
                    .json({ status: "failed", message: "all field required" });
            }
        }

    }
}


module.exports = UserController