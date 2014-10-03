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
			'ast.astCommaList',
		node :
			true,
		twig :
			'->expression'
	};
}


var
	astCommaList,
	jools;


astCommaList =
module.exports =
	require( '../jion/this' )( module );

jools =
	require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
astCommaList.prototype.append =
	function(
		expr
	)
{
	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			expr
		)
	);
};


} )( );
