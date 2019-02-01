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


const visual_space = require( '../visual/space' );


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
	// this action only makes sense on spaces
	if( screen.timtype !== visual_space ) return;

	const item = screen.get( this.scrollPath.get( -1 ) );

	const dy = ( p.y - this.startPoint.y ) / screen.transform.zoom;

	const sbary = item.scrollbarY;

	let spos = this.startPos + sbary.scale( dy );

	if( spos < 0 ) spos = 0;

	root.setPath(
		item.path.append( 'scrollPos' ),
		item.scrollPos.create( 'y', spos )
	);
};


} );
