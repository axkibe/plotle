/*
| Superclass of all marks
|
| (User)Marks can be:
|     the caret
|     a text selection
|     one or several items
|     nothing (vacant)
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'Mark',

		unit :
			'Mark',

		abstract :
			true,

		equals :
			false,

		notag :
			true
	};
}


} )( );
