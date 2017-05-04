/*
| A scrollbar.
|
| Used by note.
|
| Currently there are only vertical scrollbars.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_scrollbar',
		attributes :
		{
			scrollpos :
			{
				comment : 'scrollposition',
				type : 'number'
			},
			aperture :
			{
				comment : 'the size of the bar',
				type : 'number'
			},
			max :
			{
				comment : 'maximum position',
				type : 'number'
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
	gleam_roundRect,
	gleam_glint_paint,
	gruga_scrollbar,
	jion,
	visual_scrollbar;


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

prototype = visual_scrollbar.prototype;


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
*/
prototype.within =
	function(
		p
	)
{
	return this._tShape.within( p );
};


} )( );
