/*
| A group of user infos.
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
			'user_infoGroup',
		group :
			[ 'user_info' ]
	};
}


require( 'jion' ).this( module );


} )( );
