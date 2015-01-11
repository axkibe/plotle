/*
| Combined result of a changeTree call from a change or changeRay.
|
| FIXME remove this all together.
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
								'change_insert',
								'change_join',
								'change_remove',
								'change_ray',
								'change_split',
								'change_wrap',
								'change_wrapRay',

								// TODO remove ccot
								'ccot_change',
								'ccot_changeRay',
								'ccot_changeWrap',
								'ccot_changeWrapRay',
								'database_changeSkid',
								'database_changeSkidRay'
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
