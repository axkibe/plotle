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
			pos :
			{
				comment : 'position of the scrollbar',
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
			pnw :
			{
				comment : 'point in north west',
				type : 'euclid_point'
			},
			size :
			{
				comment : 'size',
				type : 'number'
			},
			transform :
			{
				comment : 'transform',
				type : 'euclid_transform'
			}
		}
	};
}


var
	euclid_roundRect,
	gleam_glint_paint,
	gruga_scrollbar,
	jion,
	math_half,
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
			'shape', this.area
		)
	);
}
);


/*
| Returns the (2d) area of the scrollbar.
*/
jion.lazyValue(
	prototype,
	'area',
	function( )
{
	var
		pnw,
		size,
		pos,
		max,
		ap,
		map,
		sy,
		s05,
		transform;

	pnw = this.pnw;

	size = this.size;

	pos = this.pos;

	max = this.max;

	ap = Math.round( this.aperture * size / max );

	map = Math.max( ap, gruga_scrollbar.minHeight );

	sy = Math.round( pos * ( ( size - map + ap ) / max ) );

	s05 = math_half( gruga_scrollbar.strength );

	transform = this.transform;

	return(
		euclid_roundRect.create(
			'pnw',
				pnw
				.add( 0, sy )
				.transform( transform )
				.add( -s05, 0 ),
			'pse',
				pnw.add( 0, sy + map )
				.transform( transform )
				.add( s05, 0 ),
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
		p,
		border
	)
{
	return this.area.within( p, border );
};


} )( );
