/*
| A widget.
*/


/*
| Export
*/
var
	widgets,
	widgets_widget;

widgets = widgets || { };


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor.
*/
var
	widget; // FUTURE

widget =
widgets.widget = // FUTURE
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
widget.concernsMark =
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
widget.concernsHover =
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
