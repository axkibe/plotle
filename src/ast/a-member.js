/*
| Gets a member of an object.
|
| In other words the [ ] operator.
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
			'ast.aMember',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to get the member of',
						type :
							'Object'
					},
				member :
					{
						comment :
							'the members expression',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


/*
| Import
*/
var
	aDot,
	aMember;

aMember =
module.exports =
	require( '../jion/this' )( module );

aDot = require( './a-dot' );


/*
| Creates a dot member access of a dot.
*/
aMember.prototype.aDot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'aDot'
	return (
		aDot.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


} )( );
