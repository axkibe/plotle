/*
| A call to delete
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
			'aDelete',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'expr' :
					{
						comment :
							'the expression to delete',
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
	aDelete;

aDelete =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports = aDelete;


} )( );
