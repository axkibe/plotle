/*
| Optional checks for abstact syntax tree.
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
							'ast.astBlock'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'ast.astBlock',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


var
	astIf;

astIf =
module.exports =
	require( '../jion/this' )( module );


/*
| Creates an if with the elsewise block set.
*/
astIf.prototype.astElsewise =
	function(
		block
	)
{
	return(
		this.create(
			'elsewise',
				block
		)
	);
};


} )( );
