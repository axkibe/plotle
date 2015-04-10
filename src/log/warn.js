/*
| Logging on start of server.
*/


var
	config,
	log_compose,
	log_warn;


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


log_warn =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.warn )
	{
		return;
	}

	console.log(
		log_compose.call( undefined, 'warn', arguments )
	);
};


if( NODE )
{
	module.exports = log_warn;
}


} )( );
