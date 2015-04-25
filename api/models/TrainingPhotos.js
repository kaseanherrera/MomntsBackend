/**
* TrainingPhotos.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  connection: 'AmazonSqlDatabase',

  attributes: {
  	owner: {
  		type: 'integer',
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
 
	   TrainingPhotos.create({
		      owner : input.owner,
		      fileLocation : input.fileLocation
	   }).exec(cb);
  }

};

