/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 connection: 'AmazonSqlDatabase',

  attributes: {


    userName: {
    	type: 'string',
    	unique: true,
    	required: true,
    	size: 30,
    	columnName: 'username'
    },


    password: {
      type: 'string',
      required: true,
      size: 50,
      columnName: 'password'
    },


    email: {
      type: 'email',
      required: true,
      unique:true,
      size: 50,
      columnName: 'email'
    },


    phoneNumber:
    {
    	type: 'string',
    	unique: true,
      defaultsTo: '000-000-0000',
    	columnName: 'phone_number'

    },

    currentLat:
    {
      type: 'float',
      columnName: 'currentLat'
    },

    currentLng:
    {
      type: 'float',
      columnName: 'currentLng'
    },


    friends: {
      collection: 'User',
      via: 'id'
    },

    photos: {
      collection: 'Photos',
      via : 'owner'

    },

    trainingPhotos: {
            collection: 'TrainingPhotos',
            via: 'owner'
    }
    
  },


  signup: function (inputs, cb) {
    // Create a user
   
    var userName = inputs.name;

    User.create({
      userName: userName,
      password: inputs.password,
      email: inputs.email,
      phoneNumber: inputs.phoneNumber
   
    })
    .exec(cb);

    User.createFolders({
      owner : userName
    });
  },


  createFolders : function (input) {

    var AWS = require('aws-sdk'); 
    AWS.config.update({
      accessKeyId: 'AKIAIJ7DGKVU2YVTGQKA',
      secretAccessKey: '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', 


    }); 

    var s3 = new AWS.S3();

    var user = input.owner; 

    var trainingFolderKey =  user + "/trainingPhotos/" ;
    var photosFolderKey = user + "/photos/";

    var trainingParams = {
      Bucket: 'momnts', /* required */
      Key: trainingFolderKey, /* required */
      ACL: 'public-read-write',
      
    };

    var photoParams = {
      Bucket: 'momnts',
      Key : photosFolderKey,
      ACL : 'public-read-write',
    }
  
    s3.putObject(trainingParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    });

    s3.putObject(photoParams, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    });
  },




  attemptLogin: function (inputs, cb) {
    // Create a user
    User.findOne({
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }

};

