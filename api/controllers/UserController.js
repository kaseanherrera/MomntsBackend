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


  req.file('avatar').upload({
        maxBytes: 10000000
      //  adapter: require('skipper-s3'),
       // key: 'AKIAIJ7DGKVU2YVTGQKA',
      //  secret: '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',
      //  bucket: 'momnts/kaseanherrera/'
     // bucket: 'momnts/kaseanherr'
    },
    
      function whenDone(err, uploadedFile){
      
        fs.readFile(uploadedFile[0].fd, function (err, data) {
          if(err){
            console.log("roor");

          }else{
            var params = {
              Bucket: 'momnts', /* required */
              Key: 'kaseanherrera/' + "pic.png", /* required */
              ACL: 'public-read-write',
              Body: new Buffer(data) 

              };
              s3.putObject(params, function(err, data) {
              if (err) console.log("err, err.stack"); // an error occurred
              else     console.log("made it");           // successful response
          });
          }
        });
      });


      /*
      for(i = 0; i < uploadedFiles.length ; i++){
          console.log(uploadedFiles);

      }
    } */

      
        

/*
 

      var trainingFolderKey =  user + "/trainingPhotos/" ;

      var trainingParams = {
        Bucket: 'momnts', 
        Key: trainingFolderKey, 
        ACL: 'public-read-write',
      };

    }

 
  
      s3.putObject(trainingParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });


      req.file('avatar').upload({
        maxBytes: 10000000
      //adapter: require('skipper-s3'),
     /// key: 'AKIAIJ7DGKVU2YVTGQKA',
     // secret: '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',
      //bucket: 'momnts/' + user.userName + '/trainingPhotos/'
     // bucket: 'momnts/kaseanherr'
    }),
    
      function whenDone(err, uploadedFile){
        console.log("made it this fat");
        if (err) {
          response.error = 'error uploading file';
          return res.json(response);
        }

        
        //upload file to s3
        //save training photo information in database
        /*for(i = 0; i < uploadedFiles.length ; i++){

          TrainingPhotos.savePhoto({
          owner : req.param('key'),
          fileName : uploadedFiles[i].fd},

          function (err, TrainingPhotos){
          
            if(err){
              response.error = 'problem while saving file';
            }
          });
        } 
      }; 
    })
 // }); 
*/
 // response.success = true;
//  return res.json(response) ;
},


 





uploadPicture: function (req, res) {

  //check if user has a bucket 
  
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


getPhotoLocations: function (req, res){
  //i need the user name 
    
    var AWS = require('aws-sdk'); 

    AWS.config.update({
    accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
    secretAccessKey: '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', 
    }); 



    var s3 = new AWS.S3();
    var params = {
  
      Bucket: 'momnts'
    };

    s3.listObjects(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
       else     console.log(data);           // successful response
    });


  
    var params = {
   
      Key: '387fd75b-052c-419d-9125-dc528e2b6195.jpg',
   
      Bucket: 'momnts',
    
 
  
  
    };


  s3.getObject(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    console.log(data);          // successful response
    return res.json(data)

  }   
  }); 

    
 //   var SkipperDisk = require('skipper-disk');
   // var fileAdapter = SkipperDisk(/* optional opts */); 

/*    var fileName = 'd6f49acf-5a56-49a4-8795-4be0954027f7.jpg';
    // Stream the file down
    fileAdapter.read(fileName)
    .on('error', function (err){
      return res.serverError(err);
    })
    .pipe(res); */
  //});
}


};

