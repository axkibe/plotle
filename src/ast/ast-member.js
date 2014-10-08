/*
| ast [ ] operator.
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
			'ast.astMember',
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


var
	astDot,
	astMember;


astMember =
module.exports =
	require( '../jion/this' )( module );


astDot = require( './ast-dot' );


/*
| Creates a dot member access of a dot.
*/
astMember.prototype.astDot =
	function(
		member // member string
	)
{
	// checks if member is a string is done in 'astDot'
	return(
		astDot.create(
			'expr',
				this,
			'member',
				member
		)
	);
};


} )( );
