/*
| A widget.
*/
'use strict';


tim.define( module, 'widget_widget', ( def, widget_widget ) => {


/*
| Returns the mark if an item with
| 'path' concerns about the mark.
*/
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	return mark && mark.containsPath( path ) ? mark : undefined;
};


/*
| Returns the hover path if an item with
| 'path' concerns about the hover.
*/
def.static.concernsHover =
	function(
		hover,
		path
	)
{
	return hover && path.subPathOf( hover ) ? hover : undefined;
};


} );

