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

    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            // console.log(password)
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                // console.log(user.password)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatched) {
                        // verify token
                        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                        res.cookie('token', token)
                        // console.log(token)
                        res
                            .status(201) //create
                            .send({ status: "success", message: "Login Successfully with web Token😃🍻", "token": token });

                    } else {
                        res.send({ status: "failed", message: "ᴇᴍᴀɪʟ or password is not valid😓" });
                    }
                } else {
                    res.send({ status: "failed", message: "You are not a Registerd User😓" });
                }
            } else {
                res.send({ status: "failed", message: "All fields are required😓" });
            }
        } catch (err) {
            console.log(err)
        }
    }

    static updatePassword = async (req, res) => {
        // console.log(req.user)
        try {
            const { oldPassword, newPassword, confirmpassword } = req.body

            if (oldPassword && newPassword && confirmpassword) {
                const user = await UserModel.findById(req.user.id);
                const isMatch = await bcrypt.compare(oldPassword, user.password)
                //const isPasswordMatched = await userModel.comparePassword(req.body.oldPassword);
                if (!isMatch) {
                    res.send({ "status": 400, "message": "Old password is incorrect" })
                } else {
                    if (newPassword !== confirmpassword) {
                        res.send({ "status": "failed", "message": "password does not match" })
                    } else {
                        const salt = await bcrypt.genSalt(10)
                        const newHashPassword = await bcrypt.hash(newPassword, salt)
                        //console.log(req.user)
                        await UserModel.findByIdAndUpdate(req.user.id, { $set: { password: newHashPassword } })
                        res.send({ "status": "success", "message": "Password changed succesfully" })
                    }
                }
            } else {
                res.send({ "status": "failed", "message": "All Fields are Required" })
            }

        } catch (err) {
            res.send(err)
            console.log(err)
        }
    }

    static updateProfile = async (req, res) => {
        try {
            // console.log(req.body);
            // const {avatar} = req.body // for now we dont need this
            const updateimage = await UserModel.findById(req.user.id)
            // console.log(updateimage); // full data we'r getting
            const imageId = updateimage.avatar.public_id;
            // console.log(imageId); // isse User_Avatar/q1iirbawf0csjlbojfex yeh get hota h.
            await cloudinary.uploader.destroy(imageId); //delete image then update
            const Blogimages = req.files.avatar;
            const blogImage_upload = await cloudinary.uploader.upload(Blogimages.tempFilePath, {
                folder: 'User_Avatar',
            });
            const update = await UserModel.findByIdAndUpdate(req.user.id, {
                avatar: {
                    public_id: blogImage_upload.public_id,
                    url: blogImage_upload.secure_url,
                },
            })
            await update.save()
            res.send({
                "status": "success",
                "message": "upadate succesfully 😃🍻",
                update,
                avatar: blogImage_upload.secure_url,
            })
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }

    static View = async (req, res) => {

        const view = await UserModel.findById(req.params.id)
        res.status(200).json({
            success: true,
            view,
        });
    }

    static logoutUser = async (req, res) => {
        try {
            const logout = await UserModel.findById(req.params.id)
            res.clearCookie('token')
            res.send({ status: "success", message: "logout successfull 😃🍻", logout});
        } catch (err) {
            console.log(err)
            res.send(err)
        }
    }
}


module.exports = UserController