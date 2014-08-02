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
		name :
			'CommaList',
		unit :
			'Code',
		node :
			true,
		twig :
			'expression'
	};
}


/*
| Node imports.
*/
var
	CommaList =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );

/*
| Returns the block with a statement appended;
*/
CommaList.prototype.Append =
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
	CommaList;


} )( );
