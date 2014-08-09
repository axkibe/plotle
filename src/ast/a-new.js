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
		name :
			'aNew',
		unit :
			'ast',
		node :
			true,
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'aCall'
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
