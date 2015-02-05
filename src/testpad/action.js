/*
| The user is panning the background.
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
		id :
			'testpad_action',
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
							'integer'
					},
				at :
					{
						comment :
							'action affects offset',
						type :
							'integer',
						defaultValue :
							undefined,
					},
				at2 :
					{
						comment :
							'action affects offset (span end)',
						type :
							'integer',
						defaultValue :
							undefined,
					},
				value :
					{
						comment :
							'action carries value',
						type :
							'String',
						defaultValue :
							undefined
					}
			}
	};
}


} )( );
