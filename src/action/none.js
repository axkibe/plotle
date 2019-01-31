/*
| The none action.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


/*
| Drag moves during creating a generic item.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		space,  // the visual space for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	// normally shouldn't happen
};


} );
