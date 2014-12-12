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
			'ast_astNew',
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'ast_astCall'
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
