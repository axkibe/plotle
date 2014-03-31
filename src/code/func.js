/*
| A file to be generated
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
			'Func',
		unit :
			'Code',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'Block',
						defaultValue :
							'null'
					}
			},
		node :
			true,
		twig :
			{
				'FuncArg' :
					'Code.FuncArg'
			}
	};
}

/*
| Node imports.
*/
var
	FuncArg =
		require( './func-arg' ),
	Func =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' );


/*
| Returns the function with a an argument appended.
*/
Func.prototype.Append =
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
*/
Func.prototype.Arg =
	function(
		name,
		comment
	)
{
	return (
		this.Append(
			FuncArg.create(
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
module.exports =
	Func;


} )( );