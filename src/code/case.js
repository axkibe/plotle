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
| The jion definition.
*/
if( JION )
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
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	Case;


} )( );
