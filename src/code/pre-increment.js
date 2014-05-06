/*
| A pre incrementation
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
			'PreIncrement',
		unit :
			'Code',
		attributes :
			{
				expr :
					{
						comment :
							'the expression to pre increment',
						type :
							'Object'
					}
			},
		node :
			true
	};
}


var
	PreIncrement;

PreIncrement =
	require( '../joobj/this' )( module );


/*
| Node export.
*/
module.exports =
	PreIncrement;


} )( );
