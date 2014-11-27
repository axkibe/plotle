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
			'result.changeTree',
		attributes :
			{
				reaction :
					{
						comment :
							'changes may alter themselves on changing a tree',
						type :
							[
								'ccot.change',
								'ccot.changeRay',
								'ccot.changeWrap',
								'ccot.changeWrapRay'
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
