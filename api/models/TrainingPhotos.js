/**
* TrainingPhotos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

   attributes: {

  		owner: {
  			model: 'user',
  			required : true,
  		},

  		fileLocation : {
  			type : 'string',
  			required : true
  		}
  },

  addPhoto: function (inputs, cb) {
    // Create a user
    TrainingPhotos.create({
      owner: inputs.owner,
      fileLocation: inputs.fileLocation,
     
   
    })
    .exec(cb);
  }
};

