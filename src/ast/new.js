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
			'ast_new',
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'ast_call'
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
