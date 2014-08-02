/*
| An object literal.
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
			'ObjLiteral',
		unit :
			'Code',
		node :
			true,
		twig :
			'statement'
	};
}

/*
| Node imports.
*/
var
	ObjLiteral;


ObjLiteral =
		require( '../jion/this' )( module );


/*
| Returns an object literal with a key-expr pair added.
*/
ObjLiteral.prototype.Add =
	function(
		key,
		expr
	)
{
	return (
		this.create(
			'twig:add',
			key,
			expr
		)
	);
};


/*
| Node export.
*/
module.exports =
	ObjLiteral;


} )( );
