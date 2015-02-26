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
			'ast_func',
		attributes :
			{
				block :
					{
						comment :
							'function code',
						type :
							'ast_block',
						defaultValue :
							'null'
					},
				capsule :
					{
						comment :
							'if true its the capsule, to be formatted a little different',
						type :
							'boolean',
						defaultValue :
							'undefined'
					}
			},
		ray :
			[ 'ast_funcArg' ]
	};
}


var
	ast_funcArg,
	ast_func;


ast_func = require( '../jion/this' )( module );

ast_funcArg = require( './funcArg' );

/*
| Convenience shortcut.
| Returns the function with an argument appended.
*/
ast_func.prototype.$arg =
	function(
		name,
		comment
	)
{
	return(
		this.append(
			ast_funcArg.create(
				'name', name,
				'comment', comment
			)
		)
	);
};


} )( );
