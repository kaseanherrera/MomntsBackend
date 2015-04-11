/**
 * PhotosController
 *
 * @description :: Server-side logic for managing photos
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	savePhoto: function (req, res) {

	 var fileLocation = req.session.me;	

     Photos.savePhoto({
    	sender: req.session.me,
	    fileLocation : fileLocation,
	    usersInPicture : req.param('usersInPicture'),
        latitude : req.param('latitude'),
        longitude : req.param('longitude')
      
  
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.

      if (err) return res.json(err);
      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      
      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.json(picture);
    });
  }
};

