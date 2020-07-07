const express = require ('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/users/login',function(req,res,next){
    User.findOne({email:req.body.email}).then(function(user){
      if(user.length<1){
        res.status(401).json({message:'Authentication failed'})
      }
        bcrypt.compare(req.body.password,user.password,function(err,result){
            if(err){
                res.status(401).json({message:'User not found'})
            }
            if(result){
              const token = jwt.sign({email:user.email},process.env.JWT_KEY,{expiresIn:'1h'})
              res.status(200).json({message:'Authentication successful'})
            }
            else{
              res.status(401).json({message:'Authentication failed'})
            }
        })
    }).catch(err => console.log(err))
})

router.post('/users/signup', (req, res) => {
    const {email, password} = req.body;
    if ( !email || !password ) {
        res.status(200).json({ msg: 'Please enter all fields' });
      }
    User.findOne({ email: email }).then(user => {

        if (user) {
            return res.status(403).json({ message: "Email is already registered with us." });

        } else {
          const newUser = new User(req.body);

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.send(user)

                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  );
  router.get('/users',async(req,res)=>{
      const users=await User.find({})
      console.log(users)
      res.send(users)
  })
  router.put('/users/:id',(req,res)=>{

      id=req.params.id;
      User.findOne({_id:id}).then(user =>{
        if(user)
        {
            user = new User(req.body);

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then(user => {
                  res.send(user)
                })
                .catch(err => console.log(err));
            });
        })
    }
        else{
          res.send({mssg:"No user exists."})
        }
    })

  })

    router.get('/users/:id',(req,res,next)=>{
    id = req.params.id
    console.log(id);
    User.findOne({_id:id}).then(user =>{
        if(user)
        res.send(user)
        else{
          res.send({mssg:"No user exists."})
        }
    }).catch(next)
  }
  )
  router.delete('/users/:id', function(req, res, next){
    User.findByIdAndRemove({_id: req.params.id}).then(function(user){
        res.send(user);
    }).catch(next);
  });

  module.exports = router;
