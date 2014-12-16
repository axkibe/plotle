/*
| Optional checks for abstact syntax tree.
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
			'ast_if',
		attributes :
			{
				condition :
					{
						comment :
							'the if condition',
						type :
							'Object'
					},
				then :
					{
						comment :
							'the then code',
						type :
							'Object'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'Object',
						defaultValue :
							null
					}
			}
	};
}


var
	ast_if;

ast_if =
module.exports =
	require( '../jion/this' )( module );


/*
| Creates an if with the elsewise block set.
*/
ast_if.prototype.$elsewise =
	function(
		block
	)
{
	return this.create( 'elsewise', block );
};


} )( );
