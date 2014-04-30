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
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Switch',
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
							'Block',
						defaultValue :
							'null'
					}
			},
		node :
			true,
		twig :
			{
				'Case' :
					'Code.Case'
			}
	};
}


var
	Case =
		require( './case' ),
	Jools =
		require( '../jools/jools' ),
	Switch =
		require( '../joobj/this' )( module );


/*
| Shortcut for appending a case to this switch.
*/
Switch.prototype.Case =
	function(
		case_or_condition,
		block
	)
{
	var
		caseExpr;

	if( case_or_condition.reflect !== 'Case' )
	{
		caseExpr =
			Case.Create(
				'twig:add',
					Jools.uid( ), // FIXME
					case_or_condition,
				'block',
					block
			);
	}

	return (
		this.Create(
			'twig:add',
			Jools.uid( ), // FIXME
			caseExpr
		)
	);
};


/*
| Shortcut for setting the default case.
*/
Switch.prototype.Default =
	function(
		block
	)
{
	return (
		this.Create(
			'defaultCase',
			block
		)
	);
};


/*
| Node export.
*/
module.exports =
	Switch;


} )( );
