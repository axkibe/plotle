/*
| Switch statements in abstract syntax trees.
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
			'ast.astSwitch',
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
							'ast.astBlock',
						defaultValue :
							null
					}
			},
		node :
			true,
		twig :
			[
				'ast.astCase'
			]
	};
}


var
	astBlock,
	astCase,
	astSwitch,
	jools,
	tools;


astSwitch =
module.exports =
	require( '../jion/this' )( module );

astBlock = require( './ast-block' );

astCase = require( './ast-case' );

jools = require( '../jools/jools' ),

tools = require( './tools' ),

/*
| Shortcut for appending a case to this switch.
*/
astSwitch.prototype.astCase =
	function(
		coc,   // case_or_condition,
		code   // block or expression
	)
{
	var
		block,
		caseExpr;

	if( code.reflect === 'ast.astBlock' )
	{
		block = code;
	}
	else
	{
		block = astBlock.create( ).append( code );
	}

	if( coc.reflect !== 'ast.astCase' )
	{
		caseExpr =
			astCase.create(
				'twig:add',
					jools.uid( ), // FIXME
					tools.convert( coc ),
				'block',
					block
			);
	}

	return(
		this.create(
			'twig:add',
			jools.uid( ), // FIXME
			caseExpr
		)
	);
};


/*
| Shortcut for setting the default case.
*/
astSwitch.prototype.astDefault =
	function(
		code
	)
{
	var
		block;

	if( code.reflect === 'ast.astBlock' )
	{
		block = code;
	}
	else if( code.astIsExpression )
	{
		block = astBlock.create( ).append( code );
	}
	else
	{
		throw new Error( );
	}

	return(
		this.create(
			'defaultCase',
			block
		)
	);
};


} )( );
