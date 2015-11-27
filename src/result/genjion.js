/*
| Result of a jion generation.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'result_genjion',
		attributes :
		{
			code :
			{
				comment : 'the generated code',
				type : 'string'
			},
			jionID :
			{
				comment : 'the id of the jion',
				type : 'string'
			},
			hasJSON :
			{
				comment : 'true if generated jion supports json',
				type : 'boolean'
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


require( 'jion' ).this( module );


} )( );
