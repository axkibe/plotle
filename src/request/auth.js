/*
| A client request authentication to be checked,
| or to be assigned a visitor-id.
*/


/*
| Exports
*/
var
	request;

request = request || { };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'request.auth',
		attributes :
			{
				passhash :
					{
						comment :
							'password hash of the user/visitor',
						json :
							true,
						type :
							'String'
					},
				user :
					{
						comment :
							'user/visitor to be authenticated',
						json :
							true,
						type :
							'String'
					}

			},
		node :
			true
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
