/*
| Conditional expressions in abstract syntax trees.
|
| In other words the questionmark semicolon operator.
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
			'ast.astCondition',
		attributes :
			{
				condition :
					{
						comment :
							'the condition',
						type :
							'Object'
					},
				then :
					{
						comment :
							'the then expression',
						type :
							'Object'
					},
				elsewise :
					{
						comment :
							'the else condition',
						type :
							'Object'
					}
			},
		node :
			true
	};
}

var
	astCondition;

astCondition =
module.exports =
	require( '../jion/this' )( module );


/*
| Creates a condition with the elsewise expression set.
|
| FUTURE create this single recreators with jion-gen.
|
| FIXME call setElsewise
*/
astCondition.prototype.Elsewise =
	function(
		expr
	)
{
	return (
		this.create(
			'elsewise',
				expr
		)
	);
};


} )( );
