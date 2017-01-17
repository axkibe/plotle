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
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_shapeRay,
	gleam_ellipse,
	gruga_frame,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_mask,
	jion,
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

handleSize2 = handleSize / 2;


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

	if( !this.glint.within( p ) ) return;

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

	if( !this.glint.within( p ) ) return;

	if( this._glintHandleNw.within( p ) )
	{
		com = 'nw';
		pBase = zone.pse;
	}
	else if( this._glintHandleNe.within( p ) )
	{
		com = 'ne';
		pBase = zone.psw;
	}
	else if( this._glintHandleSe.within( p ) )
	{
		com = 'se';
		pBase = zone.pnw;
	}
	else if( this._glintHandleSw.within( p ) )
	{
		com = 'sw';
		pBase = zone.pne;
	}
	else if( !this.proportional )
	{
		if( this._glintHandleN.within( p ) )
		{
			com = 'n';
			pBase = zone.ps;
		}
		else if( this._glintHandleE.within( p ) )
		{
			com = 'e';
			pBase = zone.pw;
		}
		else if( this._glintHandleS.within( p ) )
		{
			com = 's';
			pBase = zone.pn;
		}
		else if( this._glintHandleW.within( p ) )
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
			'glint', this._glintFrame,
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

	if( !this.glint.within( p ) ) return;

	if( this._glintHandleNw.within( p ) ) com = 'nw';
	else if( this._glintHandleNe.within( p ) ) com = 'ne';
	else if( this._glintHandleSe.within( p ) ) com = 'se';
	else if( this._glintHandleSw.within( p ) ) com = 'sw';
	else if( !this.proportional )
	{
		if( this._glintHandleN.within( p ) ) com = 'n';
		if( this._glintHandleE.within( p ) ) com = 'e';
		if( this._glintHandleS.within( p ) ) com = 's';
		if( this._glintHandleW.within( p ) ) com = 'w';
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
	'_glintFrame',
	function( )
{
	var
		gRay;

	if( this.proportional )
	{
		gRay =
			[
				this._glintFrameBody,
				this._glintHandleNw,
				this._glintHandleNe,
				this._glintHandleSe,
				this._glintHandleSw
			];
	}
	else
	{
		gRay =
			[
				this._glintFrameBody,
				this._glintHandleNw,
				this._glintHandleNe,
				this._glintHandleSe,
				this._glintHandleSw,
				this._glintHandleN,
				this._glintHandleE,
				this._glintHandleS,
				this._glintHandleW
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
	'_glintFrameBody',
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
| Handle glint in N.
*/
jion.lazyValue(
	prototype,
	'_glintHandleN',
	function( )
{
	var
		pn,
		shape;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pn = this._outerZone.pn;

	shape =
		gleam_ellipse.create(
			'pnw', pn.add( -handleSize2, 0 ),
			'pse', pn.add( handleSize2, handleSize )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in Ne.
*/
jion.lazyValue(
	prototype,
	'_glintHandleNe',
	function( )
{
	var
		pne,
		shape;

	pne = this._outerZone.pne;

	shape =
		gleam_ellipse.create(
			'pnw', pne.add( -handleSize, 0 ),
			'pse', pne.add( 0, handleSize )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in Nw.
*/
jion.lazyValue(
	prototype,
	'_glintHandleNw',
	function( )
{
	var
		pnw,
		shape;

	pnw = this._outerZone.pnw;

	shape =
		gleam_ellipse.create(
			'pnw', pnw,
			'pse', pnw.add( handleSize, handleSize )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in E.
*/
jion.lazyValue(
	prototype,
	'_glintHandleE',
	function( )
{
	var
		pe,
		shape;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pe = this._outerZone.pe;

	shape =
		gleam_ellipse.create(
			'pnw', pe.add( -handleSize, -handleSize / 2 ),
			'pse', pe.add( 0, handleSize / 2 )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in S.
*/
jion.lazyValue(
	prototype,
	'_glintHandleS',
	function( )
{
	var
		ps,
		shape;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	ps = this._outerZone.ps;

	shape =
		gleam_ellipse.create(
			'pnw', ps.add( -handleSize2, -handleSize ),
			'pse', ps.add( handleSize2, 0 )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in Se.
*/
jion.lazyValue(
	prototype,
	'_glintHandleSe',
	function( )
{
	var
		pse,
		shape;

	pse = this._outerZone.pse;

	shape =
		gleam_ellipse.create(
			'pnw', pse.add( -handleSize, -handleSize ),
			'pse', pse
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in Sw.
*/
jion.lazyValue(
	prototype,
	'_glintHandleSw',
	function( )
{
	var
		psw,
		shape;

	psw = this._outerZone.psw;

	shape =
		gleam_ellipse.create(
			'pnw', psw.add( 0, -handleSize ),
			'pse', psw.add( handleSize, 0 )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
		)
	);
}
);


/*
| Handle glint in W.
*/
jion.lazyValue(
	prototype,
	'_glintHandleW',
	function( )
{
	var
		pw,
		shape;

/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	pw = this._outerZone.pw;

	shape =
		gleam_ellipse.create(
			'pnw', pw.add( 0, -handleSize2 ),
			'pse', pw.add( handleSize, handleSize2 )
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', shape
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



} )( );
