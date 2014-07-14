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
| The jion definition.
*/
if( JION )
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
	require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports =
	PreIncrement;


} )( );
