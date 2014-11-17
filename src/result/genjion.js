/*
| Result of a jion generation.
|
| Authors: Axel Kittenberger
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
			'result.genjion',
		attributes :
			{
				code :
					{
						comment :
							'the generated code',
						type :
							'String'
					},
				jionID :
					{
						comment :
							'the id of the jion',
						type :
							'String'
					},
				hasJSON :
					{
						comment :
							'true if generated jion supports json',
						type :
							'Boolean'
					}
			},
		node :
			true
	};
}


require( '../jion/this' )( module );


} )( );
