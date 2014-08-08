/*
| A Typeof of an expression
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
			'aTypeof',
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
	aTypeof =
		require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports = aTypeof;


} )( );
