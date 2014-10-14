/*
| Ast plus assignment ( += )
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
			'ast.astPlusAssign',
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
	astPlusAssign,
	tools;


astPlusAssign =
module.exports =
	require( '../jion/this' )( module );

tools = require( './tools' );


/*
| Initializer.
*/
astPlusAssign.prototype._init =
	function( )
{
	// automatic argument convertion for comfort.

	this.left = tools.convertArg( this.left );

	this.right = tools.convertArg( this.right );
};


astPlusAssign.prototype.astIsExpression = true;


} )( );
