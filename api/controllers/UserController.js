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
      }
      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
       return res.json(response);
    });

  },


  /**
 * Upload avatar for currently logged-in user
 *
 * (POST /user/avatar)
 */
uploadAvatar: function (req, res) {

 // var filePath = require('path').resolve(sails.config.appPath, '/assets/images');

  //return res.write(filePath);


  req.file('avatar').upload({
    // don't allow the total upload size to exceed ~10MB
   // dirname: filePath,
    maxBytes: 10000000
  },function whenDone(err, uploadedFiles) {
    if (err) {
      return res.negotiate(err);
    }

    // If no files were uploaded, respond with an error.
    if (uploadedFiles.length === 0){
      return res.badRequest('No file was uploaded');
    }
   

    //create add all pictures to database
    for (i = 0; i < uploadedFiles.length; i++) { 

        var photo = null;

        TrainingPhotos.addPhoto({
            owner : req.session.me,
            fileLocation : uploadedFiles[i].fd
        }, function (err, TraingingPhoto){
            if(err) return res.json(err);
            User.update({id:req.session.me},{trainingPhoto:TraingingPhoto}).exec(console.log)

      });

      
    }
    

    return res.json(uploadedFiles);

    //add picture to usre
    // Save the "fd" and the url where the avatar for a user can be accessed
 /*   User.update(req.session.me, {

      // Generate a unique URL where the avatar can be downloaded.
      avatarUrl: require('util').format('%s/user/avatar/%s', sails.getBaseUrl(), req.session.me),

      // Grab the first file and use it's `fd` (file descriptor)
      avatarFd: uploadedFiles[0].fd
    })
    .exec(function (err){
      if (err) return res.negotiate(err);
      return res.ok();
    });  */
  });
}


};

