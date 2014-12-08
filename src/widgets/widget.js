/*
| A widget.
*/


/*
| Export
*/
var
	widgets_widget;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
widgets_widget =
	function( )
{
	// initializing abstract
	throw new Error( );
};


/*
| Returns the mark if an item with
| 'path' concerns about the mark.
*/
widgets_widget.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark )
	{
		return null;
	}

	return(
		mark.containsPath( path )
		? mark
		: null
	);
};


/*
| Returns the hover path if an item with
| 'path' concerns about the hover.
*/
widgets_widget.concernsHover =
	function(
		hover,
		path
	)
{
	if(
		!hover
		||
		!hover.equals( path )
	)
	{
		return null;
	}

	return hover;
};


} )( );
