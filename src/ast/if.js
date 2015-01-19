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
	ast_block,
	ast_if;

ast_if = require( '../jion/this' )( module );

ast_block = require( './block' );


/*
| Creates an if with the elsewise block set.
*/
ast_if.prototype.$elsewise =
	function(
		elsewise
	)
{
	if( elsewise.reflect !== 'ast_block' )
	{
		elsewise = ast_block.create( ).append( elsewise );
	}

	return this.create( 'elsewise', elsewise );
};


} )( );
