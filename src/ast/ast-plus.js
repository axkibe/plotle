/*
| A mathematical addition
| or a string concation.
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
			'ast.astPlus',
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
	astPlus,
	tools;

astPlus =
module.exports =
	require( '../jion/this' )( module );

tools = require( './tools' );


/*
| Initializer.
*/
astPlus.prototype._init =
	function( )
{
	// automatic argument convertion for comfort.

	this.left = tools.convertArg( this.left );

	this.right = tools.convertArg( this.right );
};


astPlus.prototype.astIsExpression = true;


} )( );
