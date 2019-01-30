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
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl     // true if ctrl or meta key was held down
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	return undefined;
};


} );
