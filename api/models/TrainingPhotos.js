/**
* TrainingPhotos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	owner: {
  		tyoe: 'string',
  		required: true,
  		columnName : 'owner',
  		model:'User'
  	},

  	fileLocation : {
  		type : 'string',
  		required : true,
  		columnName: 'fileLocation'
  	}

  },

  savePhoto: function(input, cb){
  	var fileLocation = require('util').format('user/trainingPhotos/%s', input.owner);
	
	TrainingPhotos.create({
		owner : input.owner,
		fileLocation : fileLocation
	}).exec(cb);
  }
};

