/*
| The alteration frame.
*/
'use strict';


tim.define( module, ( def, visual_frame ) => {


if( TIM )
{
	def.attributes =
	{
		// current users access level
		access : { type : 'string' },

		// content of the frame
		content : { type : '../fabric/itemSet' },

		// current transform of the frame
		transform : { type : '../gleam/transform' },
	};
}


const action_dragItems = tim.require( '../action/dragItems' );

const action_resizeItems = tim.require( '../action/resizeItems' );

const compass = tim.require( '../compass/root' );

const gleam_ellipse = tim.require( '../gleam/ellipse' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_mask = tim.require( '../gleam/glint/mask' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_rect = tim.require( '../gleam/rect' );

const gleam_roundRect = tim.require( '../gleam/roundRect' );

const gleam_shapeList = tim.require( '../gleam/shapeList' );

const gruga_frame = tim.require( '../gruga/frame' );

const result_hover = tim.require( '../result/hover' );


/*
| Stancil for handles.
*/
def.staticLazy.handle = ( ) =>
	gleam_ellipse.create(
		'pos', gleam_point.zero,
		'width', gruga_frame.handleSize,
		'height', gruga_frame.handleSize
	);


/*
| The frames glint
*/
def.lazy.glint =
	function( )
{
	return(
		gleam_glint_mask.create(
			'glint', this._glintFrame,
			'shape', this._shapeMask,
			'reverse', true
		)
	);
};



/*
| If true resize content proportional only.
*/
def.lazy.proportional =
	function( )
{
	for( let item of this.content )
	{
		if( item.proportional ) return true;
	}

	return false;
};


/*
| Zone.
*/
def.lazy.zone =
	function( )
{
	const content = this.content;

	const size = content.size;

/**/if( CHECK )
/**/{
/**/	if ( !( size > 0 ) ) throw new Error( );
/**/}

	let cZone, ny, wx, sy, ex;

	for( let item of content )
	{
		if( !cZone )
		{
			// first iteration
			cZone = item.zone;

			if( size === 1 ) return cZone;

			const pos = cZone.pos;

			ny = pos.y;

			wx = pos.x;

			sy = pos.y + cZone.height;

			ex = pos.x + cZone.width;

			continue;
		}

		cZone = item.zone;

		const pos = cZone.pos;

		const cex = pos.x + cZone.width;

		const csy = pos.y + cZone.height;

		if( pos.x < wx ) wx = pos.x;

		if( cex > ex ) ex = cex;

		if( pos.y < ny ) ny = pos.y;

		if( csy > sy ) sy = csy;
	}

	return(
		gleam_rect.create(
			'pos', gleam_point.xy( wx, ny ),
			'width', ex - wx,
			'height', sy - ny
		)
	);
};


/*
| The shape used as mask for the inner contents of the frame.
*/
def.lazy._shapeMask =
	function( )
{
	const arr = [ ];

	for( let ca of this.content )
	{
		arr.push( ca.tShape.border( -12 ) );
	}

	return gleam_shapeList.create( 'list:init', arr );
};



/*
| The frame glint holding all stuff unmasked.
*/
def.lazy._glintFrame =
	function( )
{
	const handleFacet = gruga_frame.handleFacet;

	const glintFrameBody =
		gleam_glint_paint.createFS( gruga_frame.facet, this._frameBodyShape );

	const glintHandleNe = gleam_glint_paint.createFS( handleFacet, this._shapeHandleNe );

	const glintHandleNw = gleam_glint_paint.createFS( handleFacet, this._shapeHandleNw );

	const glintHandleSe = gleam_glint_paint.createFS( handleFacet, this._shapeHandleSe );

	const glintHandleSw = gleam_glint_paint.createFS( handleFacet, this._shapeHandleSw );

	let arr;

	if( this.proportional )
	{
		arr = [ glintFrameBody, glintHandleNw, glintHandleNe, glintHandleSe, glintHandleSw ];
	}
	else
	{
		const glintHandleE = gleam_glint_paint.createFS( handleFacet, this._shapeHandleE );

		const glintHandleN = gleam_glint_paint.createFS( handleFacet, this._shapeHandleN );

		const glintHandleS = gleam_glint_paint.createFS( handleFacet, this._shapeHandleS );

		const glintHandleW = gleam_glint_paint.createFS( handleFacet, this._shapeHandleW );

		arr =
			[
				glintFrameBody,
				glintHandleNw, glintHandleNe, glintHandleSe, glintHandleSw,
				glintHandleN,  glintHandleE,  glintHandleS,  glintHandleW
			];
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The shape of the frame body.
*/
def.lazy._frameBodyShape =
	function( )
{
	const oZone = this._outerZone;

	return(
		gleam_roundRect.create(
			'pos', oZone.pos,
			'width', oZone.width,
			'height', oZone.height,
			'a', gruga_frame.handleSize / 2,
			'b', gruga_frame.handleSize / 2
		)
	);
};


/*
| Handle glint in N.
*/
def.lazy._shapeHandleN =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	return(
		visual_frame.handle.create(
			'pos', this._outerZone.pn.add( -gruga_frame.handleSize / 2, 0 )
		)
	);
};


/*
| Handle glint in Ne.
*/
def.lazy._shapeHandleNe =
	function( )
{
	return(
		visual_frame.handle.create(
			'pos', this._outerZone.pne.add( -gruga_frame.handleSize, 0 )
		)
	);
};


/*
| Handle glint in Nw.
*/
def.lazy._shapeHandleNw =
	function( )
{
	return visual_frame.handle.create( 'pos', this._outerZone.pos );
};


/*
| Handle glint in E.
*/
def.lazy._shapeHandleE =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	return(
		visual_frame.handle.create(
			'pos', this._outerZone.pe.add( -gruga_frame.handleSize, -gruga_frame.handleSize / 2 )
		)
	);
};


/*
| Handle glint in S.
*/
def.lazy._shapeHandleS =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	return(
		visual_frame.handle.create(
			'pos', this._outerZone.ps.add( -gruga_frame.handleSize / 2, -gruga_frame.handleSize ),
		)
	);
};


/*
| Handle glint in Se.
*/
def.lazy._shapeHandleSe =
	function( )
{
	return(
		visual_frame.handle.create(
			'pos', this._outerZone.pse.add( -gruga_frame.handleSize, -gruga_frame.handleSize )
		)
	);
};


/*
| Handle glint in Sw.
*/
def.lazy._shapeHandleSw =
	function( )
{
	return(
		visual_frame.handle.create(
			'pos', this._outerZone.psw.add( 0, -gruga_frame.handleSize )
		)
	);
};


/*
| Handle glint in W.
*/
def.lazy._shapeHandleW =
	function( )
{
/**/if( CHECK )
/**/{
/**/	if( this.proportional ) throw new Error( );
/**/}

	return(
		visual_frame.handle.create(
			'pos', this._outerZone.pw.add( 0, -gruga_frame.handleSize / 2 ),
		)
	);
};


/*
| Outer zone.
|
| Framed objects plus frame width.
*/
def.lazy._outerZone =
	function( )
{
	const fw = gruga_frame.width;

	const tZone = this.zone.transform( this.transform );

	const hw = tZone.width / 2;

	const hh = tZone.height / 2;

	const min = gruga_frame.handleSize / 2 * ( this.proportional ? 2.5 : 3.5 );

	return(
		gleam_rect.create(
			'pos',
				tZone.pc.add(
					Math.min( -hw - fw, -min ),
					Math.min( -hh - fw, -min )
				),
			'width', 2 * Math.max( hw + fw, min ),
			'height', 2 * Math.max( hh + fw, min )
		)
	);
};


/*
| Checks if the frame has been clicked.
*/
def.proto.click =
	function(
		p,        // cursor point
		shift,    // true if shift key was pressed
		ctrl      // true if ctrl key was pressed
	)
{
	// ctrl-clicks are not swallowed.
	if( ctrl ) return false;

	// not been clicked, pass through
	if( !this._frameBodyShape.within( p ) || this._shapeMask.within( p ) ) return;

	// it has been clicked, yet do nothing.
	return true;
};


/*
| Starts an operation with the pointing device held down.
*/
def.proto.dragStart =
	function(
		p,      // cursor point
		shift,  // true if shift key was pressed
		ctrl    // true if ctrl key was pressed
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	if( this.access !== 'rw' ) return;

	const zone = this.zone;

	if( !this._frameBodyShape.within( p ) || this._shapeMask.within( p ) ) return;

	let com, pBase;

	if( this._shapeHandleNw.within( p ) )
	{
		com = compass.nw;
		pBase = zone.pse;
	}
	else if( this._shapeHandleNe.within( p ) )
	{
		com = compass.ne;
		pBase = zone.psw;
	}
	else if( this._shapeHandleSe.within( p ) )
	{
		com = compass.se;
		pBase = zone.pos;
	}
	else if( this._shapeHandleSw.within( p ) )
	{
		com = compass.sw;
		pBase = zone.pne;
	}
	else if( !this.proportional )
	{
		if( this._shapeHandleN.within( p ) )
		{
			com = compass.n;
			pBase = zone.ps;
		}
		else if( this._shapeHandleE.within( p ) )
		{
			com = compass.e;
			pBase = zone.pw;
		}
		else if( this._shapeHandleS.within( p ) )
		{
			com = compass.s;
			pBase = zone.pn;
		}
		else if( this._shapeHandleW.within( p ) )
		{
			com = compass.w;
			pBase = zone.pe;
		}
	}

	const dp = p.detransform( this.transform );

	if( com )
	{
		root.alter(
			'action',
				action_resizeItems.create(
					'items', this.content,
					'startZone', zone,
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

	root.alter(
		'action',
			action_dragItems.create(
				'items', this.content,
				'moveBy', gleam_point.zero,
				'startPoint', dp,
				// FIXME move this.zone logic into itemSet
				// so it becomes this.content.zone
				'startZone', this.zone
			)
	);

	return true;
};


/*
| Mouse hover.
|
| Returns true if the pointing device hovers over anything.
*/
def.proto.pointingHover =
	function(
		p
	)
{
	if( !this._frameBodyShape.within( p ) || this._shapeMask.within( p ) ) return;

	// FIXME use compass

	if( this._shapeHandleNw.within( p ) ) return compass.nw.resizeHoverCursor;
	else if( this._shapeHandleNe.within( p ) ) return compass.ne.resizeHoverCursor;
	else if( this._shapeHandleSe.within( p ) ) return compass.se.resizeHoverCursor;
	else if( this._shapeHandleSw.within( p ) ) return compass.sw.resizeHoverCursor;
	else if( !this.proportional )
	{
		if( this._shapeHandleN.within( p ) ) return compass.n.resizeHoverCurosr;
		if( this._shapeHandleE.within( p ) ) return compass.e.resizeHoverCursor;
		if( this._shapeHandleS.within( p ) ) return compass.s.resizeHoverCursor;
		if( this._shapeHandleW.within( p ) ) return compass.w.resizeHoverCurosr;
	}

	return result_hover.cursorGrab;
};


} );
