const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },

    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    
    confirmpassword: {
        type: String,
        required: true,
    },
   
    role: {
        type: String,
        default: 'student',
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
},
    { timestamps: true }
)
const UserModel = mongoose.model('user', UserSchema)
module.exports = UserModel