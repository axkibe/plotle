/*
| Switch statements in abstract syntax trees.
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
			'ast_astSwitch',
		attributes :
			{
				statement :
					{
						comment :
							'the statement expression',
						type :
							'Object' // FUTURE ast.*
					},
				defaultCase :
					{
						comment :
							'the default block',
						type :
							'ast_astBlock',
						defaultValue :
							null
					}
			},
		ray :
			[
				'ast_astCase'
			]
	};
}


var
	ast_block,
	ast_case,
	ast_switch,
	jools,
	tools;


ast_switch = require( '../jion/this' )( module );

ast_block = require( './ast-block' );

ast_case = require( './ast-case' );

jools = require( '../jools/jools' ),

tools = require( './tools' ),


/*
| Shortcut for appending a case to this switch.
*/
ast_switch.prototype.astCase =
	function(
		coc,   // case_or_condition,
		code   // block or expression
	)
{
	var
		block,
		caseExpr;

	if( code.reflect_ === 'ast_astBlock' )
	{
		block = code;
	}
	else
	{
		block = ast_block.create( ).append( tools.convert( code ) );
	}

	if( coc.reflect_ !== 'ast_astCase' )
	{
		caseExpr =
			ast_case.create(
				'ray:append', tools.convert( coc ),
				'block', block
			);
	}

	return this.append( caseExpr );
};


/*
| Shortcut for setting the default case.
*/
ast_switch.prototype.astDefault =
	function(
		code
	)
{
	var
		block;

	if( code.reflect_ === 'ast_astBlock' )
	{
		block = code;
	}
	else
	{
		block = ast_block.create( ).append( tools.convert( code ) );
	}

	return this.create( 'defaultCase', block );
};


} )( );
