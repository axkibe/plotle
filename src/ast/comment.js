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
			[ 'string' ]
	};
}


require( 'jion' ).this( module );


} )( );
