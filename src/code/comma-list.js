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
| The joobj definition.
*/
if( JOOBJ )
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
		require( '../joobj/this' )( module ),
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
	CommaList;


} )( );
