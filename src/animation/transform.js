/*
| The current transform is being animated.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'animation_transform',
		attributes :
		{
			begin :
			{
				comment : 'begin time of animation',
				type : 'number'
			},
			beginTransform :
			{
				comment : 'transformation at begin of animation',
				type : 'gleam_transform'
			},
			end :
			{
				comment : 'end time of animation',
				type : 'number'
			},
			endTransform :
			{
				comment : 'transformation at end of animation',
				type : 'gleam_transform'
			}
		}
	};
}


var
	animation_transform,
	gleam_point,
	gleam_transform;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	animation_transform = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = animation_transform.prototype;


/*
| Helper for creating a transform animation.
*/
animation_transform.createNow =
	function(
		endTransform,
		time
	)
{
	var
		now;

	now = window.performance.now( );

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
prototype.getTransform =
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
	root.create(
		'spaceTransform', this.getTransform( time )
	);

	return time < this.end;
};


} )( );
