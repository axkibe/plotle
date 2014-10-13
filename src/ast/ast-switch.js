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
	astCase,
	astSwitch,
	jools;


astSwitch =
module.exports =
	require( '../jion/this' )( module );

astCase = require( './ast-case' );

jools = require( '../jools/jools' ),


/*
| Shortcut for appending a case to this switch.
*/
astSwitch.prototype.astCase =
	function(
		case_or_condition,
		block
	)
{
	var
		caseExpr;

	if( case_or_condition.reflect !== 'ast.astCase' )
	{
		caseExpr =
			astCase.create(
				'twig:add',
					jools.uid( ), // FIXME
					case_or_condition,
				'block',
					block
			);
	}

	return (
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
astSwitch.prototype.Default =
	function(
		block
	)
{
	return (
		this.create(
			'defaultCase',
			block
		)
	);
};


} )( );
