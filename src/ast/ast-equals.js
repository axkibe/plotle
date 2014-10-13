/*
| Tests for equality.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
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
			'ast.astEquals',
		attributes :
			{
				left :
					{
						comment :
							'left expression',
						type :
							'Object'
					},
				right :
					{
						comment :
							'right expression',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


/*
| Export.
*/
module.exports = require( '../jion/this' )( module );


} )( );