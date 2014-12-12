/*
| A function.
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
			'ast_astFunc',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'ast_astBlock',
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
		ray :
			[
//				FUTURE
//				'ast.FuncArg'
			]
	};
}


var
	astFuncArg,
	astFunc;


astFunc = require( '../jion/this' )( module );

astFuncArg = require( './ast-func-arg' );

/*
| Convenience shortcut.
| Returns the function with an argument appended.
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
				'name', name,
				'comment', comment
			)
		)
	);
};


} )( );
