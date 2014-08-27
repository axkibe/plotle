/*
| An array literal in an abstract syntax tree.
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
		name :
			'anArrayLiteral',
		unit :
			'ast',
		node :
			true,
		equals :
			'primitive', // FUTURE
		twig :
			'->expression'
	};
}

/*
| Node imports.
*/
var
	AnArrayLiteral =
		require( '../jion/this' )( module ),
	jools =
		require( '../jools/jools' );


/*
| Returns an array literal with an expression appended.
*/
AnArrayLiteral.prototype.append =
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


/*
| Node export.
*/
module.exports = AnArrayLiteral;


} )( );
