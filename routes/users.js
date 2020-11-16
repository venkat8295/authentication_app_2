const express = require('express');
const router = express.Router();
const joi = require('joi');
const passport = require('passport');
const randomstring = require('randomstring');
const multer = require('multer');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const mailer = require('../misc/mailer');
const User = require('../models/user');
const imgModel = require('../models/Image');

var Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'_'+Date.now()+path.extname(file.originalname));
    }
});

var Storage_profile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profile');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname+'_'+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({ storage: Storage });
var upload_profile = multer({ storage: Storage_profile });

//Validation In Schema
const userSchema = joi.object().keys({
  email: joi.string().email().required(),
  username: joi.string().required(),
  password: joi.string().regex(/^[a-zA-z0-9]{3,30}$/).required(),
  confirmationPassword: joi.any().valid(joi.ref('password')).required()
});

const isAuthenticated = (req,res,next) => {
  console.log("req.isAuthenticated():",req.isAuthenticated());
  if(req.isAuthenticated())
  {
    return next();
  }
  else {
    req.flash('error', 'Sorry, But You Must Be Registered First!');
    res.redirect('/');
  }
}

const isNotAuthenticated = (req,res,next) => {
  if(req.isAuthenticated())
  {
    req.flash('error', 'Sorry, But You Are Already Logged In!');
    res.redirect('/');
  }
  else{
    return next();
  }
}

router.route('/register')
  .get(isNotAuthenticated,(req, res) => {
    res.render('register');
  })
  .post(async (req,res,next) => {
    //console.log('req.body:',req.body);
    //const result = joi.validate(req.body, userSchema); // This Code Is Depreciated!
  try{
      const result = userSchema.validate(req.body);
      //console.log('result:',result);
      if(result.error)
      {
      req.flash('error','Password Do Not Match!. Please Try Again.');
      res.redirect('/users/register');
      return;
      }

      // Check If Email Is Already Taken'
      const user = await User.findOne({
      'email' :result.value.email
      });
      if(user){
        req.flash('error','Email Is Already In Use.');
        res.redirect('/users/register');
        return;
      }

      // Hash Implementations
      const hash = await User.hashPassword(result.value.password);
      //console.log('hash',hash);

      // Generate Secret TOken
      const secretToken = randomstring.generate();
      result.value.secretToken = secretToken;

      //result.value.active = false; // Since Mail Is Not Working Properly Assign This To false
      result.value.active = true;

      // Save User To DB
      delete result.value.confirmationPassword;
      result.value.password = hash;

      //console.log('result_new:',result);

      const newUser = await new User(result.value);
      console.log("newUser:",newUser);
      await newUser.save();

      // Compose Mail
      /*const html = `Hi There,<br/> Thank You For Registering Data Authentication!, <br/><br/> Please Verify Your Email By Typing The Following Token: </br>
                   Token:<b> ${secretToken}</b>
                   <br/>
                   On The Following Page:
                   <a href ="https://authentication-app-development.herokuapp.com/users/verify">https://authentication-app-development.herokuapp.com/users/verify</a>
                   <br/><br/>'Have A Pleasant Day ! `;

                   // Send The Email
                   await mailer.sendEmail('Developer@Authentication.com', result.value.email,'Please Verify Your Mail',html);
*/
      //req.flash('success','Check Your Mail! || Please Login !');
      req.flash('success','(Registration Success)Currently Mail Validation Is Disabled! Please Do Direct Login !');
      res.redirect('/users/login');

     }
     catch(error){
        next(error);
     }
  });

router.route('/login')
  .get(isNotAuthenticated,(req, res) => {
    res.render('login');
  })
  .post(passport.authenticate('local',{
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

  router.route('/dashboard').get(isAuthenticated,(req,res) => {
    console.log('req.user:',req.user);

    imgModel.find({}, (err, items) => {
      if (err) {
        console.log(err);
      }
      else {

        User.find({}, (error, users) => {
          console.log('Test:',items);
          console.log('users:',users);

             res.render('dashboard', { items: items, users:users, username_auth:req.user.username, email_auth:req.user.email});
        });
      }
    });
  }).post(upload.single('image'), (req, res, next) => {

    var appDir = path.dirname(require.main.filename);
    console.log("req.body:",req.body);
    //console.log("req.file.filename:",req.file.filename);

    if(req.body.comments == null && req.body.reply == undefined)
    {
      var obj = {
         name: req.body.name,
         desc: req.body.desc,
         file_name:req.file.filename,
         username: req.body.username,
         email: req.body.email,
         img: {
           data: fs.readFileSync(path.join(appDir + '/public/uploads/' + req.file.filename)),
           contentType: 'image/png'
         }
       }
       imgModel.create(obj, (err, item) => {
         if(err){
           req.flash('error','Some Technical Issues! Please Try Agin.');
           res.redirect('/users/dashboard');
         }
         else {
           // item.save();
           req.flash('success','Data Posted Successfully!');
           res.redirect('/users/dashboard');
         }
       });
    }
    else if(req.body.reply == null && req.body.comments != null){
      var image_for_comments = "";
      let comment_id = mongoose.Types.ObjectId();
      if(req.body.image_status == "pass")
      {
        image_for_comments = null;
      }
      else if(req.body.image_status == "passelse")
      {
        image_for_comments = req.file.filename;
      }
      imgModel.findOneAndUpdate({
        _id: req.body.id_user,
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        desc: req.body.desc,
        file_name: req.body.file_name
      },
      {
        $push: {
          comments:
          {
            _id: comment_id,
            data: req.body.comments,
            comments_name: req.body.username_comments,
            comments_email: req.body.email_comments,
            comments_image_name: image_for_comments
          }
        }
      },
      {
        upsert:true,
        new:true
      },(err,data) => {
        //if(err) throw err;
        if(err){
          req.flash('error','Some Technical Issues! Please Try Agin.');
          res.redirect('/users/dashboard');
        }
        //res.render('/dashboard',{todos: data});
        console.log("data_Comment_Update ELse IF",data);
        //res.json(data);
          req.flash('success','Comments Updated Successfully');
          res.redirect('/users/dashboard');
      });

    }
    else {
      let reply_id = mongoose.Types.ObjectId();
      var image_for_replies = "";
      if(req.body.image_replystatus == "pass")
      {
        image_for_replies = null;
      }
      else if(req.body.image_replystatus == "passelse")
      {
        image_for_replies = req.file.filename;
      }
      console.log("Else:::::::::");
      //console.log("req.file.filename:",req.file.filename);
      //mongoose.collection('images').updateOne({
      imgModel.findOneAndUpdate({
        _id: req.body.post_id_hidden
      },
      {
        $push: {
            replies:
            {
              comments_id : req.body.comments_id_ajax,
              _id: reply_id,
              reply: req.body.reply_ajax,
              name: req.body.username_comments1_ajax,
              email: req.body.email_comments1_ajax,
              image_response:image_for_replies
            }
        }
      },
      {
        upsert:true,
        new:true
      },(err,data) => {
        //if(err) throw err;

        if(err){
          req.flash('error','Some Technical Issues! Please Try Agin.');
          res.redirect('/users/dashboard');
        }

          console.log("data_Reply_22222Update ELse",data);
          //res.json({data:'success'});
          req.flash('success','Reply Updated Successfully');
          res.redirect('/users/dashboard');
      });
    }
  });


// For Profile Upload
  router.route('/profile').get(isAuthenticated,(req,res,next) => {
    console.log('Profile req.user:',req.user);

    User.find({email:req.user.email}, (err, items) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Profile Test:',items);
        res.render('profile', { items: items, username_auth:req.user.username, email_auth:req.user.email});
      }
    });
  }).post(upload_profile.single('profile_picture'),(req,res) => {
     console.log("req.body|| Profile Information:::",req.body);
     User.findOneAndUpdate({
       email: req.body.email_auth
     },
     {
             picture_name : req.file.filename,
             dob: req.body.dob,
             address: req.body.address,
             mobile: req.body.mobile
     },
     {
       upsert:true,
       new:true
     },(err,data) => {
       //if(err) throw err;

       if(err){
         req.flash('error','Some Technical Issues! Please Try Agin.');
         res.redirect('/users/dashboard');
       }

         console.log("data_Reply_22222Update ELse",data);
         //res.json({data:'success'});
         req.flash('success','Profile Updated Successfully');
         res.redirect('/users/profile');
     });
  });

  router.route('/verify').get(isNotAuthenticated,(req,res) => {
    res.render('verify')
  }).post(async (req,res,next) => {
    try{
      const {secretToken} = req.body; // This Is Alternative To const secretToken = req.body.secretToken; Both Possibilities (For reference)

      //If Matches The Secret Token
      const user = await User.findOne({ 'secretToken' : secretToken.trim() });

      if(!user){
        req.flash('error','Invalid Token!');
        res.redirect('/users/verify');
        return;
      }

      user.active = true;
      user.secretToken = '';
      await user.save();

      req.flash('success','Thank You! Now You May Login.');
      res.redirect('/users/login');

    }
    catch(error){
      next(error);
    }
  });

  router.route('/logout').get((req,res) => {
    req.logout();
    req.flash('success','Successfully Logged Out! Hope To See You Soon!');
    res.redirect('/');
  });

module.exports = router;
