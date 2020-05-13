const express = require ('express');
const router = express.Router();
const bcrypt=require('bcryptjs');
const User = require('../models/user');


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