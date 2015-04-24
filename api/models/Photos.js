/**
* Photos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

 attributes: {

    owner: {
      type : 'integer',
      required: true,
      model : 'User',
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

  
  savePhoto: function (input, cb){
  
   Photos.create({
      owner : input.owner,
      fileLocation : input.fileLocation,
      latitude :  input.lat,
      longitude: input.lng,
    //  users : input.users
    })
    .exec(cb);

  }

  

};

