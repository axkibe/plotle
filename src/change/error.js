/*
| An error in the change engine.
|
| This is different from a "Error" in that
| for the server it ought not to be fatal to receive
| a change from a client that doesn't make sense.
*/

var
	change_error;


/*
| Capsule
*/
( function( ) {
"use strict";


change_error =
	function(
		message
	)
{
	var
		err;

	err = new Error( message );

	err.nonFatal = true;

	return err;
};


if( SERVER )
{
	module.exports = change_error;
}


}( ) );
