/**
* Photos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 attributes: {

    owner: {
      type : 'string',
      required: true,
      columnName: 'owner'
    },

  	fileLocation : {
  		type : 'string',
  		required : true,
  		columnName : 'fileLocation'
  	},
  	

    latitude: {
      type: 'decimal',
   //   required: true,
      columnName: 'latitude'
    },


    longitude: {
      type: 'decimal',
     // required: true,
      columnName: 'longitude'
    },

    users: {
      collection : 'User',
      via: 'photos'
    }

},

  //save picture into datanase
  savePhoto: function (input, cb){
  //call function generate file Location 
  
  var fileLocation = require('util').format('/user/photos/%s', input.owner);
   Photos.create({
      owner : input.owner,
      fileLocation : fileLocation,
     // latitude :  input.latitude,
    //  longitude: input.longitude,
    //  users : input.users
    })
    .exec(cb);

  }

  

};

