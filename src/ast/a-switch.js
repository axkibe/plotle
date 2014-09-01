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
			'ast.aSwitch',
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
							'ast.aBlock',
						defaultValue :
							null
					}
			},
		node :
			true,
		twig :
			[
				'ast.aCase'
			]
	};
}


var
	aCase =
		require( './a-case' ),
	jools =
		require( '../jools/jools' ),
	aSwitch =
		require( '../jion/this' )( module );


/*
| Shortcut for appending a case to this switch.
*/
aSwitch.prototype.aCase =
	function(
		case_or_condition,
		block
	)
{
	var
		caseExpr;

	if( case_or_condition.reflect !== 'ast.aCase' )
	{
		caseExpr =
			aCase.create(
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
aSwitch.prototype.Default =
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


/*
| Node export.
*/
module.exports =
	aSwitch;


} )( );
