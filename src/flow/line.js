/*
| A flow line of tokens.
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
			'flow_line',
		attributes :
			{
				offset :
					{
						comment :
							'offset in text',
						type :
							'integer'
					},
				y :
					{
						comment :
							'y position of line',
						type :
							'number'
					}
			},
		ray :
			[ 'flow_token' ]
	};
}


} )( );
