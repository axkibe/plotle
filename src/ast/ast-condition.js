/*
| Conditional expressions in abstract syntax trees.
|
| In other words the questionmark semicolon operator.
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
			}
	};
}


var
	astCondition;

astCondition = require( '../jion/this' )( module );


/*
| Creates a condition with the elsewise expression set.
|
| FUTURE create this single recreators with jion-gen.
*/
astCondition.prototype.elsewise =
	function(
		expr
	)
{
	return this.create( 'elsewise', expr );
};


} )( );
