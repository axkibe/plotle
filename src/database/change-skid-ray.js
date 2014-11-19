/*
| A ray of changeSkids.
|
| This is not to be inserted directly into the
| database where changeSkids are a collection.
|
| It is used to chache changeSkids in memory.
*/


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'database.changeSkidRay',
		ray :
			[ 'database.changeSkid' ],
		node :
			true
	};
}


require( '../jion/this' )( module );


}( ) );
