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
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'anIf',
		unit :
			'Code',
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
							'aBlock'
					},
				elsewise :
					{
						comment :
							'the else wise',
						type :
							'aBlock',
						defaultValue :
							null
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
	anIf;

anIf =
	require( '../jion/this' )( module );

/*
| Creates an if with the Elsewise block set.
|
| FIXME rename
*/
anIf.prototype.Elsewise =
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
module.exports = anIf;


} )( );