/*
| A file to be generated.
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
			'aComment',
		unit :
			'ast',
		attributes :
			{
				content :
					{
						comment :
							'comment content',
						type :
							'Array'
					},
			},
		node :
			true
	};
}


/*
| Export.
*/
module.exports = require( '../jion/this' )( module );


} )( );