/*
| Logging of web server activities.
*/


var
	config,
	log_compose,
	log_web;


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


log_web =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.web )
	{
		return;
	}

	console.log(
		log_compose.call( undefined, 'web', arguments )
	);
};


if( NODE )
{
	module.exports = log_web;
}


} )( );
