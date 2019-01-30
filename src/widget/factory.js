/*
| Helps creating widgets.
*/
'use strict';


tim.define( module, ( def, widget_factory ) => {


def.abstract = true;


const layout_button = require( '../layout/button' );

const layout_checkbox = require( '../layout/checkbox' );

const layout_input = require( '../layout/input' );

const layout_label = require( '../layout/label' );

const layout_scrollbox = require( '../layout/scrollbox' );

const widget_button = require( './button' );

const widget_checkbox = require( './checkbox' );

const widget_input = require( './input' );

const widget_label = require( './label' );

const widget_scrollbox = require( './scrollbox' );



/*
| Mapping of widget layouts to widget objects.
*/
def.staticLazy._layoutMap =
	function( )
{
	const map = new Map( );

	map.set( layout_button, widget_button );
	map.set( layout_checkbox, widget_checkbox );
	map.set( layout_input, widget_input );
	map.set( layout_label, widget_label );
	map.set( layout_scrollbox, widget_scrollbox );

	if( FREEZE ) Object.freeze( map );

	return map;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_label
		path,       // path of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	const widget = widget_factory._layoutMap.get( layout.timtype );

	if( !widget ) throw new Error( );

	return widget.createFromLayout( layout, path, transform );
};


} );
