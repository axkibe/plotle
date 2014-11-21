/*
| Array literals in abstract syntax trees.
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
			'ast.astArrayLiteral',
		equals :
			'primitive', // FUTURE
		twig :
			'->expression'
	};
}


var
	astArrayLiteral,
	jools;


astArrayLiteral = require( '../jion/this' )( module );

jools = require( '../jools/jools' );


/*
| Returns an array literal with an expression appended.
*/
astArrayLiteral.prototype.append =
	function(
		expr
	)
{
	return (
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			expr
		)
	);
};


} )( );
