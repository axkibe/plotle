/*
| The user is scrolling a note.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// path to the item or widget being scrolled
		scrollPath : { type : 'tim.js/src/path' },

		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// position of the scrollbar on start of scrolling
		startPos : { type : 'number' },
	};
}


/*
| Returns true if an entity with path is affected by this action.
*/
def.proto.affectsItem =
	function(
		item
	)
{
	return this.scrollPath.equals( item.path );
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
	const iow = root.getPath( this.scrollPath );

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

	root.setPath(
		iow.path.append( 'scrollPos' ),
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

	console.log( 'scrolly.dragStart shouldn\'t happen' );
};


} );
