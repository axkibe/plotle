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
			'ast.aFunc',
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

/*
| Node imports.
*/
var
	aFuncArg,
	aFunc,
	jools;

aFunc =
module.exports =
	require( '../jion/this' )( module );

aFuncArg = require( './a-func-arg' );

jools = require( '../jools/jools' );


/*
| Returns the function with a an argument appended.
*/
aFunc.prototype.append =
	function(
		arg
	)
{
	return (
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
| FIXME rename
*/
aFunc.prototype.Arg =
	function(
		name,
		comment
	)
{
	return (
		this.append(
			aFuncArg.create(
				'name',
					name,
				'comment',
					comment
			)
		)
	);
};


} )( );
