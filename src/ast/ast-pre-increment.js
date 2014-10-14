/*
| Pre increments for abstract syntax trees.
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
			'ast.astPreIncrement',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to pre increment',
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
	astPreIncrement,
	tools;

astPreIncrement =
module.exports =
	require( '../jion/this' )( module );

tools = require( './tools' );


/*
| Initializer.
*/
astPreIncrement.prototype._init =
	function( )
{
	// automatic argument convertion for comfort.

	this.expr = tools.convertArg( this.expr );
};


astPreIncrement.prototype.astIsExpression = true;



} )( );
