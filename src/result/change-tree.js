/*
| Combined result of a changeTree call from a change or changeRay.
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
			'result_changeTree',
		attributes :
			{
				reaction :
					{
						comment :
							'changes may alter themselves on changing a tree',
						type :
							[
								'ccot_change',
								'ccot_changeRay',
								'ccot_changeWrap',
								'ccot_changeWrapRay'
							]
					},
				tree :
					{
						comment :
							'the changed path',
						type :
							'Object'
					}
			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
