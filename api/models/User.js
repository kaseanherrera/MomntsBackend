/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    userName: {
    	type: 'string',
    	unique: true,
    	required: true,
    	size: 30,
    //	columnName: 'username'
    },


    password: {
      type: 'string',
      required: true,
      size: 50,
  //    columnName: 'password'
    },


    email: {
      type: 'email',
      required: true,
      unique:true,
      size: 50,
   //   columnName: 'email'
    },


    phoneNumber:
    {
    	type: 'string',
    	unique: true,
        defaultsTo: '000-000-0000'
  //  	columnName: 'phone_number'

    },


    friends: {
      collection: 'User',
      via: 'id'
    },

    photos: {
      collection: 'Photos',
      via : 'users'

    },

    trainingPhoto : {
        model : 'TrainingPhotos'
    }
},

signup: function (inputs, cb) {
    // Create a user

    User.create({
      userName: inputs.name,
      password: inputs.password,
      email: inputs.email,
      phoneNumber: inputs.phoneNumber
     
      // TODO: But encrypt the password first
   
    })
    .exec(cb);
  },


  postPicture : function(inputs,cb){
    Photos.create({
        
    })
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

