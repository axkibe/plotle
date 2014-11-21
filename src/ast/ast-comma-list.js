/*
| A comma operator list
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
		twig :
			'->expression'
	};
}


var
	astAssign,
	astCommaList,
	jools,
	tools;


astCommaList = require( '../jion/this' )( module );

astAssign = require( './ast-assign' );

jools = require( '../jools/jools' );

tools = require( './tools' );


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
	left = tools.convert( left );

	right = tools.convert( right );

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
