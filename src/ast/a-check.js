/*
| Optional checks in abstract syntax trees.
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
			'aCheck',
		unit :
			'ast',
		attributes :
			{
				'block' :
					{
						comment :
							'the code block',
						type :
							'aBlock'
					}
			},
		node :
			true
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
