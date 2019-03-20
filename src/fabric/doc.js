/*
| A sequence of paragraphs.
*/
'use strict';


tim.define( module, ( def, fabric_doc ) => {


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

		// the users mark
		// no json thus not saved or transmitted
		mark : { type : [ 'undefined', '< ../visual/mark/types' ] },

		// the path of the doc
		// no json thus not saved or transmitted
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// vertical seperation of paragraphs
		// no json thus not saved or transmitted
		paraSep : { type : [ 'undefined', 'number' ] },

		// scroll position of the doc
		// no json thus not saved or transmitted
		scrollPos : { type : [ 'undefined', '../gleam/point' ] },

		// the current space transform
		// no json thus not saved or transmitted
		transform : { type : [ 'undefined', '../gleam/transform' ] },
	};

	def.json = 'fabric_doc';

	def.twig = [ './para' ];
}

const fabric_para = tim.require( '../fabric/para' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_font_font = tim.require( '../gleam/font/font' );

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

const gruga_font = tim.require( '../gruga/font' );

const gruga_selection = tim.require( '../gruga/selection' );

const visual_mark_caret = tim.require( '../visual/mark/caret' );

const visual_mark_range = tim.require( '../visual/mark/range' );


/*
| Returns the attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	if( !this.mark || !this.mark.hasCaret ) return 0;

	const path = this.mark.caret.path;

	const key = path.get( 5 ); // FUTURE

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
	return gruga_font.standard( this.fontsize );
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

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const para = this.atRank( a );

		const flow = para.flow;

		width = max( width, flow.width );

		if( a > 0 ) height += paraSep;

		height += flow.height;
	}

	height += Math.round( fs * gleam_font_font.bottomBox );

	return gleam_size.wh( width, height );
};


/*
| Forwards the path to paras.
*/
def.adjust.get =
	function(
		key,
		para
	)
{
	// FIXME why?
	if( !para ) return;

	//const path = para.path || ( this.path && this.path.append( 'twig' ).appendNC( key ) );
	// Xxx?
	const path = ( this.path && this.path.append( 'twig' ).appendNC( key ) );

	let mark, pos, y;

	if( !NODE )
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

		pos = gleam_point.xy( innerMargin.w, y );

		mark = fabric_para.concernsMark( this.mark, path );
	}

	return(
		para.create(
			'flowWidth', this.flowWidth,
			'fontsize', this.fontsize,
			'mark', mark,
			'path', path,
			'pos', pos,
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

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const para = this.atRank( r );

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

	if( mark && mark.timtype === visual_mark_range && mark.containsPath( this.path.limit( 3 ) ) )
	{
		arr.push(
			gleam_glint_paint.createFS(
				gruga_selection.facet,
				this._rangeShape.transform( this.transform.ortho )
			)
		);
	}
	else if( mark && mark.timtype === visual_mark_caret && mark.focus )
	{
		arr.push( this._caretGlint );
	}


	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		arr.push( this.atRank( r ).glint );
	}

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

	if( !this.mark.hasCaret ) return false;

	const path = this.mark.caret.path;

	if( mark.timtype === visual_mark_range && !mark.empty )
	{
		root.removeRange( mark );

		// FUTURE this is an akward workaround

		root.input( text );

		return true;
	}

	return this.get( path.get( 5 ) ).input( text );
};


/*
| True if all paras are effectively empty or has only blank characters.
*/
def.lazy.isBlank =
	function( )
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const para = this.atRank( r );

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

	if( mark.timtype === visual_mark_range && !mark.empty )
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
		.get( mark.caret.path.get( 5 ) )
		.specialKey( key, this, shift, ctrl )
	);
};


/*
| Glint for the caret.
*/
def.lazy._caretGlint =
	function( )
{
	const mark = this.mark.textMark;

	const transform = this.transform.ortho;

	const key = mark.path.get( -2 );

	const para = this.get( key );

	const fs = this.fontsize;

	const descend = fs * gleam_font_font.bottomBox;

	let p = para.locateOffsetPoint( mark.at );

	const ppos = para.pos;

	p =
		transform.point(
			ppos.x + p.x,
			ppos.y + p.y - fs
		);

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
/**/	if( mark.timtype !== visual_mark_range ) throw new Error( );
/**/}

	const frontMark = mark.frontMark;

	const backMark = mark.backMark;

	const frontKey = frontMark.path.get( -2 );

	const backKey = backMark.path.get( -2 );

	const frontPara = this.get( frontKey );

	const frontPos = frontPara.pos;

	const backPara = this.get( backKey );

	const backPos = backPara.pos;

	let fp = frontPara.locateOffsetPoint( frontMark.at );

	let bp = backPara.locateOffsetPoint( backMark.at );

	const fLine = frontPara.locateOffsetLine( frontMark.at );

	const bLine = backPara.locateOffsetLine( backMark.at );

	const fontsize = this.fontsize;

	const descend = Math.round( fontsize * gleam_font_font.bottomBox );

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
			gleam_shape_start.p( fp.add( 0, descend ) ),
			gleam_shape_line.p( fp.add( 0, -ascend ) ),
			gleam_shape_line.p( bp.add( 0, -ascend ) ),
			gleam_shape_line.p( bp.add( 0, descend ) ),
			gleam_shape_line.close
		];

		return(
			gleam_shape.create(
				'list:init', sections,
				'pc',
					gleam_point.xy(
						( fp.x + bp.x ) / 2,
						( fp.y + bp.y ) / 2
					)
			)
		);
	}
	else if (
		bp.x < fp.x
		&&
		(
			frontKey === backKey && fLine + 1 === bLine
			||
			(
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
			gleam_shape_start.xy( rx, fp.y - ascend ),
			gleam_shape_line.xy( fp.x, fp.y - ascend ),
			gleam_shape_line.xy( fp.x, fp.y + descend ),
			gleam_shape_line.xy( rx, fp.y + descend ),
			gleam_shape_line.closeFly
		];

		const sections2 =
		[
			gleam_shape_start.xy( lx, bp.y - ascend ),
			gleam_shape_line.xy( bp.x, bp.y - ascend ),
			gleam_shape_line.xy( bp.x, bp.y + descend ),
			gleam_shape_line.xy( lx, bp.y + descend ),
			gleam_shape_line.closeFly
		];

		const shapes =
		[
			gleam_shape.create(
				'list:init', sections,
				'pc',
					gleam_point.xy(
						( fp.x + rx ) / 2,
						( 2 * fp.y - ascend + descend ) / 2
					)
			),
			gleam_shape.create(
				'list:init', sections2,
				'pc',
					gleam_point.xy(
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


		if( frontMark.at > 0 )
		{
			const sections =
			[
				gleam_shape_start.xy( rx, b2y + descend ),    // 1
				gleam_shape_line.xy( bp.x, b2y + descend ),   // 2
				gleam_shape_line.xy( bp.x, bp.y + descend ),  // 3
				gleam_shape_line.xy( lx, bp.y + descend ),    // 4
				gleam_shape_line.xyFly( lx, f2y - ascend ),   // 5
				gleam_shape_line.xy( fp.x, f2y - ascend ),    // 6
				gleam_shape_line.xy( fp.x, fp.y - ascend ),   // 7
				gleam_shape_line.xy( rx, fp.y - ascend ),     // 8
				gleam_shape_line.closeFly
			];

			return(
				gleam_shape.create(
					'list:init', sections,
					'pc',
						gleam_point.xy(
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
				gleam_shape_start.xy( rx, b2y + descend ),   // 1
				gleam_shape_line.xy( bp.x, b2y + descend ),  // 2
				gleam_shape_line.xy( bp.x, bp.y + descend ), // 3
				gleam_shape_line.xy( lx, bp.y + descend ),   // 4
				gleam_shape_line.xyFly( lx, fp.y - ascend ), // 7
				gleam_shape_line.xy( rx, fp.y - ascend ),    // 8
				gleam_shape_line.closeFly
			];

			return(
				gleam_shape.create(
					'list:init', sections,
					'pc',
						gleam_point.xy(
							( rx + lx ) / 2,
							( b2y + descend + f2y - ascend ) / 2
						)
				)
			);
		}
	}
};


} );
