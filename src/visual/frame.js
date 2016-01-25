/*
| The alteration frame.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_frame',
		attributes :
		{
			content :
			{
				comment : 'content of the frame',
				type : require( '../typemaps/visualItem' )
			},
			view :
			{
				comment : 'the view',
				type : 'euclid_view'
			}
		},
		init : [ ]
	};
}


var
	euclid_ellipse,
	euclid_point,
	euclid_rect,
	euclid_shape,
	euclid_shape_line,
	euclid_shape_round,
	euclid_shape_start,
	gruga_frame,
	math_half,
	jion,
	visual_frame;

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

prototype = visual_frame.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	var
		load,
		h,
		hne,
		hnw,
		hse,
		hsw,
		hsx,
		hsx2,
		hsy,
		hsy2,
		oDis,
		oPe,
		oPn,
		oPne,
		oPnw,
		oPs,
		oPse,
		oPsw,
		oPw,
		oZone,
		vZone,
		w;

	hsx =
	hsy =
		gruga_frame.handleSize;

	oDis = gruga_frame.width;

	vZone = this.vZone;

	oPnw = vZone.pnw.add( -oDis, -oDis );

	oPse = vZone.pse.add( +oDis, +oDis );

	switch( this.resizeHandles )
	{
		case 'arbitrary' : load = 3.5; break;

		case 'zoom' : load = 2.5; break;

		default : throw new Error( );
	}

	w = oPse.x - oPnw.x;

	h = oPse.y - oPnw.y;

	if( load * hsx > w )
	{
		oPnw = oPnw.add( -math_half( load * hsx - w ), 0 );

		oPse = oPse.add( math_half( load * hsx - w ), 0 );
	}

	if( load * hsy > h )
	{
		oPnw = oPnw.add( 0, -math_half( load * hsy - h ) );

		oPse = oPse.add( 0, math_half( load * hsy - h ) );
	}

	oZone =
	this.oZone =
		euclid_rect.create(
			'pnw', oPnw,
			'pse', oPse
		);

	if( load * hsy > oZone.height )
	{
		hsy = Math.round( oZone.height / load );
	}

	oPne = oZone.pne;

	oPsw = oZone.psw;

	hnw =
	this._handleNw =
		euclid_ellipse.create(
			'pnw', oPnw,
			'pse', oPnw.add( hsx, hsy )
		);

	hne =
	this._handleNe =
		euclid_ellipse.create(
			'pnw', oPne.add( -hsx, 0 ),
			'pse', oPne.add( 0, hsy )
		);

	hse =
	this._handleSe =
		euclid_ellipse.create(
			'pnw', oPse.add( -hsx, -hsy ),
			'pse', oPse
		);

	hsw =
	this._handleSw =
		euclid_ellipse.create(
			'pnw', oPsw.add(  0, -hsy ),
			'pse', oPsw.add(  hsx , 0 )
		);

	if( this.resizeHandles === 'arbitrary' )
	{
		oPn = oZone.pn;

		oPe = oZone.pe;

		oPs = oZone.ps;

		oPw = oZone.pw;

		hsx2 = math_half( hsx );

		hsy2 = math_half( hsy );

		this._handleN =
			euclid_ellipse.create(
				'pnw', oPn.add( -hsx2, 0 ),
				'pse', oPn.add( hsx2, hsy )
			);

		this._handleE =
			euclid_ellipse.create(
				'pnw', oPe.add( -hsx, -hsy2 ),
				'pse', oPe.add( 0, hsy2 )
			);

		this._handleS =
			euclid_ellipse.create(
				'pnw', oPs.add( -hsx2, -hsy ),
				'pse', oPs.add( hsx2, 0 )
			);

		this._handleW =
			euclid_ellipse.create(
				'pnw', oPw.add( 0, -hsy2 ),
				'pse', oPw.add( hsx, hsy2 )
			);
	}

	this._shape =
		euclid_shape.create(
		'ray:init',
		[
			euclid_shape_start.create( 'p', hnw.pw ),
			euclid_shape_round.create( 'p', hnw.pn ),

			euclid_shape_line.create( 'p', hne.pn ),
			euclid_shape_round.create( 'p', hne.pe ),

			euclid_shape_line.create( 'p', hse.pe ),
			euclid_shape_round.create( 'p', hse.ps ),

			euclid_shape_line.create( 'p', hsw.ps ),
			euclid_shape_round.create( 'p', hsw.pw ),

			euclid_shape_line.create( 'close', true )
		],
		'pc',
			euclid_point.create(
				'x', math_half( oPse.x + oPnw.x ) ,
				'y', math_half( oPse.y + oPnw.y )
			),
		'gradientR1',
			Math.max(
				oPse.x - oPnw.x,
				oPse.y - oPnw.y
			)
		);
};


/*
| Returns the compass direction of the handle
| if p is on a resizer handle.
*/
prototype.checkHandles =
	function(
		p
	)
{
	if( !this.oZone.within( p ) ) return;

	if( this.vZone.within( p ) ) return;

	if( this._handleNw.within( p ) ) return 'nw';

	if( this._handleNe.within( p ) ) return 'ne';

	if( this._handleSe.within( p ) ) return 'se';

	if( this._handleSw.within( p ) ) return 'sw';

	if( this.resizeHandles === 'arbitrary' )
	{
		if( this._handleN.within( p ) ) return 'n';

		if( this._handleE.within( p ) ) return 'e';

		if( this._handleS.within( p ) ) return 's';

		if( this._handleW.within( p ) ) return 'w';
	}
};



/*
| Draws the frame.
*/
prototype.draw =
	function(
		display
	)
{
	var
		content,
		sbary;

	content = this.content;

	sbary = content.scrollbarY;

	display.reverseClip( content.vSilhoutte, -2 );

	if( sbary )
	{
		display.reverseClip( sbary.area, -0.5 );
	}

	display.paint( gruga_frame.facet, this._shape );

	display.paint( gruga_frame.handleFacet, this._handleNw );

	display.paint( gruga_frame.handleFacet, this._handleNe );

	display.paint( gruga_frame.handleFacet, this._handleSe );

	display.paint( gruga_frame.handleFacet, this._handleSw );

	if( this.resizeHandles === 'arbitrary' )
	{
		display.paint( gruga_frame.handleFacet, this._handleN );

		display.paint( gruga_frame.handleFacet, this._handleE );

		display.paint( gruga_frame.handleFacet, this._handleS );

		display.paint( gruga_frame.handleFacet, this._handleW );
	}

	display.deClip( );
};


/*
| Zone in current view.
*/
jion.lazyValue(
	prototype,
	'vZone',
function( )
{
	return this.zone.inView( this.view );
}
);


/*
| Zone.
*/
jion.lazyValue(
	prototype,
	'zone',
function( )
{
	return this.content.zone;
}
);


/*
| '"arbitrary" or "zoom"',
*/
jion.lazyValue(
	prototype,
	'resizeHandles',
function( )
{
	return this.content.resizeHandles;
}
);

} )( );
