/*
| Logging of ajax communication.
*/


var
	config,
	log_compose,
	log_ajax;


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


log_ajax =
	function(
		// arguments
	)
{
	if( !config.log.all && !config.log.ajax )
	{
		return;
	}

	console.log(
		log_compose.call( undefined, 'ajax', arguments )
	);
};


if( NODE )
{
	module.exports = log_ajax;
}


} )( );
