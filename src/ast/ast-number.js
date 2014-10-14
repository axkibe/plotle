/*
| A number literal.
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
			'ast.astNumber',
		node :
			true,
		attributes :
			{
				'number' :
					{
						comment :
							'the number',
						type :
							'Number'
					}
			}
	};
}


module.exports =
	require( '../jion/this' )( module );


} )( );
