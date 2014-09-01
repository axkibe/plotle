/*
| A comma operator list
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
			'ast.aCommaList',
		node :
			true,
		twig :
			'->expression'
	};
}


/*
| Node imports.
*/
var
	aCommaList =
		require( '../jion/this' )( module ),
	jools =
		require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
aCommaList.prototype.append =
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
module.exports = aCommaList;


} )( );
