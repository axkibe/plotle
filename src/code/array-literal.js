/*
| An array literal.
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
			'ArrayLiteral',
		unit :
			'Code',
		node :
			true,
		equals :
			'primitive', // FUTURE
		twig :
			'expression'
	};
}

/*
| Node imports.
*/
var
	ArrayLiteral =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Returns an array literal with an expression appended.
*/
ArrayLiteral.prototype.Append =
	function(
		expr
	)
{
	return (
		this.Create(
			'twig:add',
			Jools.uid( ), // FIXME
			expr
		)
	);
};


/*
| Node export.
*/
module.exports =
	ArrayLiteral;


} )( );
