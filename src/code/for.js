/*
| Code for classical for loops.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'For',
		unit :
			'Code',
		attributes :
			{
				init :
					{
						comment :
							'the initialization',
						type :
							// FUTURE String or Array of Strings
							'Object'
					},
				condition :
					{
						comment :
							'the continue conditoin',
						type :
							'Term'
					},
				iterate :
					{
						comment :
							'the iteration term',
						type :
							'Term'
					},
				block :
					{
						comment :
							'the for block',
						type :
							'Block'
					}
			},
		node :
			true
	};
}


module.exports =
	require( '../joobj/this' )( module );


} )( );
