/*
| The user is scrolling a note.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// trace the item or widget being scrolled
		scrollTrace : { type : [ '../trace/item', '../trace/widget' ] },

		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// position of the scrollbar on start of scrolling
		startPos : { type : 'number' },
	};
}


const action_none = tim.require( './none' );

const result_hover = tim.require( '../result/hover' );


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	return this.scrollTrace.equals( item.trace );
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


/*
| Moves during scrolling.
*/
def.proto.dragMove =
	function(
		p,      // point, viewbased point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	// item or widget
	const iow = this.scrollTrace.pick( root );

	const dy =
		( p.y - this.startPoint.y )
		/ (
			screen.transform
			? screen.transform.zoom
			: 1
		);

	const sbary = iow.scrollbarY;

	let spos = this.startPos + sbary.scale( dy );

	if( spos < 0 ) spos = 0;

	root.alter(
		iow.trace.appendScrollPos,
		iow.scrollPos.create( 'y', spos )
	);
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	console.log( new Error( ) );
};


/*
| Stops a drag.
*/
def.proto.dragStop =
	function(
		p,      // point of stop
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
	root.alter( 'action', action_none.singleton );
};



/*
| Mouse hover.
|
| Returns a result_hover with hovering path and cursor to show.
*/
def.proto.pointingHover =
	function(
		p,     // cursor point
		screen, // the screen for this operation
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	return result_hover.cursorNSResize;
};

} );
