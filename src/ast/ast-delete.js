/*
| A call to delete.
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
			'ast.astDelete',
		attributes :
			{
				'expr' :
					{
						comment :
							'the expression to delete',
						type :
							'Object'
					},
			}
	};
}


require( '../jion/this' )( module );


} )( );
