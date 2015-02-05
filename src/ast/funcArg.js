/*
| A function argument to be generated
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
			'ast_funcArg',
		attributes :
			{
				name :
					{
						comment :
							'argument name',
						type :
							'string',
						allowsNull :
							true
					},
				comment :
					{
						comment :
							'argument comment',
						type :
							'string',
						defaultValue :
							'null'
					}
			}
	};
}


require( '../jion/this' )( module );


} )( );
