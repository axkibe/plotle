/*
| Code for conditional expressions.
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
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Condition',
		unit :
			'Code',
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
							'Object',
						defaultValue :
							'null'
					}
			},
		node :
			true
	};
}


/*
| Node includes.
*/
var
	Condition;

Condition =
	require( '../joobj/this' )( module );

/*
| Creates a condition with the elsewise expression set.
|
| FUTURE create this single recreators with joobj-gen.
*/
Condition.prototype.Elsewise =
	function(
		expr
	)
{
	return (
		this.Create(
			'elsewise',
				expr
		)
	);
};


/*
| Node export.
*/
module.exports =
	Condition;


} )( );
