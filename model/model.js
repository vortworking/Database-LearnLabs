const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const dataSchema = new mongoose.Schema({
    username: {
        required: [true,'Username is required'],
        type: String
    },
    email: {
        required: [true,'Email is required'],
        type: String,
        unique: true
    },
    password:
    {
        required:[true,'Password is required'],
        minlength : [4,'Password must be atleast 4 character long'],
        type:String
    },
    saltSecret:String
})

dataSchema.path('email').validate((val)=>{
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = mongoose.model('User', dataSchema);
