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
		name :
			'aFunc',
		unit :
			'Code',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'aBlock',
						defaultValue :
							null
					}
			},
		node :
			true,
		twig :
			{
// FUTURE
//				'FuncArg' :
//					'Code.FuncArg'
			}
	};
}

/*
| Node imports.
*/
var
	aFuncArg =
		require( './a-func-arg' ),
	aFunc =
		require( '../jion/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Returns the function with a an argument appended.
| FIXME rename
*/
aFunc.prototype.Append =
	function(
		arg
	)
{
	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
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
		this.Append(
			aFuncArg.create(
				'name',
					name,
				'comment',
					comment
			)
		)
	);
};

/*
| Node export.
*/
module.exports = aFunc;


} )( );
