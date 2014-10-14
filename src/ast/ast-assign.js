/*
| An assignment in an abstract syntax tree.
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
	return{
		id :
			'ast.astAssign',
		attributes :
			{
				left :
					{
						comment :
							'left-hand side',
						type :
							'Object'
					},
				right :
					{
						comment :
							'right-hand side',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


var
	astAssign,
	astVar,
	jools;


astAssign =
module.exports =
	require( '../jion/this' )( module );

astVar = require( './ast-var' );

jools = require( '../jools/jools' );


/*
| Initializer.
*/
astAssign.prototype._init =
	function( )
{
	// allows automatic variable generation for comfort.

	if( jools.isString( this.left ) )
	{
		this.left = astVar( this.left );
	}

	if( jools.isString( this.right ) )
	{
		this.right = astVar( this.right );
	}
};


astAssign.prototype.astIsExpression = true;


} )( );
