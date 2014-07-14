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
		name :
			'Member',
		unit :
			'Code',
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
	Member;

Member =
	require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	Member;


} )( );
