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
	astVarDec,
	astVList,
	jools,
	shorthand;

astVList = require( '../jion/this' )( module );

astVarDec = require( './ast-var-dec' );

jools = require( '../jools/jools' );

shorthand = require( './shorthand' );


/*
| Returns the vlist with a variable decleration appended.
*/
astVList.prototype.astVarDec =
	function(
		// name,   // variable name
		// assign  // variable assignment
	)
{
	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			shorthand.astVarDec.apply( shorthand, arguments )
		)
	);
};


} )( );
