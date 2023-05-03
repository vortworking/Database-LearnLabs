const Model = require('../model/model');
const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const check_auth = require('../middleware/check-auth');
const checkAuth = require('../middleware/check-auth');


//Post Method
router.post('/register',(req, res) => {

    bcrypt.hash(req.body.password,10,async (err,hash)=>{
        if(err){
            return res.json({
                success:false, message:"hash error !"
            })
        }
        else{
            const data = new Model({
                username: req.body.username,
                email: req.body.email,
                password:hash
            })
            try {
             const dataToSave = await data.save()
                res.status(200).json(dataToSave)
            }
            catch (error) {
                res.status(400).json({ message: error.message })
            }
        }
    })
})

// Login
// router.post('/login',(req,res)=>
// {
//     Model.find({email:req.body.email}).exec().then((result)=>
//     {
//         if(result.length < 1){
//             return res.json({success:false,message:'User not found Check your email'})
//         }
//         const user = result[0];
//         bcrypt.compare(req.body.password, user.password,(err,ret)=>{
//             if(ret){
//                 const payload = {
//                     userId : user._id,
//                 }
//             const token =jwt.sign(payload,"webBatch")
//                 return res.json({success:true,token:token,message:"login Successful."})
//             }
//             else{
//                 return res.json({success:false,message:"login Unsuccessful."})
//             }
//         })
//     }).catch((err)=>{
//         res.json({success:false,message:'Something went Wrong'})
//     })
// })


router.post('/login', (req, res, next) => {
    Model.findOne({ email: req.body.email })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: 'Authentication failed'
          });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Authentication failed'
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id
              },
              'secret',
              {
                expiresIn: '1h'
              }
            );
            return res.status(200).json({
              message: 'Authentication successful',
              token: token
            });
          }
          res.status(401).json({
            message: 'Authentication failed'
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//Get all Method
router.get('/getAll', (req, res) => {
   Model.find({}).exec().then((result)=>
   {
    res.json({success:true,data:result})
   }).catch(err => {
    res.json({success:false,message:'Server Error'})
   })
});


router.get('/profile',checkAuth,(req,res)=>{
    const userId = req.userData.userId
    Model.findById(userId).exec().then((result)=>{
        res.json({
            success:true,data:result
        })
    }).catch(err=>
        {
            res.json({success:false,message:"server error"})
        })
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
})

module.exports = router;