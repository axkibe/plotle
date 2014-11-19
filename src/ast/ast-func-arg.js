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
			'ast.astFuncArg',
		attributes :
			{
				name :
					{
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


require( '../jion/this' )( module );


} )( );
