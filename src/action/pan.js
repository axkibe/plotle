/*
| The user is panning the background.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


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


const action_none = tim.require( './none' );

const fabric_space = tim.require( '../fabric/space' );

const result_hover = tim.require( '../result/hover' );


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
	if( screen.timtype !== fabric_space ) return;

	const pd = p.sub( this.startPoint );

	root.alter(
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
	root.alter( 'action', action_none.singleton );
};


/*
| 'Normal' button ought to be down during this action.
*/
def.proto.normalButtonDown = true;


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

	return result_hover.cursorGrabbing;
};


} );
