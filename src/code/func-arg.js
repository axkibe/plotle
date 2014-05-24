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
						// FIXME this is doubled
						comment :
							'argument name',
						type :
							'String',
						allowsNull :
							true
					},
				comment :
					{
						comment :
							'argument comment',
						type :
							'String',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
