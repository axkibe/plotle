/*
| The alteration frame.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// current users access level
		access : { type : 'string' },

		// content of the frame
		content : { type : './itemList' },

		// current transform of the frame
		transform : { type : '../gleam/transform' },
	};
}


const action_dragItems = require( '../action/dragItems' );

const action_resizeItems = require( '../action/resizeItems' );

const compass = require( '../compass/root' );

const gleam_ellipse = require( '../gleam/ellipse' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_mask = require( '../gleam/glint/mask' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_point = require( '../gleam/point' );

const gleam_rect = require( '../gleam/rect' );

const gleam_roundRect = require( '../gleam/roundRect' );

const gleam_shapeList = require( '../gleam/shapeList' );

const gruga_frame = require( '../gruga/frame' );

const result_hover = require( '../result/hover' );


const handleSize = gruga_frame.handleSize;

const handleSize2 = handleSize / 2;


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
	const content = this.content;

	for( let a = 0, al = content.length; a < al; a++ )
	{
		if( content.get( a ).proportional ) return true;
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

	const cLen = content.length;

/**/if( CHECK )
/**/{
/**/	if ( cLen === 0 ) throw new Error( );
/**/}

	let cZone = content.get( 0 ).zone;

	if( cLen === 1 ) return cZone;

	let pos = cZone.pos;

	let ny = pos.y;

	let wx = pos.x;

	let sy = pos.y + cZone.height;

	let ex = pos.x + cZone.width;

	for( let a = 1; a < cLen; a++ )
	{
		cZone = content.get( a ).zone;

		pos = cZone.pos;

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
	const content = this.content;

/**/if( CHECK )
/**/{
/**/	if( content.length === 0 ) throw new Error( );
/**/}

	const arr = [ ];

	for( let a = 0, al = content.length; a < al; a++ )
	{
		const ca = content.get( a );

		// FIXME XXX privacy violation!
		arr.push( ca._tShape( ).border( -12 ) );
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
			'a', handleSize / 2,
			'b', handleSize / 2
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
		gleam_ellipse.create(
			'pos', this._outerZone.pn.add( -handleSize2, 0 ),
			'width', handleSize,
			'height', handleSize
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
		gleam_ellipse.create(
			'pos', this._outerZone.pne.add( -handleSize, 0 ),
			'width', handleSize,
			'height', handleSize
		)
	);
};


/*
| Handle glint in Nw.
*/
def.lazy._shapeHandleNw =
	function( )
{
	return(
		gleam_ellipse.create(
			'pos', this._outerZone.pos,
			'width', handleSize,
			'height', handleSize
		)
	);
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
		gleam_ellipse.create(
			'pos', this._outerZone.pe.add( -handleSize, -handleSize2 ),
			'width', handleSize,
			'height', handleSize
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
		gleam_ellipse.create(
			'pos', this._outerZone.ps.add( -handleSize2, -handleSize ),
			'width', handleSize,
			'height', handleSize
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
		gleam_ellipse.create(
			'pos', this._outerZone.pse.add( -handleSize, -handleSize ),
			'width', handleSize,
			'height', handleSize
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
		gleam_ellipse.create(
			'pos', this._outerZone.psw.add( 0, -handleSize ),
			'width', handleSize,
			'height', handleSize
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
		gleam_ellipse.create(
			'pos', this._outerZone.pw.add( 0, -handleSize2 ),
			'width', handleSize,
			'height', handleSize
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

	const min = handleSize2 * ( this.proportional ? 2.5 : 3.5 );

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
		root.create(
			'action',
				action_resizeItems.create(
					'itemPaths', this.content.itemPaths,
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

	root.create(
		'action',
			action_dragItems.create(
				'moveBy', gleam_point.zero,
				'itemPaths', this.content.itemPaths,
				'startPoint', dp,
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
