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




  signup: function (req, res) {

    console.log(req.allParams());

    User.signup({
      name: req.param('name'),
      password: req.param('password'),
      email: req.param('email'),
      phoneNumber: req.param('phoneNumber')


    }, function (err, user) {
    
      //if error return error 
      if (err) return res.json(err);
      

     
     //set up response, and send down the key 
      var response = {
        success : true,
        key : user.id,
      }

       return res.json(response);
    });
  },







  // (POST /user/uploadTraingPhoto)
  uploadTraingPhoto: function(req, res){
    //var a = parseInt("10") + "<br>";
    //console.log(req.param('key'));

  
   var response = {
     success : false,
     error : null
   }

    var fs = require('fs');
    var AWS = require('aws-sdk'); 

   AWS.config.update({
     accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
     secretAccessKey: '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', 
   }); 
 
   var s3 = new AWS.S3();

    User.findOne({id:1}).exec(function findOneCB(err,found){
  
   // console.log(found);
    //console.log(req.param('key'));
   // var userName = found.userName;
  var userName = "kaseanherrera";
  
    req.file('avatar').upload({
      maxBytes: 10000000
    },
    
    function whenDone(err, uploadedFile){
      //loop through uploaded files and upload them to amazon .  
      for(var i = 0; i < uploadedFile.length ; i++){
        var directorySplit = uploadedFile[i].fd.split("/");
        var fileName = directorySplit[directorySplit.length-1];
    
        var location = userName + '/trainingPhotos/' + fileName;
        fs.readFile(uploadedFile[i].fd, function(err,data){
          var params = {
           Bucket: 'momnts', 
           Key: location, 
           ACL: 'public-read-write',
           Body: new Buffer(data) 
          };

          s3.putObject(params, function(err, data) {
            if (err) console.log("err, err.stack"); // an error occurred
            else     console.log(data);
        });
      });


      TrainingPhotos.savePhoto({
        fileLocation : location,
        owner : req.param('key')
      },function (err,TraingingPhoto){
        if(err) console.log(err);
      }); 
    }
  }); 

  });
  
  response.success = true;
  return res.json(response);
},


// (POST /user/uploadPhoto)
uploadPhoto: function(req, res){
  
  var response = {
    success : false,
    error : null
  }

  var fs = require('fs');
  var AWS = require('aws-sdk'); 

  AWS.config.update({
    accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
    secretAccessKey: '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', 
  }); 
 
  var s3 = new AWS.S3();

 // User.findOne({id:req.param('key')}).exec(function findOneCB(err,found){
  User.findOne({id:1}).exec(function findOneCB(err,found){
 
 // var userName = found.userName;
  var userName = 'kaseanherrera';

 
  
  req.file('avatar').upload({
        maxBytes: 10000000
  },
    
  function whenDone(err, uploadedFile){
    //loop through uploaded files and upload them to amazon . 
    console.log(uploadFile.size);
    console.log("********************************************");
    for(var i = 0; i < uploadedFile.length ; i++){
      var directorySplit = uploadedFile[i].fd.split("/");
      var fileName = directorySplit[directorySplit.length-1];
    
      var location = userName + '/photos/' + fileName;
      fs.readFile(uploadedFile[i].fd, function(err,data){
        var params = {
          Bucket: 'momnts', 
          Key: location, 
          ACL: 'public-read-write',
          Body: new Buffer(data) 
        };

        s3.putObject(params, function(err, data) {
          if (err) console.log(err); // an error occurred
          else     console.log(data);
        });
      });


      Photos.savePhoto({
        fileLocation : location,
       // owner : req.param('key')
        owner : 1

      },function (err,Photo){
        if(err) console.log(err);
      }); 

    }
  }); 

 });

  response.success = true;
  return res.json(response);
},




getPhotos: function (req, res){

    
}


};

