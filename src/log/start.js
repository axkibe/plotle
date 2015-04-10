/*
| Logging on start of server.
*/


var
	config,
	log_compose,
	log_start;


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


log_start =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.start )
	{
		return;
	}

	console.log(
		log_compose.call( undefined, 'start', arguments )
	);
};


if( NODE )
{
	module.exports = log_start;
}


} )( );
