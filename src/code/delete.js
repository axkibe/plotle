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
			'Delete',
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
	Delete =
		require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	Delete;


} )( );
