/*
| Code for switch statements.
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
			'aSwitch',
		unit :
			'Code',
		attributes :
			{
				statement :
					{
						comment :
							'the statement expression',
						type :
							'Object'
					},
				defaultCase :
					{
						comment :
							'the default block',
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
//				'aCase' : 'Code.aCase'
			}
	};
}


var
	aCase =
		require( './a-case' ),
	Jools =
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

	if( case_or_condition.reflect !== 'aCase' )
	{
		caseExpr =
			aCase.create(
				'twig:add',
					Jools.uid( ), // FIXME
					case_or_condition,
				'block',
					block
			);
	}

	return (
		this.create(
			'twig:add',
			Jools.uid( ), // FIXME
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
