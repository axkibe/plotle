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
				type : 'gleam_transform'
			}
		}
	};
}


var
	action_dragItems,
	action_resizeItems,
	gleam_ellipse,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_mask,
	gleam_point,
	gleam_rect,
	gleam_roundRect,
	gleam_shapeRay,
	gruga_frame,
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
		gleam_rect.create(
			'pnw', gleam_point.create( 'x', wx, 'y', ny ),
			'pse', gleam_point.create( 'x', ex, 'y', sy )
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

	// not been clicked, pass through
	if(
		!this._frameBodyShape.within( p )
		|| this._shapeMask.within( p )
	) return;

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

	if(
		!this._frameBodyShape.within( p )
		|| this._shapeMask.within( p )
	) return;

	if( this._shapeHandleNw.within( p ) )
	{
		com = 'nw';
		pBase = zone.pse;
	}
	else if( this._shapeHandleNe.within( p ) )
	{
		com = 'ne';
		pBase = zone.psw;
	}
	else if( this._shapeHandleSe.within( p ) )
	{
		com = 'se';
		pBase = zone.pnw;
	}
	else if( this._shapeHandleSw.within( p ) )
	{
		com = 'sw';
		pBase = zone.pne;
	}
	else if( !this.proportional )
	{
		if( this._shapeHandleN.within( p ) )
		{
			com = 'n';
			pBase = zone.ps;
		}
		else if( this._shapeHandleE.within( p ) )
		{
			com = 'e';
			pBase = zone.pw;
		}
		else if( this._shapeHandleS.within( p ) )
		{
			com = 's';
			pBase = zone.pn;
		}
		else if( this._shapeHandleW.within( p ) )
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



jion.lazyValue(
	prototype,
	'_shapeMask',
	function( )
{
	var
		a,
		an,
		arr,
		aZ,
		ca,
		content;

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

		arr[ an++ ] = ca.tShape.border( -12 );
	}

	return gleam_shapeRay.create( 'ray:init', arr );
}
);


/*
| The frames glint
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	return(
		gleam_glint_mask.create(
			'glint', this._glintFrame,
			'shape', this._shapeMask,
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

	if(
		!this._frameBodyShape.within( p )
		|| this._shapeMask.within( p )
	) return;

	if( this._shapeHandleNw.within( p ) ) com = 'nw';
	else if( this._shapeHandleNe.within( p ) ) com = 'ne';
	else if( this._shapeHandleSe.within( p ) ) com = 'se';
	else if( this._shapeHandleSw.within( p ) ) com = 'sw';
	else if( !this.proportional )
	{
		if( this._shapeHandleN.within( p ) ) com = 'n';
		if( this._shapeHandleE.within( p ) ) com = 'e';
		if( this._shapeHandleS.within( p ) ) com = 's';
		if( this._shapeHandleW.within( p ) ) com = 'w';
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
		glintFrameBody,
		glintHandleE,
		glintHandleN,
		glintHandleNe,
		glintHandleNw,
		glintHandleS,
		glintHandleSe,
		glintHandleSw,
		glintHandleW,
		gRay;

	glintFrameBody =
		gleam_glint_paint.create(
			'facet', gruga_frame.facet,
			'shape', this._frameBodyShape
		);

	glintHandleNe =
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._shapeHandleNe
		);

	glintHandleNw =
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._shapeHandleNw
		);

	glintHandleSe =
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._shapeHandleSe
		);

	glintHandleSw =
		gleam_glint_paint.create(
			'facet', gruga_frame.handleFacet,
			'shape', this._shapeHandleSw
		);

	if( this.proportional )
	{
		gRay =
			[
				glintFrameBody,
				glintHandleNw,
				glintHandleNe,
				glintHandleSe,
				glintHandleSw
			];
	}
	else
	{
		glintHandleE =
			gleam_glint_paint.create(
				'facet', gruga_frame.handleFacet,
				'shape', this._shapeHandleE
			);

		glintHandleN =
			gleam_glint_paint.create(
				'facet', gruga_frame.handleFacet,
				'shape', this._shapeHandleN
			);

		glintHandleS =
			gleam_glint_paint.create(
				'facet', gruga_frame.handleFacet,
				'shape', this._shapeHandleS
			);

		glintHandleW =
			gleam_glint_paint.create(
				'facet', gruga_frame.handleFacet,
				'shape', this._shapeHandleW
			);

		gRay =
			[
				glintFrameBody,
				glintHandleNw,
				glintHandleNe,
				glintHandleSe,
				glintHandleSw,
				glintHandleN,
				glintHandleE,
				glintHandleS,
				glintHandleW
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
		gleam_roundRect.create(
			'pnw', oZone.pnw,
			'pse', oZone.pse,
			'a', handleSize / 2,
			'b', handleSize / 2
		)
	);
}
);



/*
| Handle glint in N.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleN',
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
		gleam_ellipse.create(
			'pnw', pn.add( -handleSize2, 0 ),
			'pse', pn.add( handleSize2, handleSize )
		)
	);
}
);


/*
| Handle glint in Ne.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleNe',
	function( )
{
	var
		pne;

	pne = this._outerZone.pne;

	return(
		gleam_ellipse.create(
			'pnw', pne.add( -handleSize, 0 ),
			'pse', pne.add( 0, handleSize )
		)
	);
}
);


/*
| Handle glint in Nw.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleNw',
	function( )
{
	var
		pnw;

	pnw = this._outerZone.pnw;

	return(
		gleam_ellipse.create(
			'pnw', pnw,
			'pse', pnw.add( handleSize, handleSize )
		)
	);
}
);


/*
| Handle glint in E.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleE',
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
		gleam_ellipse.create(
			'pnw', pe.add( -handleSize, -handleSize / 2 ),
			'pse', pe.add( 0, handleSize / 2 )
		)
	);
}
);


/*
| Handle glint in S.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleS',
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
		gleam_ellipse.create(
			'pnw', ps.add( -handleSize2, -handleSize ),
			'pse', ps.add( handleSize2, 0 )
		)
	);
}
);


/*
| Handle glint in Se.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleSe',
	function( )
{
	var
		pse;

	pse = this._outerZone.pse;

	return(
		gleam_ellipse.create(
			'pnw', pse.add( -handleSize, -handleSize ),
			'pse', pse
		)
	);
}
);


/*
| Handle glint in Sw.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleSw',
	function( )
{
	var
		psw;

	psw = this._outerZone.psw;

	return(
		gleam_ellipse.create(
			'pnw', psw.add( 0, -handleSize ),
			'pse', psw.add( handleSize, 0 )
		)
	);
}
);


/*
| Handle glint in W.
*/
jion.lazyValue(
	prototype,
	'_shapeHandleW',
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
		gleam_ellipse.create(
			'pnw', pw.add( 0, -handleSize2 ),
			'pse', pw.add( handleSize, handleSize2 )
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

	return gleam_rect.create( 'pnw', pnw, 'pse', pse );
}
);



} )( );
