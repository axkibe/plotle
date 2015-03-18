/*
| The old style handles bezel.
*/


var
	euclid_compass,
	euclid_ellipse,
	euclid_point,
	euclid_view,
	jools,
	root,
	theme,
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
	return {
		id :
			'visual_handlesBezel',
		attributes :
			{
				handles :
					{
						comment :
							'list of available handle directions',
						type :
							'protean' // FUTURE jionize
					},
				sbary :
					{
						comment :
							'a possible y-scrollbar',
						type :
							'visual_scrollbar',
						defaultValue :
							'undefined'
					},
				silhoutte :
					{
						comment :
							'a possible y-scrollbar',
						type :
							'protean' // FIXME ->silhoutte
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view'
					},
				zone :
					{
						comment :
							'the items zone',
						type :
							'euclid_rect'
					}
			}
	};
}


/*
| Returns the compass direction of the handle
| if p is on a resizer handle.
*/
visual_handlesBezel.prototype.checkHandles =
	function(
		p
	)
{
	var
		a,
		aZ,
		d,
		f,
		fixView,
		h,
		handles,
		d8cwcf,
		view;

	handles = this._handles;

	view = this.view;

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

		if( !h )
		{
			continue;
		}

		fixView = view.review( 0, view.point( h.pc ) );

		if( h.within( fixView, p ) )
		{
			return d;
		}
	}

	return null;
};


/*
| The handle object to plan where to put the handles at
|
| FUTURE use fixPoints (atually replace it with new bezels)
*/
jools.lazyValue(
	visual_handlesBezel.prototype,
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

		mx = jools.half( wx + ex );

		my = jools.half( ny + sy );

		dcx = theme.handle.cdistance;

		dcy = theme.handle.cdistance;

		dex = theme.handle.edistance;

		dey = theme.handle.edistance;

		a =
			Math.min(
				Math.round( ( zone.width  + 2 * dcx ) / 6 ),
				theme.handle.maxSize
			),

		b =
			Math.min(
				Math.round( ( zone.height + 2 * dcy ) / 6 ),
				theme.handle.maxSize
			),

		a2 = 2 * a,

		b2 = 2 * b;

		if( dcx > a )
		{
			dex -= jools.half( dcx - a );

			dcx = a;
		}

		if( dcy > b )
		{
			dey -= jools.half( dcy - b );

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
visual_handlesBezel.prototype.drawHandles =
	function(
		display
	)
{
	var
		a,
		area,
		d,
		d8cwcf,
		fixView,
		h,
		handles,
		sbary,
		view;

	d8cwcf = euclid_compass.dir8CWCF;

	handles = this._handles;

	sbary = this.scrollbarY;

	view = this.view;

	if( sbary )
	{
		area = sbary.getArea( view );

		display.reverseClip( area, euclid_view.proper, -1 );
	}

	display.reverseClip( this.silhoutte, view, -1 );

	// draws the resize handles

	for(
		a = d8cwcf.length - 1;
		a >= 0;
		a--
	)
	{
		d = d8cwcf[ a ];

		h = handles[ d ];

		if( !h )
		{
			continue;
		}

		fixView = view.review( 0, view.point( h.pc ) );

		display.oldPaint( theme.handle.style, h, fixView );
	}

	display.deClip( );
};



} )( );
