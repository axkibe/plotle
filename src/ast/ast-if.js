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
			'ast.astIf',
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
			},
		node :
			true
	};
}


var
	astBlock,
	astIf;

astIf =
module.exports =
	require( '../jion/this' )( module );

astBlock = require( './ast-block' );


/*
| Creates an if with the elsewise block set.
*/
astIf.prototype.astElsewise =
	function(
		block
	)
{
	return this.create( 'elsewise', block );
};


} )( );
