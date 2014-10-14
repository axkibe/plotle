/*
| A boolean literal.
| ( true or false )
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
			'ast.astBoolean',
		node :
			true,
		attributes :
			{
				'boolean' :
					{
						comment :
							'the boolean',
						type :
							'Boolean'
					}
			}
	};
}


/*
| Node export.
*/
module.exports =
	require( '../jion/this' )( module );


} )( );
