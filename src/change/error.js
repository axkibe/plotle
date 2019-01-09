/*
| An error in the change engine.
|
| This is different from an "Error" in the sense
| for the server it is not fatal to receive
| a change from a client that doesn't make sense.
*/
'use strict';


tim.define( module, ( def ) => {


def.static.make =
	function(
		message
	)
{
	const err = new Error( message );

	err.nonFatal = true;

	return err;
};


} );
