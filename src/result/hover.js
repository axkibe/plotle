/*
| Result of a pointingHover call.
|
| Containts the path of the component being hovered over
| As well the shape the cursor should get.
*/
'use strict';


tim.define( module, ( def, result_hover ) => {


if( TIM )
{
	def.attributes =
	{
		// the cursor to display
		cursor : { type : 'string' },

		// the trace to the entity being hovered upon
		trace : { type : [ 'undefined', '< ../trace/hover-types' ] },
	};
}


/*
| Shortcuts.
*/
def.staticLazy.cursorCrosshair = ( ) => result_hover.create( 'cursor', 'crosshair' );

def.staticLazy.cursorDefault = ( ) => result_hover.create( 'cursor', 'default' );

def.staticLazy.cursorGrabbing = ( ) => result_hover.create( 'cursor', 'grabbing' );

def.staticLazy.cursorGrab = ( ) => result_hover.create( 'cursor', 'grab' );

def.staticLazy.cursorNSResize = ( ) => result_hover.create( 'cursor', 'ns-resize' );

def.staticLazy.cursorPointer = ( ) => result_hover.create( 'cursor', 'pointer' );

def.staticLazy.cursorText = ( ) => result_hover.create( 'cursor', 'text' );


} );
