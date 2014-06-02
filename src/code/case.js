/*
| Code for case statements.
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
			'Case',
		unit :
			'Code',
		attributes :
			{
				block :
					{
						comment :
							'the statement',
						type :
							'Block'
					}
			},
		node :
			true,
		twig :
			'expression',
	};
}


var Case;

Case =
	require( '../joobj/this' )( module );

/*
| Node export.
*/
module.exports =
	Case;


} )( );
