/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    
  
    User.attemptLogin({
    email: req.param('email'),
    password: req.param('password')

    }, function (err, user) {


    if (!user) {
      
      var response = {
        success : false,
        userExist : false,
        error : err
      }
      // Otherwise if this is an HTML-wanting browser, redirect to /login.
      return res.json(response);
    }


    if (err) {
      var response = {
        success : false,
        userExist : true,
        error : err
      }

      return res.json(response);
    }
  
    // "Remember" the user in the session
    // Subsequent requests from this user agent will have `req.session.me` set.
    req.session.me = user.id;
    var response = {
        success : true,
        userExist : true,
        error : err
      }

    return res.json(response);

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a 200 response letting the user agent know the login was successful.
    // (also do this if no `successRedirect` was provided)
   
    });
  },


  /**
   * `UserController.logout()`
   */
/*  logout: function (req, res) {
    return res.json({
      todo: 'logout() is not implemented yet!'
    });
  },


  /**
   * `UserController.signup()`
   */


  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters

    User.signup({
      name: req.param('name'),
      password: req.param('password'),
      email: req.param('email'),
      phoneNumber: req.param('phoneNumber')


    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.

      if (err) return res.json(err);
      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user.id;
      req.session.userName = user.userName;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      var response = {
        success : true,
        key : user.id,
      }
      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
       return res.json(response);
    });

  },




  /**
 * Upload avatar for currently logged-in user
 *
 * (POST /user/uploadTraingPhoto)
 */
/*
uploadTraingPhoto: function(req, res){

  req.file('avatar').upload({
    maxBytes:100000
  }),function whenDone(err, uploadedFile){


    if (err) {
      var response = {
        success : false,
        reason : 'error with upload',
      }

      return res.json(response);
    }

    //create photo objects 
    for(i = 0; i < uploadedFiles.length ; i++){

        TrainingPhotos.savePhoto({
          owner : req.param('key')
        }, function (err, TrainingPhotos){
          if(err){
            var response = {
              success : false,
              error : 'problem while saving file'
            }

            return res.json(response);
          }
        }

  });

}

}; */





uploadPicture: function (req, res) {


  req.file('avatar').upload({
     adapter: require('skipper-s3'),
    key: 'AKIAIJ7DGKVU2YVTGQKA',
    secret: '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',
    bucket: 'momnts'

  },function whenDone(err, uploadedFiles) {

    if (err) {
      return res.negotiate(err);
    }

   
    //create add all pictures to database
    for (i = 0; i < uploadedFiles.length; i++) { 

        Photos.savePhoto({
          //  owner : req.param('key'),
            owner : req.session.me
            //latitude : req.param('latitude'),
           // longitude : req.param('longitude'),
          //  users : inputs.users
        }, function (err, TraingingPhoto){

            if(err) return res.json(err);

      });   
    }
    
    return res.json(uploadedFiles);

  });
},


getPhotos: function (req, res){

  req.validate({
    id: 'string'
  });

  User.findOne(req.param('id')).exec(function (err, user){
    if (err) return res.negotiate(err);
    if (!user) return res.notFound();

   

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);

    var fileName = 'd6f49acf-5a56-49a4-8795-4be0954027f7.jpg';
    // Stream the file down
    fileAdapter.read(fileName)
    .on('error', function (err){
      return res.serverError(err);
    })
    .pipe(res);
  });
}


};

