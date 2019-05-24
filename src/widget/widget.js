/*
| Abstract parent of widgets.
*/
'use strict';


tim.define( module, ( def, widget_widget ) => {


def.abstract = true;


if( TIM )
{
	def.attributes =
	{
		// component hovered upon
		hover : { type : 'undefined' },

		// the users mark
		mark : { type : 'undefined' },

		// path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// trace of the widget
		trace : { type : '../trace/widget' },

		// the transform
		transform : { type : '../gleam/transform' },

		// if false the widget is hidden
		visible : { type : 'boolean', defaultValue : 'true' },
	};
}

/*
| Handles a potential dragStart event.
*/
def.proto.dragStart =
	function(
		p,      // point where dragging starts
		shift,  // true if shift key was held down
		ctrl    // true if ctrl(or meta) was held down
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,      // screen position of the wheel event
		dir,    // direction of the wheel
		shift,  // true if shift key was held down
		ctrl    // true if ctrl(or meta) was held down
	)
{
	// default to nothing
};


} );
