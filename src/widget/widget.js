/*
| Abstract parent of widgets.
*/
'use strict';


tim.define( module, ( def, widget_widget ) => {


def.abstract = true;


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

	return undefined;
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
