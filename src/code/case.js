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
			{
				'Term' :
					'Code.Term'
			}
	};
}


var
	Case =
		require( '../joobj/this' )( module );
//	Jools =
//		require( '../jools/jools' );

/*
| Node export.
*/
module.exports =
	Case;


} )( );
