/*
| Extended user info.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'user_info',
		attributes :
		{
			name :
			{
				comment : 'the username',
				type : 'string',
			},
			passhash :
			{
				comment : 'password hash',
				type : 'string'
			},
			mail :
			{
				comment : 'the users email',
				type : 'string',
				defaultValue : '""'
			},
			news :
			{
				comment : 'if the user checked okay with news emails',
				type : [ 'boolean', 'string' ],
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
"use strict";


require( 'jion' ).this( module );


}( ) );
