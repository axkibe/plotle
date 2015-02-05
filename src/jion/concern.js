/*
| An attribute description of a jion object.
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'jion_concern',
		attributes :
			{
				id :
					{
						comment :
							'concerns id',
						type :
							'jion_id',
						defaultValue :
							'undefined'
					},
				func :
					{
						comment :
							'concerns function to call',
						type :
							'string',
						defaultValue :
							'undefined'
					},
				args :
					{
						comment :
							'concerns arguments',
						type :
							'jion_stringRay',
						defaultValue :
							'undefined'
					},
				member :
					{
						comment :
							'concerns member call',
						type :
							'string',
						defaultValue :
							'undefined'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
