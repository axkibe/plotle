/*
| The current transform is being animated.
*/
'use strict';


tim.define( module, 'animation_transform', ( def, animation_transform ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		begin :
		{
			// begin time of animation
			type : 'number'
		},
		beginTransform :
		{
			// transformation at begin of animation
			type : 'gleam_transform'
		},
		end :
		{
			// end time of animation
			type : 'number'
		},
		endTransform :
		{
			// transformation at end of animation
			type : 'gleam_transform'
		}
	};
}


var
	animation_transform,
	gleam_point,
	gleam_transform;


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/



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


XXX FUNCTIONS


/*
| Gets the transformation for a frame at time.
*/
def.func.getTransform =
	function(
		time
	)
{
	var
		begin,
		beginOffset,
		beginZoom,
		beginTransform,
		end,
		endOffset,
		endZoom,
		endTransform,
		ratio;

	end = this.end;

	endTransform = this.endTransform;

	if( time >= end ) return endTransform;

	begin = this.begin;

	beginTransform = this.beginTransform;

	if( time <= begin ) return beginTransform;

	ratio = ( time - begin ) / ( end - begin );

	beginOffset = beginTransform.offset;

	endOffset = endTransform.offset;

	beginZoom = beginTransform.zoom;

	endZoom = endTransform.zoom;

	return(
		gleam_transform.create(
			'offset',
				gleam_point.xy(
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
prototype.frame =
	function(
		time
	)
{
	var
		action,
		going;

	root.create(
		'spaceTransform', this.getTransform( time )
	);

	going = time < this.end;

	if( !going )
	{
		action = root.action;

		if( action && action.finishAnimation )
		{
			going = action.finishAnimation( );
		}
	}

	return going;
};


} )( );
