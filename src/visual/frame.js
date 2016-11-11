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
			transform :
			{
				comment : 'current transform of the frame',
				type : 'euclid_transform'
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
	euclid_roundRect,
	euclid_shapeRay,
	gleam_glint_paint,
	gleam_glint_ray,
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
		p,        // cursor point
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
		p,      // cursor point
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

	dp = p.detransform( this.transform );

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
| The frames glint
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		a,
		an,
		arr,
		aZ,
		ca,
		content,
		shape;

	content = this.content;

/**/if( CHECK )
/**/{
/**/	if( content.length === 0 ) throw new Error( );
/**/}

	arr = [ ];

	an = 0;

	for( a = 0, aZ = content.length; a < aZ; a++ )
	{
		ca = content.get( a );

		arr[ an++ ] = ca.tSilhoutte.border( -12 );
	}

	shape = euclid_shapeRay.create( 'ray:init', arr );

	return(
		gleam_glint_mask.create(
			'glint', this._frameGlint,
			'shape', shape,
			'reverse', true
		)
	);
}
);



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


/*::::::::::.
:  Private  :
':::::::::::*/


/*
| The frame glint holding all stuff unmasked.
*/
jion.lazyValue(
	prototype,
	'_frameGlint',
	function( )
{
	var
		gRay;

	if( this.proportional )
	{
		gRay =
			[
				this._frameBodyGlint,
				this._handleNwGlint,
				this._handleNeGlint,
				this._handleSeGlint,
				this._handleSwGlint
			];
	}
	else
	{
		gRay =
			[
				this._frameBodyGlint,
				this._handleNwGlint,
				this._handleNeGlint,
				this._handleSeGlint,
				this._handleSwGlint,
				this._handleNGlint,
				this._handleEGlint,
				this._handleSGlint,
				this._handleWGlint
			];
	}

	return gleam_glint_ray.create( 'ray:init', gRay );
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
		oZone;

	oZone = this._outerZone;

	return(
		euclid_roundRect.create(
			'pnw', oZone.pnw,
			'pse', oZone.pse,
			'a', handleSize / 2,
			'b', handleSize / 2
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
		pn;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pn = this._outerZone.pn;

	return(
		euclid_ellipse.create(
			'pnw', pn.add( -handleSize2, 0 ),
			'pse', pn.add( handleSize2, handleSize )
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
		pne;

	pne = this._outerZone.pne;

	return(
		euclid_ellipse.create(
			'pnw', pne.add( -handleSize, 0 ),
			'pse', pne.add( 0, handleSize )
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
		pnw;

	pnw = this._outerZone.pnw;

	return(
		euclid_ellipse.create(
			'pnw', pnw,
			'pse', pnw.add( handleSize, handleSize )
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
		pe;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pe = this._outerZone.pe;

	return(
		euclid_ellipse.create(
			'pnw', pe.add( -handleSize, -handleSize / 2 ),
			'pse', pe.add( 0, handleSize / 2 )
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
		ps;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	ps = this._outerZone.ps;

	return(
		euclid_ellipse.create(
			'pnw', ps.add( -handleSize2, -handleSize ),
			'pse', ps.add( handleSize2, 0 )
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
		pse;

	pse = this._outerZone.pse;

	return(
		euclid_ellipse.create(
			'pnw', pse.add( -handleSize, -handleSize ),
			'pse', pse
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
		psw;

	psw = this._outerZone.psw;

	return(
		euclid_ellipse.create(
			'pnw', psw.add( 0, -handleSize ),
			'pse', psw.add( handleSize, 0 )
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
		pw;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pw = this._outerZone.pw;

	return(
		euclid_ellipse.create(
			'pnw', pw.add( 0, -handleSize2 ),
			'pse', pw.add( handleSize, handleSize2 )
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
		hw,
		hh,
		fw,
		min,
		pc,
		pnw,
		pse,
		transform,
		tZone;

	fw = gruga_frame.width;

	transform = this.transform;

	tZone = this.zone.transform( transform );

	pc = tZone.pc,

	hw = tZone.width / 2;

	hh = tZone.height / 2;

	min = handleSize2 * ( this.proportional ? 2.5 : 3.5 );

	pnw =
		pc.add(
			Math.min( -hw - fw, -min ),
			Math.min( -hh - fw, -min )
		);

	pse =
		pc.add(
			Math.max( hw + fw, min ),
			Math.max( hh + fw, min )
		);

	return(
		euclid_rect.create(
			'pnw', pnw,
			'pse', pse
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

		if( ci.tSilhoutte.within( p ) ) return true;

		sbary = ci.scrollbarY;

		if( sbary )
		{
			if( sbary.area.within( p ) ) return true;
		}
	}

	return false;
};


} )( );
