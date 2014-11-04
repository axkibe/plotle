/*
| A comment in an abstract syntax tree.
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
			'ast.astComment',
		attributes :
			{
				content :
					{
						comment :
							'comment content',
						type :
							'Array'
					},
			},
		node :
			true
	};
}


require( '../jion/this' )( module );


} )( );
