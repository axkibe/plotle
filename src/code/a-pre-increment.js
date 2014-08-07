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
			'aPreIncrement',
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
	aPreIncrement;

aPreIncrement =
	require( '../jion/this' )( module );


/*
| Node export.
*/
module.exports =
	aPreIncrement;


} )( );
