/*
| Ast object literal.
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
			'ast.astObjLiteral',
		node :
			true,
		twig :
			'->statement'
	};
}


var
	astObjLiteral,
	tools;


astObjLiteral =
module.exports =
	require( '../jion/this' )( module );


tools = require( './tools' );

/*
| Returns an object literal with a key-expr pair added.
*/
astObjLiteral.prototype.add =
	function(
		key,
		expr
	)
{
	return(
		this.create(
			'twig:add',
			key,
			tools.convert( expr )
		)
	);
};


} )( );
