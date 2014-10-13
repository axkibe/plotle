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
		id :
			'ast.astTypeof',
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
							// FUTURE ->expression
					},
			}
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
