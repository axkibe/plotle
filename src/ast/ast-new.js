/*
| ast new calls
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
			'ast.astNew',
		node :
			true,
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'ast.astCall'
					},
			}
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
