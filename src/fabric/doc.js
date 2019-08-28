/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, ( def, fabric_doc ) => {


def.extend = './fiber';


if( TIM )
{
	def.attributes =
	{
		// the visible size of the doc, defaults to fullsize
		// no json thus not saved or transmitted
		clipsize : { type : [ 'undefined', '../gleam/size' ] },

		// width available to fill( 0 for labels is infinite )
		// no json thus not saved or transmitted
		flowWidth : { type : [ 'undefined', 'number' ] },

		// size of the font
		// no json thus not saved or transmitted
		fontsize : { type : [ 'undefined', 'number' ] },

		// inner margin of the doc
		// no json thus not saved or transmitted
		innerMargin : { type : [ 'undefined', '../gleam/margin' ] },

		// vertical seperation of paragraphs
		// no json thus not saved or transmitted
		paraSep : { type : [ 'undefined', 'number' ] },

		// scroll position of the doc
		// no json thus not saved or transmitted
		scrollPos : { type : [ 'undefined', '../gleam/point' ] },

		// the trace of the doc
		// no json thus not saved or transmitted
		trace : { type : [ 'undefined', '../trace/doc' ] },
	};

	def.json = 'doc';

	def.twig = [ './para' ];
}


const fabric_para = tim.require( './para' );
const gleam_facet = tim.require( '../gleam/facet' );
const gleam_font_root = tim.require( '../gleam/font/root' );
const gleam_glint_border = tim.require( '../gleam/glint/border' );
const gleam_glint_paint = tim.require( '../gleam/glint/paint' );
const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_line = tim.require( '../gleam/line' );
const gleam_point = tim.require( '../gleam/point' );
const gleam_shape = tim.require( '../gleam/shape' );
const gleam_shapeList = tim.require( '../gleam/shapeList' );
const gleam_shape_line = tim.require( '../gleam/shape/line' );
const gleam_shape_start = tim.require( '../gleam/shape/start' );
const gleam_size = tim.require( '../gleam/size' );
const gruga_fontFace = tim.require( '../gruga/fontFace' );
const gruga_selection = tim.require( '../gruga/selection' );
const mark_caret = tim.require( '../mark/caret' );
const mark_range = tim.require( '../mark/range' );


/*
| Returns the attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	if( !this.mark || !this.mark.hasCaret ) return 0;

	const key = this.mark.caretOffset.tracePara.key;

	return this.get( key ).attentionCenter;
};


/*
| The visible size of the doc.
|
| If created with undefined,
| it is set to equal to fullsize
*/
def.adjust.clipsize =
	function(
		clipsize
	)
{
	return clipsize || this.fullsize;
};


/*
| The default font for the document.
*/
def.lazy.font =
	function( )
{
	return gruga_fontFace.standard( this.fontsize );
};


/*
| Full size of the doc.
|
| Disregards clipping in notes.
*/
def.lazy.fullsize =
	function( )
{
	let height = 0;

	let width = 0;

	const max = Math.max;

	const fs = this.fontsize;

	const paraSep = this.paraSep;

	let first = true;

	for( let para of this )
	{
		const flow = para.flow;

		width = max( width, flow.width );

		if( !first ) height += paraSep;
		else first = false;

		height += flow.height;
	}

	height += Math.round( fs * gleam_font_root.bottomBox );

	return gleam_size.wh( width, height );
};


/*
| Forwards the trace to paras.
*/
def.adjust.get =
	function(
		key,
		para
	)
{
	// FUTURE why?
	if( !para ) return;

	let mark, pos, y;

	const trace = this.trace && this.trace.appendPara( key );

	if( VISUAL )
	{
		const innerMargin = this.innerMargin;

		const rank = this.rankOf( key );

/**/	if( CHECK )
/**/	{
/**/		if( rank < 0 ) throw new Error( );
/**/	}

		if( rank > 0 )
		{
			const prev = this.atRank( rank - 1 );

			y = prev.pos.y + prev.flow.height + this.paraSep;
		}
		else
		{
			y = innerMargin.n - this.scrollPos.y;
		}

		pos = gleam_point.createXY( innerMargin.w, y );

		mark = fabric_para.concernsMark( this.mark, trace );
	}

	return(
		para.create(
			'flowWidth', this.flowWidth,
			'fontsize', this.fontsize,
			'mark', mark,
			'pos', pos,
			'trace', trace,
			'transform', this.transform
		)
	);
};


/*
| Returns the paragraph at point
*/
def.proto.getParaAtPoint =
	function(
		p
	)
{
	if( p.y < this.innerMargin.n ) return this.atRank( 0 );

	for( let para of this )
	{
		if( p.y < para.pos.y + para.flow.height ) return para;
	}
};


/*
| Return the doc's glint.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	const mark = this.mark;

	if( mark && mark.timtype === mark_range && mark.encompasses( this.trace ) )
	{
		arr.push(
			gleam_glint_paint.createFacetShape(
				gruga_selection.facet,
				this._rangeShape.transform( this.transform.ortho )
			)
		);
	}
	else if( mark && mark.timtype === mark_caret && mark.focus )
	{
		arr.push( this._caretGlint );
	}

	for( let para of this ) arr.push( para.glint );

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| A text has been inputed.
*/
def.proto.input =
	function(
		text  // text inputed
	)
{
	const mark = this.mark;

	const caretOffset = this.mark.caretOffset;

	if( !caretOffset ) return false;

	if( mark.timtype === mark_range && !mark.empty )
	{
		root.removeRange( mark );

		// FUTURE this is an akward workaround

		root.input( text );

		return true;
	}

	return this.get( caretOffset.tracePara.key ).input( text );
};


/*
| True if all paras are effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	for( let para of this )
	{
		if( !para.isBlank ) return false;
	}

	return true;
};



/*
| Handles a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	const mark = this.mark;

	if( !mark.hasCaret ) return false;

	if( mark.timtype === mark_range && !mark.empty )
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				root.removeRange( mark );

				return true;

			case 'enter' :

				root.removeRange( mark );

				// FUTURE this is a bit akward

				root.specialKey( key, shift, ctrl );

				return true;
		}
	}

	return(
		this
		.get( mark.caretOffset.tracePara.key )
		.specialKey( key, this, shift, ctrl )
	);
};


/*
| Glint for the caret.
*/
def.lazy._caretGlint =
	function( )
{
	const caretOffset = this.mark.caretOffset;

	const transform = this.transform.ortho;

	const key = caretOffset.tracePara.key;

	const para = this.get( key );

	const fs = this.fontsize;

	const descend = fs * gleam_font_root.bottomBox;

	let p = para.locateOffsetPoint( caretOffset.at );

	const ppos = para.pos;

	p = transform.point( ppos.x + p.x, ppos.y + p.y - fs );

	return(
		gleam_glint_border.create(
			'facet', gleam_facet.blackStroke,
			'shape',
				gleam_line.create(
					'p1', p,
					'p2', p.add( 0, transform.scale( fs + descend ) )
				)
		)
	);
};


/*
| Returns the shape for the selection range.
*/
def.lazy._rangeShape =
	function( )
{
	const mark = this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.timtype !== mark_range ) throw new Error( );
/**/}

	const frontOffset = mark.frontOffset;

	const backOffset = mark.backOffset;

	const frontKey = frontOffset.tracePara.key;

	const backKey = backOffset.tracePara.key;

	const frontPara = this.get( frontKey );

	const backPara = this.get( backKey );

	const frontPos = frontPara.pos;

	const backPos = backPara.pos;

	let fp = frontPara.locateOffsetPoint( frontOffset.at );

	let bp = backPara.locateOffsetPoint( backOffset.at );

	const fLine = frontPara.locateOffsetLine( frontOffset.at );

	const bLine = backPara.locateOffsetLine( backOffset.at );

	const fontsize = this.fontsize;

	const descend = Math.round( fontsize * gleam_font_root.bottomBox );

	const ascend = Math.round( fontsize );

	const innerMargin = this.innerMargin;

	const rx = this.clipsize.width - innerMargin.e;

	const lx = innerMargin.w;

	// FUTURE do not create points

	fp = fp.add( frontPos.x, frontPos.y );

	bp = bp.add( backPos.x, backPos.y );

	const frontFlow = frontPara.flow;

	const backFlow = backPara.flow;

	const frontRank = this.rankOf( frontKey );

	const f2Key =
		( frontRank + 1 < this.length )
		? this.getKey( frontRank + 1 )
		: undefined;

	const f2Para = f2Key && this.get( f2Key );

	if( frontKey === backKey && fLine === bLine )
	{
		// fp o******o bp
		const sections =
		[
			gleam_shape_start.createP( fp.add( 0, descend ) ),
			gleam_shape_line.createP( fp.add( 0, -ascend ) ),
			gleam_shape_line.createP( bp.add( 0, -ascend ) ),
			gleam_shape_line.createP( bp.add( 0, descend ) ),
			gleam_shape_line.close
		];

		return(
			gleam_shape.create(
				'list:init', sections,
				'pc', gleam_point.createXY( ( fp.x + bp.x ) / 2, ( fp.y + bp.y ) / 2 )
			)
		);
	}
	else if (
		bp.x < fp.x
		&& (
			frontKey === backKey && fLine + 1 === bLine
			|| (
				f2Key === backKey
				&& fLine + 1 >= frontFlow.length
				&& bLine === 0
			)
		)
	)
	{
		//         fp o****
		// ****o bp

		const sections =
		[
			gleam_shape_start.createXY( rx, fp.y - ascend ),
			gleam_shape_line.createXY( fp.x, fp.y - ascend ),
			gleam_shape_line.createXY( fp.x, fp.y + descend ),
			gleam_shape_line.createXY( rx, fp.y + descend ),
			gleam_shape_line.closeFly
		];

		const sections2 =
		[
			gleam_shape_start.createXY( lx, bp.y - ascend ),
			gleam_shape_line.createXY( bp.x, bp.y - ascend ),
			gleam_shape_line.createXY( bp.x, bp.y + descend ),
			gleam_shape_line.createXY( lx, bp.y + descend ),
			gleam_shape_line.closeFly
		];

		const shapes =
		[
			gleam_shape.create(
				'list:init', sections,
				'pc',
					gleam_point.createXY(
						( fp.x + rx ) / 2,
						( 2 * fp.y - ascend + descend ) / 2
					)
			),
			gleam_shape.create(
				'list:init', sections2,
				'pc',
					gleam_point.createXY(
						( fp.x + rx ) / 2,
						( 2 * fp.y - ascend + descend ) / 2
					)
			)
		];

		return gleam_shapeList.create( 'list:init', shapes );
	}
	else
	{
		//          6/7            8
		//        fp o------------+
		// fp2  +----+:::::::::::::
		//    5 :::::::::::::::::::
		//      ::::::::::::+-----+  bp2
		//      +-----------o bp   1
		//      4          2/3

		let f2y, b2y;

		if( fLine + 1 < frontFlow.length )
		{
			f2y = frontFlow.get( fLine + 1 ).y + frontPos.y;
		}
		else
		{
			f2y = f2Para.flow.get( 0 ).y + f2Para.pos.y;
		}

		if( bLine > 0 )
		{
			b2y = backFlow.get( bLine - 1 ).y + backPos.y;
		}
		else
		{
			const backRank = this.rankOf( backKey );

			const b2Key = this.getKey( backRank - 1 );

			const b2Para = this.get( b2Key );

			b2y =
				b2Para.flow.get( b2Para.flow.length - 1 ).y
				+ b2Para.pos.y;
		}

		if( frontOffset.at > 0 )
		{
			const sections =
			[
				gleam_shape_start.createXY( rx, b2y + descend ),    // 1
				gleam_shape_line.createXY( bp.x, b2y + descend ),   // 2
				gleam_shape_line.createXY( bp.x, bp.y + descend ),  // 3
				gleam_shape_line.createXY( lx, bp.y + descend ),    // 4
				gleam_shape_line.createXYFly( lx, f2y - ascend ),   // 5
				gleam_shape_line.createXY( fp.x, f2y - ascend ),    // 6
				gleam_shape_line.createXY( fp.x, fp.y - ascend ),   // 7
				gleam_shape_line.createXY( rx, fp.y - ascend ),     // 8
				gleam_shape_line.closeFly
			];

			return(
				gleam_shape.create(
					'list:init', sections,
					'pc',
						gleam_point.createXY(
							( rx + lx ) / 2,
							( b2y + descend + f2y - ascend ) / 2
						)
				)
			);
		}
		else
		{
			const sections =
			[
				gleam_shape_start.createXY( rx, b2y + descend ),   // 1
				gleam_shape_line.createXY( bp.x, b2y + descend ),  // 2
				gleam_shape_line.createXY( bp.x, bp.y + descend ), // 3
				gleam_shape_line.createXY( lx, bp.y + descend ),   // 4
				gleam_shape_line.createXYFly( lx, fp.y - ascend ), // 7
				gleam_shape_line.createXY( rx, fp.y - ascend ),    // 8
				gleam_shape_line.closeFly
			];

			return(
				gleam_shape.create(
					'list:init', sections,
					'pc',
						gleam_point.createXY(
							( rx + lx ) / 2,
							( b2y + descend + f2y - ascend ) / 2
						)
				)
			);
		}
	}
};


} );
