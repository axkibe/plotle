/*
| Helps creating widgets.
*/
'use strict';


tim.define( module, ( def, widget_factory ) => {


def.abstract = true;

const gleam_transform = tim.require( '../gleam/transform' );
const layout_button = tim.require( '../layout/button' );
const layout_checkbox = tim.require( '../layout/checkbox' );
const layout_input = tim.require( '../layout/input' );
const layout_label = tim.require( '../layout/label' );
const layout_scrollbox = tim.require( '../layout/scrollbox' );
const widget_button = tim.require( './button' );
const widget_checkbox = tim.require( './checkbox' );
const widget_input = tim.require( './input' );
const widget_label = tim.require( './label' );
const widget_scrollbox = tim.require( './scrollbox' );


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

	return Object.freeze( map );
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,           // of type layout_*
		trace,            // trace of the widget
		transform,        // visual transformation
		devicePixelRatio  // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	const widget = widget_factory._layoutMap.get( layout.timtype );

	if( !widget ) throw new Error( );

	return widget.createFromLayout( layout, trace, transform, devicePixelRatio );
};


} );
