/*
| A flow block consists of flow lines.
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
			'flow_block',
		attributes :
			{
				height :
					{
						comment :
							'height of the flow',
						type :
							'number'
					},
				width :
					{
						comment :
							'width of the flow',
						type :
							'number'
					}
			},
		ray :
			[ 'flow_line' ]
	};
}


} )( );
