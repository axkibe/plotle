/*
| Typeof of an expression
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
			'Typeof',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'expr' :
					{
						comment :
							'the expression to get the type of',
						type :
							'Object'
					},
			}
	};
}

/*
| Node imports.
*/
var
	Typeof =
		require( '../joobj/this' )( module );

/*
| Node export.
*/
module.exports =
	Typeof;


} )( );
