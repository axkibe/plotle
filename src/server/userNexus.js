/*
| Holds an manages all users.
|
| FUTURE move database interaction into here.
*/


/*
| Capsule.
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'server_userNexus',
		group :
			[ 'server_user' ]
	};
}


var
	userNexus;

userNexus = require( '../jion/this' )( module );


} )( );
