/*
| Classical for loops for abstract syntax trees.
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
			'aFor',
		unit :
			'ast',
		attributes :
			{
				init :
					{
						comment :
							'the initialization',
						type :
							'Object'
					},
				condition :
					{
						comment :
							'the continue condition',
						type :
							'Object'
					},
				iterate :
					{
						comment :
							'the iteration expression',
						type :
							'Object'
					},
				block :
					{
						comment :
							'the for block',
						type :
							'ast.aBlock'
					}
			},
		node :
			true
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
