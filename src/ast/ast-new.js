/*
| ast new calls
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
			'ast.astNew',
		node :
			true,
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'ast.astCall'
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
