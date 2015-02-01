/*
| Ast object literal.
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
			'ast_objLiteral',
		twig :
			'->astStatement'
	};
}


var
	ast_objLiteral,
	tools;


ast_objLiteral = require( '../jion/this' )( module );


tools = require( './tools' );

/*
| Returns an object literal with a key-expr pair added.
*/
ast_objLiteral.prototype.add =
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
