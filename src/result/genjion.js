/*
| Result of a jion generation.
*/


/*
| Capsule
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
			'result_genjion',
		attributes :
			{
				code :
					{
						comment :
							'the generated code',
						type :
							'string'
					},
				jionID :
					{
						comment :
							'the id of the jion',
						type :
							'string'
					},
				hasJSON :
					{
						comment :
							'true if generated jion supports json',
						type :
							'boolean'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
