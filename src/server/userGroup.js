/*
| A group of users.
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
			'server_userGroup',
		group :
			[ 'server_user' ]
	};
}


require( '../jion/this' )( module );


} )( );
