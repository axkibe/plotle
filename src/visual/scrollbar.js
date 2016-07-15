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
			view :
			{
				comment : 'view',
				type : 'euclid_view'
			}
		}
	};
}


var
	euclid_anchor_roundRect,
	euclid_rect,
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
			'key', ':scrollbar',
			'shape', this.azSilhoutte
		)
	);
}
);


/*
| Returns the (2d) area of the scrollbar.
|
| FIXME remove
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
		view;

	pnw = this.pnw;

	size = this.size;

	pos = this.pos;

	max = this.max;

	ap = Math.round( this.aperture * size / max );

	map = Math.max( ap, gruga_scrollbar.minHeight );

	sy = Math.round( pos * ( ( size - map + ap ) / max ) );

	s05 = math_half( gruga_scrollbar.strength );

	view = this.view;

	return(
		euclid_roundRect.create(
			'pnw', pnw.add( 0, sy ).inView( view ).add( -s05, 0 ),
			'pse', pnw.add( 0, sy + map ).inView( view ).add( s05, 0 ),
			'a', gruga_scrollbar.ellipseA,
			'b', gruga_scrollbar.ellipseB
		)
	);
}
);


/*
| Returns the (2d) area of the scrollbar.
|
| FUTURE use fixPoints
*/
jion.lazyValue(
	prototype,
	'azSilhoutte',
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
		view;

	pnw = this.pnw;

	size = this.size;

	pos = this.pos;

	max = this.max;

	ap = Math.round( this.aperture * size / max );

	map = Math.max( ap, gruga_scrollbar.minHeight );

	sy = Math.round( pos * ( ( size - map + ap ) / max ) );

	s05 = math_half( gruga_scrollbar.strength );

	view = this.view;

	return(
		euclid_anchor_roundRect.create(
			'pnw', pnw.apnw.add( 0, sy ).add( -s05, 0 ),
			'pse', pnw.apnw.add( 0, sy + map ).add( s05, 0 ),
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
| Pnw in current view.
*/
jion.lazyValue(
	prototype,
	'vPnw',
	function( )
{
	return this.pnw.inView( this.view );
}
);


/*
| Zone in current view.
*/
jion.lazyValue(
	prototype,
	'vZone',
	function( )
{
	var
		vPnw;

	vPnw = this.vPnw;

	return(
		euclid_rect.create(
			'pnw', vPnw,
			'pse',
				vPnw.add(
					gruga_scrollbar.strength,
					this.view.scale( this.size )
				)
		)
	);
}
);


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
