/*
| A comment in an abstract syntax tree.
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
			'ast_comment',
		ray :
			[ 'String' ]
	};
}


require( '../jion/this' )( module );


} )( );
