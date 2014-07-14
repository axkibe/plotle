/*
| A call to new
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
			'New',
		unit :
			'Code',
		node :
			true,
		attributes :
			{
				'call' :
					{
						comment :
							'the constrcutor call',
						type :
							'Call'
					},
			}
	};
}

/*
| Node imports.
*/
var
	New =
		require( '../jion/this' )( module );

/*
| Node export.
*/
module.exports =
	New;


} )( );
