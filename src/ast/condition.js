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
			'ast_condition',
		attributes :
			{
				condition :
					{
						comment :
							'the condition',
						type :
							'->astExpression'
					},
				then :
					{
						comment :
							'the then expression',
						type :
							'->astExpression'
					},
				elsewise :
					{
						comment :
							'the else condition',
						type :
							'->astExpression'
					}
			}
	};
}


var
	ast_condition;

ast_condition = require( '../jion/this' )( module );


/*
| Creates a condition with the elsewise expression set.
|
| FIXME create this single recreators with jion-gen.
*/
ast_condition.prototype.elsewise =
	function(
		expr
	)
{
	return this.create( 'elsewise', expr );
};


} )( );
