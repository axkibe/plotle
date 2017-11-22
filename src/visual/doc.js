/*
| A sequence of paragraph visualisations
*/
'use strict';


// FIXME
var
	gleam_facet,
	gleam_glint_border,
	gleam_glint_paint,
	gleam_glint_list,
	gleam_line,
	gleam_point,
	gleam_shape,
	gleam_shapeList,
	gleam_shape_line,
	gleam_shape_start,
	gleam_size,
	gruga_selection,
	shell_fontPool,
	shell_settings,
	visual_para;


tim.define( module, 'visual_doc', ( def, visual_doc ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		clipsize :
		{
			// the visible size of the doc
			// if created with undefined,
			// it is set to equal to fullsize
			type : [ 'undefined', 'gleam_size' ],
			assign : '_clipsize'
		},
		fabric :
		{
			// the doc fabric
			type : 'fabric_doc'
		},
		flowWidth :
		{
			// width the flow seeks to fill
			type : 'number'
		},
		fontsize :
		{
			// size of the font
			type : 'number'
		},
		innerMargin :
		{
			// inner margin of the doc
			type : 'gleam_margin'
		},
		mark :
		{
			// the users mark
			type :
				require( './mark/typemap' )
				.concat( [ 'undefined' ] )
		},
		paraSep :
		{
			// vertical seperation of paragraphs
			type : 'number'
		},
		path :
		{
			// the path of the doc
			type : [ 'undefined', 'jion$path' ]
		},
		scrollPos :
		{
			// scroll position of the doc
			type : 'gleam_point'
		},
		transform :
		{
			// the current space transform
			type : 'gleam_transform'
		}
	};

	def.init = [ 'inherit' ];

	def.twig = [ 'visual_para' ];
}


/*
| Initializer.
*/
def.func._init =
	function(
		inherit
	)
{
	const fabric = this.fabric;

	const twig = { };

	const ranks = [ ];

	const twigPath = this.path && this.path.append( 'twig' );

	const paraSep = this.paraSep;

	const innerMargin = this.innerMargin;

	let y = innerMargin.n;

	for( let a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		const key = fabric.getKey( a );

		ranks[ a ] = key;

		const pos = gleam_point.xy( innerMargin.w, y - this.scrollPos.y );

		const para =
		twig[ key ] =
			( inherit && inherit._twig[ key ] || visual_para ).create(
				'fabric', fabric.get( key ),
				'fontsize', this.fontsize,
				'path', twigPath && twigPath.appendNC( key ),
				'pos', pos,
				'flowWidth', this.flowWidth,
				'mark', this.mark,
				'transform', this.transform
			);

		y += para.flow.height + paraSep;
	}

	this._ranks = ranks;

	this._twig = twig;
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


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
def.lazy.clipsize =
	function( )
{
	return this._clipsize || this.fullsize;
};


/*
| The default font for the document.
*/
def.lazy.font =
	function( )
{
	return shell_fontPool.get( this.fontsize, 'la' );
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

	height += Math.round( fs * shell_settings.bottombox );

	return gleam_size.wh( width, height );
};


/*
| Return the doc's glint.
*/
def.lazy.glint =
	function( )
{
	const arr = [ ];

	const mark = this.mark;

	if(
		mark
		&& mark.reflect === 'visual_mark_range'
		&& mark.containsPath( this.path.limit( 3 ) )
	)
	{
		arr.push(
			gleam_glint_paint.create(
				'facet', gruga_selection,
				'shape', this._rangeShape.transform( this.transform.ortho )
			)
		);
	}
	else if(
		mark
		&& mark.reflect === 'visual_mark_caret'
		&& mark.focus
	)
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

	const descend = fs * shell_settings.bottombox;

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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Returns the paragraph at point
*/
def.func.getParaAtPoint =
	function(
		p
	)
{
	if( p.y < this.innerMargin.n )
	{
		return this.atRank( 0 );
	}

	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const para = this.atRank( r );

		if( p.y < para.pos.y + para.flow.height )
		{
			return para;
		}
	}
};


/*
| A text has been inputed.
*/
def.func.input =
	function(
		text  // text inputed
	)
{
	const mark = this.mark;

	if( !this.mark.hasCaret ) return false;

	const path = this.mark.caret.path;

	if(
		mark.reflect === 'visual_mark_range'
		&& !mark.empty
	)
	{
		root.removeRange( mark );

		// FUTURE this is an akward workaround

		root.input( text );

		return true;
	}

	return(
		this
		.get( path.get( 5 ) )
		.input( text )
	);
};


/*
| Handles a special key.
*/
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	const mark = this.mark;

	if( !mark.hasCaret ) return false;

	if( mark.reflect === 'visual_mark_range' && !mark.empty )
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
| Returns the shape for the selection range.
*/
def.lazy._rangeShape =
	function( )
{
	const mark = this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.reflect !== 'visual_mark_range' ) throw new Error( );
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

	const descend = Math.round( fontsize * shell_settings.bottombox );

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
