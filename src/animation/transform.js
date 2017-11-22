/*
| The current transform is being animated.
*/
'use strict';


// FIXME
var
	gleam_point,
	gleam_transform;


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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Gets the transformation for a frame at time.
*/
def.func.getTransform =
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
def.func.frame =
	function(
		time
	)
{
	root.create(
		'spaceTransform', this.getTransform( time )
	);

	let going = time < this.end;

	if( !going )
	{
		const action = root.action;

		if( action && action.finishAnimation )
		{
			going = action.finishAnimation( );
		}
	}

	return going;
};


} );
