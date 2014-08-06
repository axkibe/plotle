/*
| Code for for-in loops.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'ForIn',
		unit :
			'Code',
		attributes :
			{
				variable :
					{
						comment :
							'the loop variable',
						type :
							'String'
					},
				object :
					{
						comment :
							'the object expression to iterate over',
						type :
							'Object'
					},
				block :
					{
						comment :
							'the for block',
						type :
							'aBlock'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
