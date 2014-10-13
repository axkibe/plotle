/*
| A var dec list.
|
| Only to be used in for loop initializers.
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
			'ast.astVList',
		node :
			true,
		twig :
			[
//				FUTURE
//				'ast.astVarDec'
			]
	};
}

/*
| Node imports.
*/
var
	ast,
	astVList,
	jools;

astVList =
module.exports =
	require( '../jion/this' )( module );

ast = // TODO remove ast
	{
		astAssign :
			require( './ast-assign' ),
		astVarDec :
			require( './ast-var-dec' ),
	};

jools = require( '../jools/jools' );


/*
| Returns the vlist with a variable decleration appended.
*/
astVList.prototype.astVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec;

	varDec =
		ast.astVarDec.create(
			'name',
				name,
			'assign',
				assign || null
		);

	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			varDec
		)
	);
};


} )( );
