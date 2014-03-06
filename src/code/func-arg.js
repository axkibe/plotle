/*
| A function argument to be generated
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'FuncArg',
		unit :
			'Code',
		attributes :
			{
				name :
					{
						comment :
							'argument name',
						type :
							'String'
					},
				comment :
					{
						comment :
							'argument comment',
						type :
							'String'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
