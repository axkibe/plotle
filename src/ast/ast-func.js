/*
| A function.
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
			'ast.astFunc',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'ast.astBlock',
						defaultValue :
							null
					},
				capsule :
					{
						comment :
							'if true its the capsule, to be formatted a little different',
						type :
							'Boolean',
						defaultValue :
							undefined
					}
			},
		node :
			true,
		twig :
			[
//				FUTURE
//				'ast.FuncArg'
			]
	};
}


var
	astFuncArg,
	astFunc,
	jools;


astFunc =
module.exports =
	require( '../jion/this' )( module );

astFuncArg = require( './ast-func-arg' );

jools = require( '../jools/jools' );


/*
| Returns the function with a an argument appended.
*/
astFunc.prototype.append =
	function(
		arg
	)
{
	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			arg
		)
	);
};


/*
| Convenience shortcut.
| Returns the function with a an argument appended.
*/
astFunc.prototype.astArg =
	function(
		name,
		comment
	)
{
	return(
		this.append(
			astFuncArg.create(
				'name',
					name,
				'comment',
					comment
			)
		)
	);
};


} )( );
