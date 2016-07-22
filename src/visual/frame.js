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
	euclid_anchor_ellipse,
	euclid_anchor_fixPoint,
	euclid_anchor_minPoint,
	euclid_anchor_rect,
	euclid_anchor_roundRect,
	euclid_anchor_shapeRay,
	euclid_point,
	euclid_rect,
	gleam_glint_twig,
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

	if( !this._vOuterZone.within( p ) ) return; // XXX

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

	if( !this._vOuterZone.within( p ) ) return; //XXX

	if( this._withinContentMask( p ) ) return;

	if( this._vHandleNwShape.within( p ) )
	{
		com = 'nw';
		pBase = zone.pse;
	}
	else if( this._vHandleNeShape.within( p ) )
	{
		com = 'ne';
		pBase = zone.psw;
	}
	else if( this._vHandleSeShape.within( p ) )
	{
		com = 'se';
		pBase = zone.pnw;
	}
	else if( this._vHandleSwShape.within( p ) )
	{
		com = 'sw';
		pBase = zone.pne;
	}
	else if( !this.proportional )
	{
		if( this._vHandleNShape.within( p ) )
		{
			com = 'n';
			pBase = zone.ps;
		}
		else if( this._vHandleEShape.within( p ) )
		{
			com = 'e';
			pBase = zone.pw;
		}
		else if( this._vHandleSShape.within( p ) )
		{
			com = 's';
			pBase = zone.pn;
		}
		else if( this._vHandleWShape.within( p ) )
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

		arr[ an++ ] = ca.aSilhoutte.border( -12 );
	}

	shape = euclid_anchor_shapeRay.create( 'ray:init', arr );

	return(
		gleam_glint_mask.create(
			'glint', this._frameGlint,
			'key', '$frame',
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

	if( !this._vOuterZone.within( p ) ) return;

	if( this._withinContentMask( p ) ) return;

	// YYY XXX
	if( this._vHandleNwShape.within( p ) ) com = 'nw';
	else if( this._vHandleNeShape.within( p ) ) com = 'ne';
	else if( this._vHandleSeShape.within( p ) ) com = 'se';
	else if( this._vHandleSwShape.within( p ) ) com = 'sw';
	else if( !this.proportional )
	{
		if( this._vHandleNShape.within( p ) ) com = 'n';
		if( this._vHandleEShape.within( p ) ) com = 'e';
		if( this._vHandleSShape.within( p ) ) com = 's';
		if( this._vHandleWShape.within( p ) ) com = 'w';
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
|
| TODO inherit
*/
jion.lazyValue(
	prototype,
	'_frameGlint',
	function( )
{
	var
		glint;

	glint =
		gleam_glint_twig.create(
			'key', 'frame',
			'twine:set+', this._frameBodyGlint,
			'twine:set+', this._handleNwGlint,
			'twine:set+', this._handleNeGlint,
			'twine:set+', this._handleSeGlint,
			'twine:set+', this._handleSwGlint
		);

	if( !this.proportional )
	{
		glint =
			glint.create(
				'twine:set+', this._handleNGlint,
				'twine:set+', this._handleEGlint,
				'twine:set+', this._handleSGlint,
				'twine:set+', this._handleWGlint
			);
	}

	return glint;
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
		euclid_anchor_roundRect.create(
			'pnw', oZone.pnw,
			'pse', oZone.pse,
			'a', handleSize / 2,
			'b', handleSize / 2,
			'fixRounds', true
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
			'key', 'frameBody',
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
		euclid_anchor_ellipse.create(
			'pnw', pn.fixPoint( -handleSize2, 0 ),
			'pse', pn.fixPoint( handleSize2, handleSize )
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
			'key', 'handleN',
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
		euclid_anchor_ellipse.create(
			'pnw', pne.fixPoint( -handleSize, 0 ),
			'pse', pne.fixPoint( 0, handleSize )
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
			'key', 'handleNe',
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
		euclid_anchor_ellipse.create(
			'pnw', pnw,
			'pse',
				euclid_anchor_fixPoint.create(
					'anchor', pnw,
					'x', handleSize,
					'y', handleSize
				)
		)
	);
}
);


// XXX
jion.lazyValue( prototype, '_vHandleNwShape',
	function( ) { return this._handleNwShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleNShape',
	function( ) { return this._handleNShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleNeShape',
	function( ) { return this._handleNeShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleEShape',
	function( ) { return this._handleEShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleSeShape',
	function( ) { return this._handleSeShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleSShape',
	function( ) { return this._handleSShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleSwShape',
	function( ) { return this._handleSwShape.compute( this.view.baseArea, this.view ); }  );

// XXX
jion.lazyValue( prototype, '_vHandleWShape',
	function( ) { return this._handleWShape.compute( this.view.baseArea, this.view ); }  );


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
			'key', 'handleNw',
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
		euclid_anchor_ellipse.create(
			'pnw', pe.fixPoint( -handleSize, -handleSize / 2 ),
			'pse', pe.fixPoint( 0, handleSize / 2 )
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
			'key', 'handleE',
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
		euclid_anchor_ellipse.create(
			'pnw', ps.fixPoint( -handleSize2, -handleSize ),
			'pse', ps.fixPoint( handleSize2, 0 )
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
			'key', 'handleS',
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
		euclid_anchor_ellipse.create(
			'pnw', pse.fixPoint( -handleSize, -handleSize ),
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
			'key', 'handleSe',
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
		euclid_anchor_ellipse.create(
			'pnw', psw.fixPoint( 0, -handleSize ),
			'pse', psw.fixPoint( handleSize, 0 )
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
			'key', 'handleSw',
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
		euclid_anchor_ellipse.create(
			'pnw', pw.fixPoint( 0, -handleSize2 ),
			'pse', pw.fixPoint( handleSize, handleSize2 )
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
			'key', 'handleW',
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
		dfw,
		hw,
		hh,
		fw,
		min,
		pc,
		pnw,
		pse,
		view,
		zone;

	fw = gruga_frame.width;

	view = this.view; // FIXME remove

	dfw = fw / view.zoom;

	zone = this.zone;

	pc = zone.pc.apnw,

	hw = zone.width / 2;

	hh = zone.height / 2;

	min = handleSize2 * ( this.proportional ? 2.5 : 3.5 );

	pnw =
		euclid_anchor_minPoint.create(
			'anchor', pc,
			'x', -hw - dfw,
			'y', -hh - dfw,
			'minx', -min,
			'miny', -min
		);

	pse =
		euclid_anchor_minPoint.create(
			'anchor', pc,
			'x', hw + dfw,
			'y', hh + dfw,
			'minx', min,
			'miny', min
		);

	return(
		euclid_anchor_rect.create(
			'pnw', pnw,
			'pse', pse
		)
	);
}
);




/*
| Outer zone in view.
|
| FIXME remove
*/
jion.lazyValue(
	prototype,
	'_vOuterZone',
	function( )
{
	return this._outerZone.compute( this.view.baseArea, this.view );
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
