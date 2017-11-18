/*
| A sequence of paragraph visualisations
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_doc',
		attributes :
		{
			clipsize :
			{
				comment : 'the visible size of the doc',
				// if created with undefined,
				// it is set to equal to fullsize
				type : [ 'undefined', 'gleam_size' ],
				assign : '_clipsize'
			},
			fabric :
			{
				comment : 'the doc fabric',
				type : 'fabric_doc'
			},
			flowWidth :
			{
				comment : 'width the flow seeks to fill',
				type : 'number'
			},
			fontsize :
			{
				comment : 'size of the font',
				type : 'number'
			},
			innerMargin :
			{
				comment : 'inner margin of the doc',
				type : 'gleam_margin'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( './mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			paraSep :
			{
				comment : 'vertical seperation of paragraphs',
				type : 'number'
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			scrollPos :
			{
				comment : 'scroll position of the doc',
				type : 'gleam_point'
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'gleam_transform'
			}
		},
		init : [ 'inherit' ],
		twig : [ 'visual_para' ]
	};
}


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
	jion,
	root,
	shell_fontPool,
	shell_settings,
	visual_doc,
	visual_para;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	jion = require( 'jion' );

	visual_doc = jion.this( module, 'source' );
}


var
	prototype;

prototype = visual_doc.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		a,
		aZ,
		fabric,
		innerMargin,
		key,
		para,
		paraSep,
		pos,
		twig,
		twigPath,
		ranks,
		y;

	fabric = this.fabric;

	twig = { };

	ranks = [ ];

	twigPath = this.path && this.path.append( 'twig' );

	paraSep = this.paraSep;

	innerMargin = this.innerMargin;

	y = innerMargin.n;

	for( a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		key = fabric.getKey( a );

		ranks[ a ] = key;

		pos = gleam_point.xy( innerMargin.w, y - this.scrollPos.y );

		para =
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


/*
| Returns the attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	function( )
{
	var
		path,
		key;

	if( !this.mark || !this.mark.hasCaret ) return 0;

	path = this.mark.caret.path;

	key = path.get( 5 ); // FUTURE

	return this.get( key ).attentionCenter;
}
);


/*
| The visible size of the doc.
|
| If created with undefined,
| it is set to equal to fullsize
*/
jion.lazyValue(
	prototype,
	'clipsize',
	function( )
{
	return this._clipsize || this.fullsize;
}
);


/*
| The default font for the document.
*/
jion.lazyValue(
	prototype,
	'font',
	function( )
{
	return shell_fontPool.get( this.fontsize, 'la' );
}
);


/*
| Full size of the doc.
|
| Disregards clipping in notes.
*/
jion.lazyValue(
	prototype,
	'fullsize',
	function( )
{
	var
		a,
		aZ,
		flow,
		fs,
		height,
		para,
		paraSep,
		max,
		width;

	height = 0;

	width = 0;

	max = Math.max;

	fs = this.fontsize;

	paraSep = this.paraSep;

	for( a = 0, aZ = this.length; a < aZ; a++ )
	{
		para = this.atRank( a );

		flow = para.flow;

		width = max( width, flow.width );

		if( a > 0 ) height += paraSep;

		height += flow.height;
	}

	height += Math.round( fs * shell_settings.bottombox );

	return gleam_size.wh( width, height );
}
);


/*
| Returns the paragraph at point
*/
prototype.getParaAtPoint =
	function(
		p
	)
{
	var
		para,
		r,
		rZ;

	if( p.y < this.innerMargin.n )
	{
		return this.atRank( 0 );
	}

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		para = this.atRank( r );

		if( p.y < para.pos.y + para.flow.height )
		{
			return para;
		}
	}
};


/*
| Return the doc's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		arr,
		mark,
		r,
		rZ;

	arr = [ ];

	mark = this.mark;

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


	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		arr.push( this.atRank( r ).glint );
	}

	return gleam_glint_list.create( 'list:init', arr );
}
);


/*
| A text has been inputed.
*/
prototype.input =
	function(
		text  // text inputed
	)
{
	var
		mark,
		path;

	mark = this.mark;

	if( !this.mark.hasCaret )
	{
		return false;
	}

	path = this.mark.caret.path;

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
prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		mark;

	mark = this.mark;

	if( !mark.hasCaret ) return false;

	if(
		mark.reflect === 'visual_mark_range'
		&& !mark.empty
	)
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
jion.lazyValue(
	prototype,
	'_caretGlint',
	function( )
{
	var
		descend,
		fs,
		key,
		mark,
		p,
		para,
		ppos,
		transform;

	mark = this.mark.textMark;

	transform = this.transform.ortho;

	key = mark.path.get( -2 );

	para = this.get( key );

	fs = this.fontsize;

	descend = fs * shell_settings.bottombox;

	p = para.locateOffsetPoint( mark.at );

	ppos = para.pos;
	
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
}
);


/*
| Returns the shape for a selection range
*/
jion.lazyValue(
	prototype,
	'_rangeShape',
	function( )
{
	var
		ascend,
		b2Key,
		b2Para,
		b2y,
		backFlow,
		backKey,
		backMark,
		backPara,
		backPos,
		backRank,
		bLine,
		bp,
		descend,
		f2y,
		f2Key,
		f2Para,
		fLine,
		fontsize,
		fp,
		frontFlow,
		frontKey,
		frontMark,
		frontPara,
		frontPos,
		frontRank,
		innerMargin,
		lx,
		mark,
		rx,
		shapes,
		sections,
		sections2;

	mark = this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.reflect !== 'visual_mark_range' ) throw new Error( );
/**/}

	frontMark = mark.frontMark;

	backMark = mark.backMark;

	frontKey = frontMark.path.get( -2 );

	backKey = backMark.path.get( -2 );

	frontPara = this.get( frontKey );

	frontPos = frontPara.pos;

	backPara = this.get( backKey );

	backPos = backPara.pos;

	fp = frontPara.locateOffsetPoint( frontMark.at );

	bp = backPara.locateOffsetPoint( backMark.at );

	fLine = frontPara.locateOffsetLine( frontMark.at );

	bLine = backPara.locateOffsetLine( backMark.at );

	fontsize = this.fontsize;

	descend = Math.round( fontsize * shell_settings.bottombox );

	ascend = Math.round( fontsize );

	innerMargin = this.innerMargin;

	rx = this.clipsize.width - innerMargin.e;

	lx = innerMargin.w;

	// FUTURE do not create points

	fp = fp.add( frontPos.x, frontPos.y );

	bp = bp.add( backPos.x, backPos.y );

	frontFlow = frontPara.flow;

	backFlow = backPara.flow;

	frontRank = this.rankOf( frontKey );

	f2Key =
		( frontRank + 1 < this.length )
		? this.getKey( frontRank + 1 )
		: undefined;

	f2Para = f2Key && this.get( f2Key );

	if( frontKey === backKey && fLine === bLine )
	{
		// fp o******o bp

		sections =
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

		sections =
		[
			gleam_shape_start.xy( rx, fp.y - ascend ),
			gleam_shape_line.xy( fp.x, fp.y - ascend ),
			gleam_shape_line.xy( fp.x, fp.y + descend ),
			gleam_shape_line.xy( rx, fp.y + descend ),
			gleam_shape_line.closeFly
		];

		sections2 =
		[
			gleam_shape_start.xy( lx, bp.y - ascend ),
			gleam_shape_line.xy( bp.x, bp.y - ascend ),
			gleam_shape_line.xy( bp.x, bp.y + descend ),
			gleam_shape_line.xy( lx, bp.y + descend ),
			gleam_shape_line.closeFly
		];

		shapes =
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
			backRank = this.rankOf( backKey );

			b2Key = this.getKey( backRank - 1 );

			b2Para = this.get( b2Key );

			b2y =
				b2Para.flow.get( b2Para.flow.length - 1 ).y
				+ b2Para.pos.y;
		}


		if( frontMark.at > 0 )
		{
			sections =
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
				sections =
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
}
);


} )( );
