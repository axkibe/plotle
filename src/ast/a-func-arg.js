/*
| A function argument to be generated
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
		id :
			'ast.aFuncArg',
		attributes :
			{
				name :
					{
						// FIXME this is doubled
						comment :
							'argument name',
						type :
							'String',
						allowsNull :
							true
					},
				comment :
					{
						comment :
							'argument comment',
						type :
							'String',
						defaultValue :
							null
					}
			},
		node :
			true
	};
}


module.exports = require( '../jion/this' )( module );


} )( );
