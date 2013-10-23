/*
| Superclass of all marks
|
| (User)Marks can be:
|     the caret
|     a text selection
|     one or several items
|     nothing
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var
	Mark =
		null;


/*
| Imports
*/
var
	Jools;


/*
| Capsule
*/
( function( ) {

'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
Mark =
	function( )
{
	Jools.immute( this );
};


} )( );
