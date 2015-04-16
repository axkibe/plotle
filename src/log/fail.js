/*
| Logging on start of server.
*/


var
	config,
	log_compose,
	log_fail;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	config = require( '../../config' );

	log_compose = require( './compose' );
}


log_fail =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.fail )
	{
		return;
	}

	console.log(
		log_compose.call( undefined, 'fail', arguments )
	);
};


if( NODE )
{
	module.exports = log_fail;
}


} )( );
