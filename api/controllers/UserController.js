/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  login: function (req, res) {
    
    var response = {
        success : false,
    }
  
    User.attemptLogin({
    email: req.param('email'),
    password: req.param('password')

    }, function (err, user) {

    if (!user) {
      response.userExist = false;
      return res.json(response);
    }

    if (err) {
      response.error = err;
      return res.json(response);
    }
  
    response.success = true;
    response.userId = user.id;
    response.userName = user.userName;

    return res.json(response);
   
    });
  },




  signup: function (req, res) {

    User.signup({
      name: req.param('name'),
      password: req.param('password'),
      email: req.param('email'),
      phoneNumber: req.param('phoneNumber')


    }, 
    function (err, user) {

    console.log(user);
    console.log(err);

    var response = {
      success : true,
      key : user.id,
      userName : user.userName
    }
    
      //if error return error 
    if (err) return res.json(err);
      
     //set up response, and send down the key 

       return res.json(response);
    });
  },





  // (POST /user/uploadTraingPhoto)
  uploadTraingPhoto: function(req, res){

   var response = {
     success : true,
     error : null
   }

    var fs = require('fs');
    var AWS = require('aws-sdk'); 

   AWS.config.update({
     accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
     secretAccessKey: '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', 
   }); 
 
   var s3 = new AWS.S3();

  
    req.file('avatar').upload({

    }, function whenDone(err, uploadedFile){


      for(var i = 0; i < uploadedFile.length ; i++){
       
        var idUserNameSplit = uploadedFile[i].filename.split("/");
        var directorySplit = uploadedFile[i].fd.split("/");

        var userName = idUserNameSplit[0];
        var userId = idUserNameSplit[1];
        var fileName = directorySplit[directorySplit.length-1];
        
        var location = userName + '/trainingPhotos/' + fileName + '.jpg';
       
       
        fs.readFile(uploadedFile[i].fd, function(err,data){
          var params = {
           Bucket: 'momnts', 
           Key: location, 
           ACL: 'public-read-write',
           Body: new Buffer(data) 
          };

          s3.putObject(params, function(err, data) {
            if (err) console.log("err, err.stack"); // an error occurred
            else     console.log("NO ERROR IN E2");
          });
        });


        TrainingPhotos.savePhoto({
          fileLocation : location,
          owner : userId
        },
        function (err,TraingingPhoto){
          if(err) console.log(err);
        }); 
      }

    return res.json(response);
  }); 
},


  // (POST /user/uploadTraingPhoto)
  uploadPhoto: function(req, res){

   var response = {
     success : true,
     error : null
   }

    var fs = require('fs');
    var AWS = require('aws-sdk'); 

   AWS.config.update({
     accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
     secretAccessKey: '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', 
   }); 
 
   var s3 = new AWS.S3();

  
    req.file('avatar').upload({

    }, function whenDone(err, uploadedFile){

      var baseUrl = 'https://s3-us-west-1.amazonaws.com/momnts/';
      for(var i = 0; i < uploadedFile.length ; i++){
       
        console.log(uploadedFile[i]);

        var idUserNameSplit = uploadedFile[i].filename.split("/");
        var directorySplit = uploadedFile[i].fd.split("/");

        var userName = idUserNameSplit[0];
        var userId = idUserNameSplit[1];
        var lat = idUserNameSplit[2];
        var lng = idUserNameSplit[3];

        console.log(userName);
        console.log(userId);
        console.log(lat);
        console.log(lng);

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
            if (err) console.log("err, err.stack"); // an error occurred
            else     console.log("NO ERROR IN E2");
          });
        });


        Photos.savePhoto({
          fileLocation : baseUrl+location,
          owner : userId,
          lat : lat,
          lng : lng
        },
        function (err,Photo){
          if(err) console.log(err);
          else console.log(Photo)
        }); 
      }

    return res.json(response);
  }); 
},



updateLocation : function(req, res){
  var lng = req.param('lng');
  var lat = req.param('lat');
  var userKey = req.param('key');

  console.log(userKey);

  User.findOne({id:userKey}).exec(function findOneCB(err,user){
    if(err) {
       res.json(err);
    }

    console.log(user);

    user.currentLat = lat;
    user.currentLng = lng;

    user.save(function(error) {
        if(error) {
            // do something with the error.
        } else {
          return res.json({
            success : true
          })
        }
    });

  });

},



getPhotos: function (req, res){
  var userId = req.param('key');
  //var index = req.param('index');

  var response = {
    success : true
  }

  var locationList = [];

  Photos.find({ where: { owner: userId } }).exec(function findOneCB(err,photos){
    if(err){
      response.success = false;
      response.error = err;
      return res.json(response);
    }

    for(var i = 0 ; i < photos.length ; i++){
      locationList.push(photos[i].fileLocation);

    }

    response.locationList = locationList;
    return res.json(response);
    
  });


},


//test call : http://www.localhost.com:1337/user/addFriend?userName=kaseanherrera&requested=naren
addFriend : function (req, res){

 // var Promise = require("bluebird");
  var response = {
    success : true
  }

  var userName = req.param('userName');
  var requested = req.param('requested');  //username of the person you are requesting 
  /* find the user, if exist, add add friend*/

  User.find( {userName : userName }).exec(function findUserCB(err,user){

  //console.log(user);

   if(err){
      response.success = false;
      response.error = err;
      return res.json(response);
    }

    User.find({userName : requested}).exec(function cd(err, user2){
         if(err){
          response.success = false;
          response.error = err;
          return res.json(response);
        }


          console.log(user);
          console.log(user2);

          user[0].friends.add(user2[0].id);
          user2[0].friends.add(user[0].id);




          user[0].save(function(err,res){
            console.log(err);
            console.log(res);
           /* if(err){
              response.success = false;
              return res.json(response);
            }*/
          });

          user2[0].save(function(err,res){
            /*if(err){
              response.success = false;
              return res.json(response);
            }*/
          }); 
    });

      

    });
  


   
  

  return response;
}

};

