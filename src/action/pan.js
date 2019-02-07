/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './action';


if( TIM )
{
	def.attributes =
	{
		// mouse down point on start of scrolling
		startPoint : { type : '../gleam/point' },

		// offset
		offset : { type : '../gleam/point' },
	};
}


const action_none = require( './none' );

const visual_space = require( '../visual/space' );


/*
| Drag moves during panning.
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

	const pd = p.sub( this.startPoint );

	root.create(
		'spaceTransform', screen.transform.create( 'offset', this.offset.add( pd ) )
	);
};


/*
| Starts a drag.
*/
def.proto.dragStart =
	function(
		p,      // cursor point
		screen, // the screen for this operation
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
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
	root.create( 'action', action_none.create( ) );
};


} );
