/*
| A file to be generated
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
			'Function',
		unit :
			'Code',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'Block',
						defaultValue :
							'null'
					}
			},
		node :
			true,
		twig :
			{
				'FuncArg' :
					'Code.FuncArg'
			}
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
