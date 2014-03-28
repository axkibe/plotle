/*
| Code for optional checks.
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
			'If',
		unit :
			'Code',
		attributes :
			{
				condition :
					{
						comment :
							'the if condition',
						type :
							// FUTURE String or Array of Strings
							'Object'
					},
				then :
					{
						comment :
							'the then code',
						type :
							'Block'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'Block',
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
	If =
		require( '../joobj/this' )( module );

/*
| Creates an if with the Elsewise block set.
*/
If.prototype.Elsewise =
	function(
		block
	)
{
	return (
		this.create(
			'elsewise',
				block
		)
	);
};


/*
| Node export.
*/
module.exports =
	If;


} )( );
