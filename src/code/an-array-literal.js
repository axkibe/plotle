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
			'anArrayLiteral',
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
	AnArrayLiteral =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Returns an array literal with an expression appended.
*/
AnArrayLiteral.prototype.Append =
	function(
		expr
	)
{
	return (
		this.create(
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
	AnArrayLiteral;


} )( );