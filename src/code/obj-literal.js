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
| The joobj definition.
*/
if( JOOBJ )
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
		require( '../joobj/this' )( module );


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
		this.Create(
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
