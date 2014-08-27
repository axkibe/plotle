/*
| An object literal.
|
| FIXME simply call anObject
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
			'anObjLiteral',
		unit :
			'ast',
		node :
			true,
		twig :
			'->statement'
	};
}

/*
| Node imports.
*/
var
	anObjLiteral;


anObjLiteral =
		require( '../jion/this' )( module );


/*
| Returns an object literal with a key-expr pair added.
|
| FIXME rename
*/
anObjLiteral.prototype.Add =
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
module.exports = anObjLiteral;


} )( );
