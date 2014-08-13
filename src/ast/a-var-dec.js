/*
| Variable declarations in abstract syntax trees.
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
			'aVarDec',
		unit :
			'ast',
		attributes :
			{
				name :
					{
						comment :
							'variable name',
						type :
							'String'
					},
				assign :
					{
						comment :
							'Assignment of variable',
						type :
							'Object',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


module.exports = require( '../jion/this' )( module );


} )( );