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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'aCondition',
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
							'Object'
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
	aCondition;

aCondition =
	require( '../jion/this' )( module );

/*
| Creates a condition with the elsewise expression set.
|
| FUTURE create this single recreators with jion-gen.
|
| FIXME call setElsewise
*/
aCondition.prototype.Elsewise =
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


/*
| Node export.
*/
module.exports =
	aCondition;


} )( );
