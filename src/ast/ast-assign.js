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
			true,
		init :
			[ ]
	};
}


var
	astAssign,
	tools;


astAssign =
module.exports =
	require( '../jion/this' )( module );

tools = require( './tools' );


/*
| Initializer.
*/
astAssign.prototype._init =
	function( )
{
	// automatic argument convertion for comfort.

	this.left = tools.convertArg( this.left );

	this.right = tools.convertArg( this.right );
};


astAssign.prototype.astIsExpression = true;


} )( );
