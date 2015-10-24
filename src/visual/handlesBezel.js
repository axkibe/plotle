/*
| The old style handles bezel.
*/


var
	euclid_compass,
	euclid_ellipse,
	euclid_point,
	euclid_view,
	gruga_handles,
	jion,
	math_half,
	root,
	visual_handlesBezel;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'visual_handlesBezel',
		attributes :
		{
			handles :
			{
				comment : 'list of available handle directions',
				type : 'protean' // FUTURE jionize
			},
			sbary :
			{
				comment : 'a possible y-scrollbar',
				type : [ 'undefined', 'visual_scrollbar' ]
			},
			silhoutte :
			{
				comment : 'a possible y-scrollbar',
				type : 'protean' // FUTURE ->silhoutte
			},
			zone :
			{
				comment : 'the items zone',
				type : 'euclid_rect'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = visual_handlesBezel.prototype;


/*
| Returns the compass direction of the handle
| if p is on a resizer handle.
*/
prototype.checkHandles =
	function(
		p
	)
{
	var
		a,
		aZ,
		d,
		f,
		h,
		handles,
		d8cwcf;

	handles = this._handles;

	f = root.display;

	d8cwcf = euclid_compass.dir8CWCF;

	for(
		a = 0, aZ = d8cwcf.length;
		a < aZ;
		a++
	)
	{
		d = d8cwcf[ a ];

		h = handles[ d ];

		if( !h ) continue;

		if( h.within( p ) ) return d;
	}
};


/*
| The handle object to plan where to put the handles at
|
| FUTURE use fixPoints (atually replace it with new bezels)
*/
jion.lazyValue(
	prototype,
	'_handles',
	function( )
	{
		var
			a,
			a2,
			asw,
			b,
			b2,
			dcx,
			dcy,
			dex,
			dey,
			ex,
			ha,
			ny,
			mx,
			my,
			sy,
			wx,
			zone;

		ha = this.handles;

		zone = this.zone;

		wx = zone.pnw.x;

		ny = zone.pnw.y;

		ex = zone.pse.x;

		sy = zone.pse.y;

		mx = math_half( wx + ex );

		my = math_half( ny + sy );

		dcx = gruga_handles.cDistance;

		dcy = gruga_handles.cDistance;

		dex = gruga_handles.eDistance;

		dey = gruga_handles.eDistance;

		a =
			Math.min(
				Math.round( ( zone.width  + 2 * dcx ) / 6 ),
				gruga_handles.maxSize
			);

		b =
			Math.min(
				Math.round( ( zone.height + 2 * dcy ) / 6 ),
				gruga_handles.maxSize
			);

		a2 = 2 * a;

		b2 = 2 * b;

		if( dcx > a )
		{
			dex -= math_half( dcx - a );

			dcx = a;
		}

		if( dcy > b )
		{
			dey -= math_half( dcy - b );

			dcy = b;
		}

		asw =
			{
				nw :
					ha.nw
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dcx,
								'y', ny - dcy
							),
						'pse',
							euclid_point.create(
								'x', wx - dcx + a2,
								'y', ny - dcy + b2
							)
					),
				n :
					ha.n
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', mx - a,
								'y', ny - dey
							),
						'pse',
							euclid_point.create(
								'x', mx + a,
								'y', ny - dey + b2
							)
					),
				ne :
					ha.ne
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dcx - a2,
								'y', ny - dcy
							),
						'pse',
							euclid_point.create(
								'x', ex + dex,
								'y', ny - dcy + b2
							)
					),
				e :
					ha.e
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dex - a2,
								'y', my - b
							),
						'pse',
							euclid_point.create(
								'x', ex + dex,
								'y', my + b
							)
					),
				se :
					ha.se
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dcx - a2,
								'y', sy + dcy - b2
							),
						'pse',
							euclid_point.create(
								'x', ex + dcx,
								'y', sy + dcx
							)
					),
				s :
					ha.s
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', mx - a,
								'y', sy + dey -b2
							),
						'pse',
							euclid_point.create(
								'x', mx + a,
								'y', sy + dey
							)
					),
				sw :
					ha.sw
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dcx,
								'y', sy + dcy - b2
							),
						'pse',
							euclid_point.create(
								'x', wx - dcx + a2,
								'y', sy + dcy
							)
					),
				w :
					ha.w
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dex,
								'y', my - b
							),
						'pse',
							euclid_point.create(
								'x', wx - dex + a2,
								'y', my + b
							)
					)
			};

/**/	if( FREEZE )
/**/	{
/**/		Object.freeze( asw );
/**/	}

		return asw;
	}
);


/*
| Draws the handles of an item ( resize, itemmenu )
*/
prototype.drawHandles =
	function(
		display
	)
{
	var
		a,
		area,
		d,
		d8cwcf,
		h,
		handles,
		sbary;

	d8cwcf = euclid_compass.dir8CWCF;

	handles = this._handles;

	sbary = this.scrollbarY;

	if( sbary )
	{
		area = sbary.getArea( euclid_view.proper );

		display.reverseClip( area, -1 );
	}

	display.reverseClip( this.silhoutte, -1 );

	// draws the resize handles

	for( a = d8cwcf.length - 1; a >= 0; a-- )
	{
		d = d8cwcf[ a ];

		h = handles[ d ];

		if( !h ) continue;

		display.paint( gruga_handles.facet, h );
	}

	display.deClip( );
};



} )( );
