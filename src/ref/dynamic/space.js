/*
| A reference to a dynamic space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'ref_dynamic_space',
		attributes :
		{
			ref :
			{
				comment : 'the reference to the entity',
				json : true,
				type : 'ref_space'
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
	ref_dynamic_space,
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

	ref_dynamic_space = jion.this( module, 'source' );
}


prototype = ref_dynamic_space.prototype;


} )( );
