/*
| A call to new
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
			'ast.aNew',
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

/*
| Node imports.
*/
var
	aNew;

aNew =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports = aNew;


} )( );
