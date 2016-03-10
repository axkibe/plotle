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
				type : 'visual_itemRay'
			},
			view :
			{
				comment : 'the view',
				type : 'euclid_view'
			}
		}
	};
}


var
	action_dragItems,
	action_resizeItems,
	euclid_ellipse,
	euclid_point,
	euclid_rect,
	euclid_scale,
	euclid_shape,
	euclid_shape_line,
	euclid_shape_round,
	euclid_shape_start,
	gleam_container,
	gleam_glint_paint,
	gleam_glint_mask,
	gruga_frame,
	jion,
	math_half,
	result_hover,
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
	handleSize,
	handleSize2,
	prototype;

prototype = visual_frame.prototype;

handleSize = gruga_frame.handleSize;

handleSize2 = math_half( handleSize );


/*
| Beams the item onto a gleam container.
*/
prototype.beam =
	function(
		container
	)
{
	return(
		container.create(
			'twig:set+', 'frame', this._frameMaskGlint
		)
	);
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
		a,
		content,
		cLen,
		ca,
		sbary;

	content = this.content;

	for( a = 0, cLen = content.length; a < cLen; a++ )
	{
		ca = content.get( a );

		sbary = ca.scrollbarY;

		display.reverseClip( ca.vSilhoutte, -2 );

		if( sbary ) display.reverseClip( sbary.area, -0.5 );
	}

	display.paint( gruga_frame.facet, this._frameBodyShape );

	display.paint( gruga_frame.handleFacet, this._handleNwShape );

	display.paint( gruga_frame.handleFacet, this._handleNeShape );

	display.paint( gruga_frame.handleFacet, this._handleSeShape );

	display.paint( gruga_frame.handleFacet, this._handleSwShape );

	if( !this.proportional )
	{
		display.paint( gruga_frame.handleFacet, this._handleNShape );

		display.paint( gruga_frame.handleFacet, this._handleEShape );

		display.paint( gruga_frame.handleFacet, this._handleSShape );

		display.paint( gruga_frame.handleFacet, this._handleWShape );
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
	var
		a,
		content,
		cLen,
		cZone,
		ex,
		ny,
		pnw,
		pse,
		sy,
		wx;

	content = this.content;

	cLen = content.length;

/**/if( CHECK )
/**/{
/**/	if ( cLen === 0 ) throw new Error( );
/**/}

	cZone = content.get( 0 ).zone;

	pnw = cZone.pnw;

	pse = cZone.pse;

	ny = pnw.y;

	wx = pnw.x;

	sy = pse.y;

	ex = pse.x;

	if( cLen === 1 ) return cZone;

	for( a = 1; a < cLen; a++ )
	{
		cZone = content.get( a ).zone;

		pnw = cZone.pnw;

		pse = cZone.pse;

		if( pnw.x < wx ) wx = pnw.x;

		if( pse.x > ex ) ex = pse.x;

		if( pnw.y < ny ) ny = pnw.y;

		if( pse.y > sy ) sy = pse.y;
	}

	return(
		euclid_rect.create(
			'pnw', euclid_point.create( 'x', wx, 'y', ny ),
			'pse', euclid_point.create( 'x', ex, 'y', sy )
		)
	);
}
);


/*
| If true resize content proportional only.
*/
jion.lazyValue(
	prototype,
	'proportional',
function( )
{
	var
		a,
		aZ,
		content;

	content = this.content;

	for( a = 0, aZ = content.length; a < aZ; a++ )
	{
		if( content.get( a ).proportional ) return true;
	}

	return false;
}
);



/*
| Checks if the frame has been clicked.
*/
prototype.click =
	function(
		p,        // cursor point ( in view )
		shift,    // true if shift key was pressed
		ctrl      // true if ctrl key was pressed
		//access  // rights the current user has for current space
	)
{
	// ctrl-clicks are not swallowed.
	if( ctrl ) return false;

	if( !this._outerZone.within( p ) ) return;

	if( this._withinContentMask( p ) ) return;

	// it has been clicked, yet do nothing.

	return true;
};


/*
| Starts an operation with the pointing device held down.
*/
prototype.dragStart =
	function(
		p,      // cursor point ( in view )
		shift,  // true if shift key was pressed
		ctrl,   // true if ctrl key was pressed
		access  // rights the current user has for current space
	)
{
	var
		com,
		dp,
		pBase,
		zone;

	if( access !== 'rw' ) return;

	zone = this.zone;

	if( !this._outerZone.within( p ) ) return;

	if( this._withinContentMask( p ) ) return;

	if( this._handleNwShape.within( p ) )
	{
		com = 'nw';
		pBase = zone.pse;
	}
	else if( this._handleNeShape.within( p ) )
	{
		com = 'ne';
		pBase = zone.psw;
	}
	else if( this._handleSeShape.within( p ) )
	{
		com = 'se';
		pBase = zone.pnw;
	}
	else if( this._handleSwShape.within( p ) )
	{
		com = 'sw';
		pBase = zone.pne;
	}
	else if( !this.proportional )
	{
		if( this._handleNShape.within( p ) )
		{
			com = 'n';
			pBase = zone.ps;
		}
		else if( this._handleEShape.within( p ) )
		{
			com = 'e';
			pBase = zone.pw;
		}
		else if( this._handleSShape.within( p ) )
		{
			com = 's';
			pBase = zone.pn;
		}
		else if( this._handleWShape.within( p ) )
		{
			com = 'w';
			pBase = zone.pe;
		}
	}

	dp = p.fromView( this.view );

	if( com )
	{
		root.create(
			'action',
				action_resizeItems.create(
					'itemPaths', this.content.itemPaths,
					'startZones', this.content.zones,
					'proportional', this.proportional,
					'resizeDir', com,
					'startPoint', dp,
					'pBase', pBase,
					'scaleX', 1,
					'scaleY', 1
				)
		);

		return true;
	}

	root.create(
		'action',
			action_dragItems.create(
				'startPoint', dp,
				'itemPaths', this.content.itemPaths
			)
	);

	return true;
};


/*
| Mouse hover.
|
| Returns true if the pointing device hovers over anything.
*/
prototype.pointingHover =
	function(
		p
	)
{
	var
		com;

	if( !this._outerZone.within( p ) ) return;

	if( this._withinContentMask( p ) ) return;

	if( this._handleNwShape.within( p ) ) com = 'nw';
	else if( this._handleNeShape.within( p ) ) com = 'ne';
	else if( this._handleSeShape.within( p ) ) com = 'se';
	else if( this._handleSwShape.within( p ) ) com = 'sw';
	else if( !this.proportional )
	{
		if( this._handleNShape.within( p ) ) com = 'n';
		if( this._handleEShape.within( p ) ) com = 'e';
		if( this._handleSShape.within( p ) ) com = 's';
		if( this._handleWShape.within( p ) ) com = 'w';
	}

	if( com )
	{
		return result_hover.create( 'cursor', com + '-resize' );
	}

	return result_hover.create( 'cursor', 'grab' );
};


/*::::::::::::
   Private
::::::::::::*/


/*
| The frame container holding all stuff unmasked.
*/
jion.lazyValue(
	prototype,
	'_frameContainer',
	function( )
{

	var
		container,
		fbg,
		hng,
		heg,
		hneg,
		hnwg,
		hseg,
		hsg,
		hswg,
		hwg;

	fbg = this._frameBodyGlint;

	hnwg = this._handleNwGlint;

	hneg = this._handleNeGlint;

	hseg = this._handleSeGlint;

	hswg = this._handleSwGlint;

	container =
		gleam_container.create(
			'twig:set+', fbg.id, fbg,
			'twig:set+', hnwg.id, hnwg,
			'twig:set+', hneg.id, hneg,
			'twig:set+', hseg.id, hseg,
			'twig:set+', hswg.id, hswg
		);

	if( !this.proportional )
	{
		hng = this._handleNGlint;

		heg = this._handleEGlint;

		hsg = this._handleSGlint;

		hwg = this._handleWGlint;

		container =
			container.create(
				'twig:set+', hng.id, hng,
				'twig:set+', heg.id, heg,
				'twig:set+', hsg.id, hsg,
				'twig:set+', hwg.id, hwg
			);
	}

	return container;
}
);


/*
| The frame mask.
*/
jion.lazyValue(
	prototype,
	'_frameMaskGlint',
	function( )
{
	var
		scale;

	scale =
		euclid_scale.create(
			'shape', this.content.get( 0 ).vSilhoutte,
			'distance', -1
		);

	return(
		gleam_glint_mask.create(
			'container', this._frameContainer,
			'scale', scale,
			'reverse', true
		)
	);
}
);


/*
| The shape of the frame body.
*/
jion.lazyValue(
	prototype,
	'_frameBodyShape',
	function( )
{
	var
		hne,
		hnw,
		hse,
		hsw,
		oPnw,
		oPse,
		oZone;

	oZone = this._outerZone;

	oPnw = oZone.pnw;

	oPse = oZone.pse;

	hnw = this._handleNwShape;

	hne = this._handleNeShape;

	hse = this._handleSeShape;

	hsw = this._handleSwShape;

	return(
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
		'pc', oZone.pc,
		'gradientR1',
			Math.max(
				oPse.x - oPnw.x,
				oPse.y - oPnw.y
			)
		)
	);
}
);


/*
| The frames body glint.
*/
jion.lazyValue(
	prototype,
	'_frameBodyGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.facet,
			'shape', this._frameBodyShape
		)
	);
}
);


/*
| Handle shape in N.
*/
jion.lazyValue(
	prototype,
	'_handleNShape',
	function( )
{
	var
		oPn;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	oPn = this._outerZone.pn;

	return(
		euclid_ellipse.create(
			'pnw', oPn.add( -handleSize2, 0 ),
			'pse', oPn.add( handleSize2, handleSize )
		)
	);
}
);


/*
| Handle glint in N.
*/
jion.lazyValue(
	prototype,
	'_handleNGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleNShape
		)
	);
}
);


/*
| Handle shape in Ne.
*/
jion.lazyValue(
	prototype,
	'_handleNeShape',
	function( )
{
	var
		oPne;

	oPne = this._outerZone.pne;

	return(
		euclid_ellipse.create(
			'pnw', oPne.add( -handleSize, 0 ),
			'pse', oPne.add( 0, handleSize )
		)
	);
}
);


/*
| Handle glint in Ne.
*/
jion.lazyValue(
	prototype,
	'_handleNeGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleNeShape
		)
	);
}
);


/*
| Handle shape in Nw.
*/
jion.lazyValue(
	prototype,
	'_handleNwShape',
	function( )
{
	var
		oPnw;

	oPnw = this._outerZone.pnw;

	return(
		euclid_ellipse.create(
			'pnw', oPnw,
			'pse', oPnw.add( handleSize, handleSize )
		)
	);
}
);


/*
| Handle glint in Nw.
*/
jion.lazyValue(
	prototype,
	'_handleNwGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleNwShape
		)
	);
}
);


/*
| Handle shape in E.
*/
jion.lazyValue(
	prototype,
	'_handleEShape',
	function( )
{
	var
		oPe;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	oPe = this._outerZone.pe;

	return(
		euclid_ellipse.create(
			'pnw', oPe.add( -handleSize, -handleSize2 ),
			'pse', oPe.add( 0, handleSize2 )
		)
	);
}
);


/*
| Handle glint in E.
*/
jion.lazyValue(
	prototype,
	'_handleEGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleEShape
		)
	);
}
);


/*
| Handle shape in S.
*/
jion.lazyValue(
	prototype,
	'_handleSShape',
	function( )
{
	var
		oPs;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	oPs = this._outerZone.ps;

	return(
		euclid_ellipse.create(
			'pnw', oPs.add( -handleSize2, -handleSize ),
			'pse', oPs.add( handleSize2, 0 )
		)
	);
}
);


/*
| Handle glint in S.
*/
jion.lazyValue(
	prototype,
	'_handleSGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleSShape
		)
	);
}
);


/*
| Handle shape in Se.
*/
jion.lazyValue(
	prototype,
	'_handleSeShape',
	function( )
{
	var
		oPse;

	oPse = this._outerZone.pse;

	return(
		euclid_ellipse.create(
			'pnw', oPse.add( -handleSize, -handleSize ),
			'pse', oPse
		)
	);
}
);


/*
| Handle glint in Se.
*/
jion.lazyValue(
	prototype,
	'_handleSeGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleSeShape
		)
	);
}
);


/*
| Handle shape in Sw.
*/
jion.lazyValue(
	prototype,
	'_handleSwShape',
	function( )
{
	var
		oPsw;

	oPsw = this._outerZone.psw;

	return(
		euclid_ellipse.create(
			'pnw', oPsw.add(  0, -handleSize ),
			'pse', oPsw.add(  handleSize , 0 )
		)
	);
}
);


/*
| Handle glint in Sw.
*/
jion.lazyValue(
	prototype,
	'_handleSwGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleSwShape
		)
	);
}
);


/*
| Handle shape in W.
*/
jion.lazyValue(
	prototype,
	'_handleWShape',
	function( )
{
	var
		oPw;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	oPw = this._outerZone.pw;

	return(
		euclid_ellipse.create(
			'pnw', oPw.add( 0, -handleSize2 ),
			'pse', oPw.add( handleSize, handleSize2 )
		)
	);
}
);


/*
| Handle glint in W.
*/
jion.lazyValue(
	prototype,
	'_handleWGlint',
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._handleWShape
		)
	);
}
);


/*
| Maximum handle load factor.
|
| So the user still has space to touch the frame itself.
*/
jion.lazyValue(
	prototype,
	'_maxHandleLoadFactor',
	function( )
{
	return(
		this.proportional
		? 2.5
		: 3.5
	);
}
);



/*
| Outer zone.
|
| Framed objects plus frame width.
*/
jion.lazyValue(
	prototype,
	'_outerZone',
	function( )
{
	var
		h,
		hs,
		fw,
		load,
		oPnw,
		oPse,
		vZone,
		w;

	fw = gruga_frame.width;

	vZone = this.vZone;

	oPnw = vZone.pnw.add( -fw, -fw );

	oPse = vZone.pse.add( +fw, +fw );

	load = this._maxHandleLoadFactor;

	hs = gruga_frame.handleSize;

	w = oPse.x - oPnw.x;

	h = oPse.y - oPnw.y;

	if( load * hs > w )
	{
		oPnw = oPnw.add( -math_half( load * hs - w ), 0 );

		oPse = oPse.add( math_half( load * hs - w ), 0 );
	}

	if( load * hs > h )
	{
		oPnw = oPnw.add( 0, -math_half( load * hs - h ) );

		oPse = oPse.add( 0, math_half( load * hs - h ) );
	}

	return(
		euclid_rect.create(
			'pnw', oPnw,
			'pse', oPse
		)
	);
}
);


/*
| Returns true if p is within the frames content mask.
*/
prototype._withinContentMask =
	function(
		p
)
{
	var
		c,
		cZ,
		ci,
		content,
		sbary;

	content = this.content;

	for( c = 0, cZ = content.length; c < cZ; c++ )
	{
		ci = content.get( c );

		if( ci.vSilhoutte.within( p ) ) return true;

		sbary = ci.scrollbarY;

		if( sbary )
		{
			if( sbary.area.within( p ) ) return true;
		}
	}

	return false;
};


} )( );
