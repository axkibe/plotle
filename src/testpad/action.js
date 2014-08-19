/*
| The user is panning the background.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Jion definition.
*/
if( JION )
{
	return {
		name :
			'action',
		unit :
			'testpad',
		attributes :
			{
				command :
					{
						comment :
							'action command',
						type :
							'String'
					},
				line :
					{
						comment :
							'action affects at line',
						type :
							'Integer'
					},
				at :
					{
						comment :
							'action affects offset',
						type :
							'Integer',
						defaultValue :
							'undefined',
					},
				at2 :
					{
						comment :
							'action affects offset (span end)',
						type :
							'Integer',
						defaultValue :
							'undefined',
					},
				value :
					{
						comment :
							'action carries value',
						type :
							'String',
						defaultValue :
							'undefined'
					}
			}
	};
}


} )( );
