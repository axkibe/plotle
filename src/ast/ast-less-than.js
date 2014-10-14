/*
| Tests if a < b.
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
			'ast.astLessThan',
		attributes :
			{
				left :
					{
						comment :
							'left expression',
						type :
							'Object'
					},
				right :
					{
						comment :
							'right expression',
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
	astLessThan,
	tools;


astLessThan =
module.exports =
	require( '../jion/this' )( module );

tools = require( './tools' );


/*
| Initializer.
*/
astLessThan.prototype._init =
	function( )
{
	// automatic argument convertion for comfort.

	this.left = tools.convertArg( this.left );

	this.right = tools.convertArg( this.right );
};


astLessThan.prototype.astIsExpression = true;


} )( );
