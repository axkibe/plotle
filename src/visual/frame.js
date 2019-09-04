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

		// should show guides
		hasGuides : { type : 'boolean' },

		// current transform of the frame
		transform : { type : '../gleam/transform' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};
}


const action_dragItems = tim.require( '../action/dragItems' );
const action_resizeItems = tim.require( '../action/resizeItems' );
const compass = tim.require( '../compass/root' );
const gleam_glint_border = tim.require( '../gleam/glint/border' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_glint_mask = tim.require( '../gleam/glint/mask' );
const gleam_glint_paint = tim.require( '../gleam/glint/paint' );
const gleam_line = tim.require( '../gleam/line' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_rect = tim.require( '../gleam/rect' );
const gleam_shape = tim.require( '../gleam/shape' );
const gleam_shapeList = tim.require( '../gleam/shapeList' );
const gleam_shape_start = tim.require( '../gleam/shape/start' );
const gleam_shape_line = tim.require( '../gleam/shape/line' );
const gleam_shape_round = tim.require( '../gleam/shape/round' );
const gruga_frame = tim.require( '../gruga/frame' );
const result_hover = tim.require( '../result/hover' );


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
	if( ctrl ) return;

	// swallows clicks on the extender
	if( this._shapeExtender.within( p ) ) return;

	// not even near pass trough?
	if( !this._outerZone.within( p ) ) return;

	// in the mask? pass through
	if( this._shapeMask.within( p ) ) return;

	// anything of the frame is clicked? absorbs it
	if( this._tZone.within( p )
		|| this._shapeHandleNw.within( p )
		|| this._shapeHandleN.within( p )
		|| this._shapeHandleNe.within( p )
		|| this._shapeHandleE.within( p )
		|| this._shapeHandleSe.within( p )
		|| this._shapeHandleS.within( p )
		|| this._shapeHandleSw.within( p )
		|| this._shapeHandleW.within( p )
	) return true;

	// otherwise pass through
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

	const wex = this._shapeExtender.within( p );

	// if not even near or within the mask, pass through
	if( !wex && !this._outerZone.within( p ) || this._shapeMask.within( p ) ) return;

	let com, pBase;

	// dradding the inner body starts to drag the items
	if( wex || this._tZone.within( p ) )
	{
		const dp = p.detransform( this.transform );

		root.alter(
			'action',
				action_dragItems.create(
					'items', this.content,
					'moveBy', gleam_point.zero,
					'startPoint', dp,
					'startZone', this.zone
				)
		);

		return true;
	}

	if( this._shapeHandleNw.within( p ) )
	{ com = compass.nw; pBase = zone.pse; }
	else if( this._shapeHandleNe.within( p ) )
	{ com = compass.ne; pBase = zone.psw; }
	else if( this._shapeHandleSe.within( p ) )
	{ com = compass.se; pBase = zone.pos; }
	else if( this._shapeHandleSw.within( p ) )
	{ com = compass.sw; pBase = zone.pne; }
	else if( this._shapeHandleN.within( p ) )
	{ com = compass.n; pBase = zone.ps; }
	else if( this._shapeHandleE.within( p ) )
	{ com = compass.e; pBase = zone.pw; }
	else if( this._shapeHandleS.within( p ) )
	{ com = compass.s; pBase = zone.pn; }
	else if( this._shapeHandleW.within( p ) )
	{ com = compass.w; pBase = zone.pe; }

	if( !com ) return;

	const dp = p.detransform( this.transform );

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
};


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
			'reversed', true
		)
	);
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
	if( !this._outerZone.within( p ) || this._shapeMask.within( p ) ) return;

	if( this._tZone.within( p ) || this._shapeExtender.within( p ) )
	{
		return result_hover.cursorGrab;
	}

	if( this._shapeHandleNw.within( p ) ) return compass.nw.resizeHoverCursor;
	if( this._shapeHandleNe.within( p ) ) return compass.ne.resizeHoverCursor;
	if( this._shapeHandleSe.within( p ) ) return compass.se.resizeHoverCursor;
	if( this._shapeHandleSw.within( p ) ) return compass.sw.resizeHoverCursor;
	if( this._shapeHandleN.within( p ) ) return compass.n.resizeHoverCursor;
	if( this._shapeHandleE.within( p ) ) return compass.e.resizeHoverCursor;
	if( this._shapeHandleS.within( p ) ) return compass.s.resizeHoverCursor;
	if( this._shapeHandleW.within( p ) ) return compass.w.resizeHoverCursor;
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
	return this.content.zone;
};


/*
| The frame glint holding all stuff unmasked.
*/
def.lazy._glintFrame =
	function( )
{
	const hfc = gruga_frame.handleFacetCorner;

	const glintFrameBody =
		gleam_glint_paint.createFacetShape( gruga_frame.facet, this._tZone );

	const glintHandleNe = gleam_glint_paint.createFacetShape( hfc, this._shapeHandleNe );
	const glintHandleNw = gleam_glint_paint.createFacetShape( hfc, this._shapeHandleNw );
	const glintHandleSe = gleam_glint_paint.createFacetShape( hfc, this._shapeHandleSe );
	const glintHandleSw = gleam_glint_paint.createFacetShape( hfc, this._shapeHandleSw );

	const a = [ glintFrameBody, glintHandleNe, glintHandleNw, glintHandleSe, glintHandleSw ];

	const hfs =
		this.proportional
		? gruga_frame.handleFacetSideProportional
		: gruga_frame.handleFacetSideArbitrary;

	const glintHandleE = gleam_glint_paint.createFacetShape( hfs, this._shapeHandleE );
	const glintHandleN = gleam_glint_paint.createFacetShape( hfs, this._shapeHandleN );
	const glintHandleS = gleam_glint_paint.createFacetShape( hfs, this._shapeHandleS );
	const glintHandleW = gleam_glint_paint.createFacetShape( hfs, this._shapeHandleW );

	a.push( glintHandleN, glintHandleE, glintHandleS, glintHandleW );

	const tZone = this._tZone;

	if( this.hasGuides )
	{
		const iGuide = gruga_frame.innerGuide;
		const oGuide = gruga_frame.outerGuide;

		const pn = tZone.pn;
		const pos = tZone.pos;
		const pse = tZone.pse;
		const pw = tZone.pw;

		a.push(
			// north guide
			gleam_glint_border.createFacetShape(
				oGuide,
				gleam_line.createP1P2(
					pos.create( 'x', 0 ),
					pos.create( 'x', this.viewSize.width )
				)
			),
			// south guide
			gleam_glint_border.createFacetShape(
				oGuide,
				gleam_line.createP1P2(
					pse.create( 'x', 0 ),
					pse.create( 'x', this.viewSize.width )
				)
			),
			// west guide
			gleam_glint_border.createFacetShape(
				oGuide,
				gleam_line.createP1P2(
					pos.create( 'y', 0 ),
					pos.create( 'y', this.viewSize.height )
				)
			),
			// east guide
			gleam_glint_border.createFacetShape(
				oGuide,
				gleam_line.createP1P2(
					pse.create( 'y', 0 ),
					pse.create( 'y', this.viewSize.height )
				)
			),
			// vertical guide
			gleam_glint_border.createFacetShape(
				iGuide,
				gleam_line.createP1P2(
					pn.create( 'y', 0 ),
					pn.create( 'y', this.viewSize.height )
				)
			),
			// horizontal guide
			gleam_glint_border.createFacetShape(
				iGuide,
				gleam_line.createP1P2(
					pw.create( 'x', 0 ),
					pw.create( 'x', this.viewSize.width )
				)
			)
		);
	}

	a.push(
		gleam_glint_paint.createFacetShape( gruga_frame.facet, this._shapeExtender )
	);

	return gleam_glint_list.create( 'list:init', a );
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

	const tZone = this._tZone;

	return(
		gleam_rect.create(
			'pos', tZone.pos.add( -fw, -fw ),
			'width', tZone.width + 2 * fw,
			'height', tZone.height + 2 * fw
		)
	);
};


/*
| Extender handle shape.
*/
def.lazy._shapeExtender =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;

	const r = gruga_frame.rounding;
	const ew = gruga_frame.extenderWidth;
	const er = gruga_frame.extenderRounding;

	return(
		gleam_shape.create(
			'pc', tz.pos,
			'list:init',
			[
			// starts at nw corner
			gleam_shape_start.createP(
				gleam_point.createXY( oz.pos.x - ew, oz.pos.y - ew + er )
			),
			// goes around nw corner
			gleam_shape_round.createP(
				gleam_point.createXY( oz.pos.x - ew + er, oz.pos.y - ew )
			),
			// north line
			gleam_shape_line.createP(
				gleam_point.createXY( oz.pne.x + ew - er, oz.pne.y - ew )
			),
			// goes around ne corner
			gleam_shape_round.createP(
				gleam_point.createXY( oz.pne.x + ew, oz.pne.y - ew + er )
			),
			// east line
			gleam_shape_line.createP(
				gleam_point.createXY( oz.pse.x + ew, oz.pse.y + ew - er )
			),
			// goes around se corner
			gleam_shape_round.createP(
				gleam_point.createXY( oz.pse.x + ew - er, oz.pse.y + ew )
			),
			// south line
			gleam_shape_line.createP(
				gleam_point.createXY( oz.psw.x - ew + er, oz.psw.y + ew )
			),
			// goes around sw corner
			gleam_shape_round.createP(
				gleam_point.createXY( oz.psw.x - ew, oz.psw.y + ew - er )
			),
			// back to start for outer
			gleam_shape_line.createP(
				gleam_point.createXY( oz.pos.x - ew, oz.pos.y - ew + er )
			),
			// flies to inner, ne point of NW handle
			gleam_shape_line.createPFly( gleam_point.createXY( oz.pos.x + r, oz.pos.y ) ),
			// follows the NW handle
			gleam_shape_round.createPCcw( gleam_point.createXY( oz.pos.x, oz.pos.y + r ) ),
			// goes to SW handle
			gleam_shape_line.createP( gleam_point.createXY( oz.psw.x, oz.psw.y - r ) ),
			// follows the SW handle
			gleam_shape_round.createPCcw( gleam_point.createXY( oz.psw.x + r, oz.psw.y ) ),
			// goes to SE handle
			gleam_shape_line.createP( gleam_point.createXY( oz.pse.x - r, oz.pse.y ) ),
			// follows the SE handle
			gleam_shape_round.createPCcw( gleam_point.createXY( oz.pse.x, oz.pse.y -r ) ),
			// goes to NE handle
			gleam_shape_line.createP( gleam_point.createXY( oz.pne.x, oz.pne.y + r ) ),
			// follows the NE handle
			gleam_shape_round.createPCcw( gleam_point.createXY( oz.pne.x - r, oz.pne.y ) ),
			// goes to NW handle
			gleam_shape_line.createP( gleam_point.createXY( oz.pos.x + r, oz.pos.y ) ),
			// follows the NW handle
			gleam_shape_round.createPCcw( gleam_point.createXY( oz.pos.x, oz.pos.y + r ) ),
			// closes to upper left corner
			gleam_shape_line.closeFly
			]
		)
	);
};

/*
| North handle shape.
*/
def.lazy._shapeHandleN =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;

	return(
		gleam_rect.create(
			'pos', gleam_point.createXY( tz.pos.x, oz.pos.y ),
			'width', tz.width,
			'height', gruga_frame.width
		)
	);
};


/*
| North-east handle shape.
*/
def.lazy._shapeHandleNe =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;
	const r = gruga_frame.rounding;

	return(
		gleam_shape.create(
			'pc', tz.pos,
			'list:init',
			[
			gleam_shape_start.createP( gleam_point.createXY( tz.pne.x, oz.pne.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.pne.x - r, oz.pne.y ) ),
			gleam_shape_round.createP( gleam_point.createXY( oz.pne.x, oz.pne.y + r ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.pne.x, tz.pne.y ) ),
			gleam_shape_line.createP( tz.pne ),
			gleam_shape_line.close
			]
		)
	);
};


/*
| North-west handle shape.
*/
def.lazy._shapeHandleNw =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;
	const r = gruga_frame.rounding;

	return(
		gleam_shape.create(
			'pc', tz.pos,
			'list:init',
			[
			gleam_shape_start.createP( gleam_point.createXY( oz.pos.x, tz.pos.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.pos.x, oz.pos.y + r ) ),
			gleam_shape_round.createP( gleam_point.createXY( oz.pos.x + r, oz.pos.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( tz.pos.x, oz.pos.y ) ),
			gleam_shape_line.createP( tz.pos ),
			gleam_shape_line.close
			]
		)
	);
};


/*
| East handle shape.
*/
def.lazy._shapeHandleE =
	function( )
{
	const tz = this._tZone;

	return(
		gleam_rect.create(
			'pos', tz.pne,
			'width', gruga_frame.width,
			'height', tz.height
		)
	);
};


/*
| South handle shape.
*/
def.lazy._shapeHandleS =
	function( )
{
	const tz = this._tZone;

	return(
		gleam_rect.create(
			'pos', tz.psw,
			'width', tz.width,
			'height', gruga_frame.width
		)
	);
};


/*
| South-east handle shape.
*/
def.lazy._shapeHandleSe =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;
	const r = gruga_frame.rounding;

	return(
		gleam_shape.create(
			'pc', tz.pos,
			'list:init',
			[
			gleam_shape_start.createP( gleam_point.createXY( oz.pse.x, tz.pse.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.pse.x, oz.pse.y - r ) ),
			gleam_shape_round.createP( gleam_point.createXY( oz.pse.x - r, oz.pse.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( tz.pse.x, oz.pse.y ) ),
			gleam_shape_line.createP( tz.pse ),
			gleam_shape_line.close
			]
		)
	);
};


/*
| South-west handle shape.
*/
def.lazy._shapeHandleSw =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;
	const r = gruga_frame.rounding;

	return(
		gleam_shape.create(
			'pc', tz.pos,
			'list:init',
			[
			gleam_shape_start.createP( gleam_point.createXY( tz.psw.x, oz.psw.y ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.psw.x + r, oz.psw.y ) ),
			gleam_shape_round.createP( gleam_point.createXY( oz.psw.x, oz.psw.y - r ) ),
			gleam_shape_line.createP( gleam_point.createXY( oz.psw.x, tz.psw.y ) ),
			gleam_shape_line.createP( tz.psw ),
			gleam_shape_line.close
			]
		)
	);
};


/*
| West handle shape.
*/
def.lazy._shapeHandleW =
	function( )
{
	const oz = this._outerZone;
	const tz = this._tZone;

	return(
		gleam_rect.create(
			'pos', gleam_point.createXY( oz.pos.x, tz.pos.y ),
			'width', gruga_frame.width,
			'height', tz.height
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
		arr.push( ca.tShape.border( -1 ) );
	}

	return gleam_shapeList.create( 'list:init', arr );
};


/*
| Transformed zone.
*/
def.lazy._tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


} );
