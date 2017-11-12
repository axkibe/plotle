/*
| A scrollbar.
|
| Used by note and scrollbox.
|
| Currently there are only vertical scrollbars.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_scrollbar',
		attributes :
		{
			scrollpos :
			{
				comment : 'scroll position',
				type : 'number'
			},
			aperture :
			{
				comment : 'the size of the bar',
				type : 'number'
			},
			max :
			{
				comment : 'maximum scroll position',
				// minimum is always zero
				type : 'number'
			},
			path :
			{
				comment : 'path',
				type : [ 'undefined', 'jion$path' ]
			},
			pos :
			{
				comment : 'position',
				type : 'gleam_point'
			},
			size :
			{
				comment : 'size',
				type : 'number'
			},
			transform :
			{
				comment : 'transform',
				type : 'gleam_transform'
			}
		}
	};
}


var
	action_scrolly,
	gleam_roundRect,
	gleam_glint_paint,
	gruga_scrollbar,
	jion,
	result_hover,
	widget_scrollbar;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = widget_scrollbar.prototype;


/*
| The scrollbar's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_scrollbar.facet,
			'shape', this._tShape
		)
	);
}
);


/*
| Returns the transformed shape of the scrollbar.
*/
jion.lazyValue(
	prototype,
	'_tShape',
	function( )
{
	var
		pos,
		scrollpos,
		size,
		max,
		ap,
		map,
		sy,
		st,
		transform;

	pos = this.pos;

	size = this.size;

	scrollpos = this.scrollpos;

	max = this.max;

	ap = this.aperture * size / max;

	map = Math.max( ap, gruga_scrollbar.minHeight );

	sy = scrollpos * ( ( size - map + ap ) / max );

	st = gruga_scrollbar.strength;

	transform = this.transform;

	return(
		gleam_roundRect.create(
			'pos',
				pos
				.transform( transform )
				.add( -st / 2, transform.scale( sy ) ),
			'width', st,
			'height', transform.scale( map ),
			'a', gruga_scrollbar.ellipseA,
			'b', gruga_scrollbar.ellipseB
		)
	);
}
);


/*
| Handles a potential dragStart event.
*/
prototype.dragStart =
	function(
		p          // point where dragging starts
		//shift,   // true if shift key was held down
		//ctrl     // true if ctrl or meta key was held down
	)
{
	if( !this._tShape.within( p ) ) return undefined;

	root.create(
		'action',
			action_scrolly.create(
				'scrollPath', this.path.shorten,
				'startPoint', p,
				'startPos', this.scrollpos
			)
	);

	return true;
};


/*
| User is hovering his/her pointing device.
*/
prototype.pointingHover =
	function(
		p
		//shift,
		//ctrl
	)
{
	if( !this._tShape.within( p ) ) return undefined;

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'ns-resize'
		)
	);
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
prototype.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};



/*
| Returns true if p is within the scrollbar.
| FIXME remove
*/
/*prototype.within =
	function(
		p
	)
{
	return this._tShape.within( p );
};
*/


} )( );
