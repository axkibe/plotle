/*
| A reference to any dynamic list of space references.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'ref_dynamic_userSpacesList',
		attributes :
		{
			username :
			{
				comment : 'the username for the list',
				json : true,
				type : 'string'
			},
			seq :
			{
				comment : 'sequence number the dynamic is at',
				json : true,
				type : 'integer'
			}
		}
	};
}


var
	ref_dynamic_userSpacesList,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	ref_dynamic_userSpacesList = jion.this( module, 'source' );
}


prototype = ref_dynamic_userSpacesList.prototype;


} )( );
