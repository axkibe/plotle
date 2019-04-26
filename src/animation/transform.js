/*
| The current transform is being animated.
*/
'use strict';


tim.define( module, ( def, animation_transform ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_transform = tim.require( '../gleam/transform' );


if( TIM )
{
	def.attributes =
	{
		// begin time of animation
		begin : { type : 'number' },

		// transformation at begin of animation
		beginTransform : { type : '../gleam/transform' },

		// end time of animation
		end : { type : 'number' },

		// transformation at end of animation
		endTransform : { type : '../gleam/transform' },
	};
}


/*
| Helper for creating a transform animation.
*/
def.static.createNow =
	function(
		endTransform,
		time
	)
{
	const now = window.performance.now( );

	return(
		animation_transform.create(
			'begin', now,
			'beginTransform', root.spaceTransform,
			'end', now + time,
			'endTransform', endTransform
		)
	);
};


/*
| Gets the transformation for a frame at time.
*/
def.proto.getTransform =
	function(
		time
	)
{
	const end = this.end;

	const endTransform = this.endTransform;

	if( time >= end ) return endTransform;

	const begin = this.begin;

	const beginTransform = this.beginTransform;

	if( time <= begin ) return beginTransform;

	const ratio = ( time - begin ) / ( end - begin );

	const beginOffset = beginTransform.offset;

	const endOffset = endTransform.offset;

	const beginZoom = beginTransform.zoom;

	const endZoom = endTransform.zoom;

	return(
		gleam_transform.create(
			'offset',
				gleam_point.createXY(
					beginOffset.x + ratio * ( endOffset.x - beginOffset.x ),
					beginOffset.y + ratio * ( endOffset.y - beginOffset.y )
				),
			'zoom', beginZoom + ratio * ( endZoom - beginZoom )
		)
	);
};


/*
| Handles a frame for this animation.
*/
def.proto.frame =
	function(
		time
	)
{
	root.alter( 'spaceTransform', this.getTransform( time ) );

	let going = time < this.end;

	if( !going )
	{
		const action = root.action;

		if( action && action.finishAnimation )
		{
			going = action.finishAnimation( );
		}
	}

	if( !going )
	{
		root.finishAnimation( 'transform' );
	}
};


} );
