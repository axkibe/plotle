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
			'ast.aVList',
		node :
			true,
		twig :
			[
//				FUTURE
//				'ast.aVarDec'
			]
	};
}

/*
| Node imports.
*/
var
	aVList =
		require( '../jion/this' )( module ),
	ast =
		{
			anAssign :
				require( './an-assign' ),
			aVarDec :
				require( './a-var-dec' ),
		},
	jools =
		require( '../jools/jools' );


/*
| Returns the vlist with a variable decleration appended.
*/
aVList.prototype.aVarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	var
		varDec =
			ast.aVarDec.create(
				'name',
					name,
				'assign',
					assign || null
			);

	return (
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			varDec
		)
	);
};


/*
| Node export.
*/
module.exports = aVList;


} )( );
