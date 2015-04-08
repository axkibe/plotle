/*
| A client's update set to sleep.
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
			'server_upSleepGroup',
		group :
			[ 'server_upSleep' ]
	};
}


require( 'jion' ).this( module );


} )( );
