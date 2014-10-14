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
	astAssign,
	astCommaList,
	jools;


astCommaList =
module.exports =
	require( '../jion/this' )( module );

astAssign = require( './ast-assign' );

jools = require( '../jools/jools' );


/*
| Returns the list with an expression appended;
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


/*
| Returns the list with an assignment appended.
*/
astCommaList.prototype.astAssign =
	function(
		left,
		right
	)
{
	return(
		this.append(
			astAssign.create(
				'left', left,
				'right', right
			)
		)
	);
};


} )( );
