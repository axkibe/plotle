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
				type : [ 'undefined', 'euclid_rect' ],
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
				type : 'euclid_margin'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
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
				type : 'euclid_point'
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'euclid_transform'
			}
		},
		init : [ 'inherit' ],
		twig : [ 'visual_para' ]
	};
}


var
	euclid_point,
	euclid_shape,
	euclid_shapeRay,
	euclid_shape_start,
	euclid_shape_line,
	euclid_point,
	euclid_rect,
	gleam_glint_paint,
	gleam_glint_ray,
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
		pnw,
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

		pnw =
			euclid_point.create(
				'x', innerMargin.w,
				'y', Math.round( y - this.scrollPos.y )
			);

		para =
		twig[ key ] =
			( inherit && inherit._twig[ key ] || visual_para ).create(
				'fabric', fabric.get( key ),
				'fontsize', this.fontsize,
				'path', twigPath && twigPath.appendNC( key ),
				'pnw', pnw,
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

	return(
		euclid_rect.create(
			'pnw', euclid_point.zero,
			'pse',
				euclid_point.create(
					'x', width,
					'y', height
				)
		)
	);
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

		if( p.y < para.pnw.y + para.flow.height )
		{
			return para;
		}
	}
};


/*
| Return the doc's glint.
|
| TODO inherit.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		gLen,
		gRay,
		mark,
		r,
		rZ,
		s;

	gRay = [ ];

	gLen = 0;

	mark = this.mark;

	if(
		mark
		&& mark.reflect === 'visual_mark_range'
		&& mark.containsPath( this.path.limit( 3 ) )
	)
	{
		gRay[ gLen++ ] =
			gleam_glint_paint.create(
				'facet', gruga_selection,
				'shape',
					this._rangeShape.transform(
						// FIXME have _rangeShape already
						// return transformed
						this.transform.ortho
					)
			);
	}
	else if(
		mark
		&& mark.reflect === 'visual_mark_caret'
		&& mark.focus
	)
	{
		gRay[ gLen++ ] =
			this.get( mark.textMark.path.get( -2 ) ).caretGlint;
	}


	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		s = this.atRank( r );

		gRay[ gLen++ ] = s.glint;
	}

	return gleam_glint_ray.create( 'ray:init', gRay );
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
		backPnw,
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
		frontPnw,
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

	frontPnw = frontPara.pnw;

	backPara = this.get( backKey );

	backPnw = backPara.pnw;

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

	fp = fp.add( frontPnw.x, frontPnw.y );

	bp = bp.add( backPnw.x, backPnw.y );

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
			euclid_shape_start.create( 'p', fp.add( 0, descend ) ),
			euclid_shape_line.create( 'p', fp.add( 0, -ascend ) ),
			euclid_shape_line.create( 'p', bp.add( 0, -ascend ) ),
			euclid_shape_line.create( 'p', bp.add( 0, descend ) ),
			euclid_shape_line.create( 'close', true )
		];

		return(
			euclid_shape.create(
				'ray:init', sections,
				'pc',
					euclid_point.create(
						'x', ( fp.x + bp.x ) / 2,
						'y', ( fp.y + bp.y ) / 2
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
			euclid_shape_start.create(
				'p', euclid_point.create( 'x', rx, 'y', fp.y - ascend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', fp.x, 'y', fp.y - ascend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', fp.x, 'y', fp.y + descend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', rx, 'y', fp.y + descend )
			),
			euclid_shape_line.create( 'close', true, 'fly', true )
		];

		sections2 =
		[
			euclid_shape_start.create(
				'p', euclid_point.create( 'x', lx, 'y', bp.y - ascend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', bp.x, 'y', bp.y - ascend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', bp.x, 'y', bp.y + descend )
			),
			euclid_shape_line.create(
				'p', euclid_point.create( 'x', lx, 'y', bp.y + descend )
			),
			euclid_shape_line.create( 'close', true, 'fly', true )
		];

		shapes =
		[
			euclid_shape.create(
				'ray:init', sections,
				'pc',
					euclid_point.create(
						'x', ( fp.x + rx ) / 2,
						'y', ( 2 * fp.y - ascend + descend ) / 2
					)
			),
			euclid_shape.create(
				'ray:init', sections2,
				'pc',
					euclid_point.create(
						'x', ( fp.x + rx ) / 2,
						'y', ( 2 * fp.y - ascend + descend ) / 2
					)
			)
		];

		return euclid_shapeRay.create( 'ray:init', shapes );
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
			f2y = frontFlow.get( fLine + 1 ).y + frontPnw.y;
		}
		else
		{
			f2y = f2Para.flow.get( 0 ).y + f2Para.pnw.y;
		}

		if( bLine > 0 )
		{
			b2y = backFlow.get( bLine - 1 ).y + backPnw.y;
		}
		else
		{
			backRank = this.rankOf( backKey );

			b2Key = this.getKey( backRank - 1 );

			b2Para = this.get( b2Key );

			b2y =
				b2Para.flow.get( b2Para.flow.length - 1 ).y
				+ b2Para.pnw.y;
		}


		if( frontMark.at > 0 )
		{
			sections =
			[
				euclid_shape_start.create( // 1
					'p',
					euclid_point.create(
						'x', rx,
						'y', b2y + descend
					)
				),
				euclid_shape_line.create( // 2
					'p',
					euclid_point.create(
						'x', bp.x,
						'y', b2y + descend
					)
				),
				euclid_shape_line.create( // 3
					'p',
					euclid_point.create(
						'x', bp.x,
						'y', bp.y + descend
					)
				),
				euclid_shape_line.create( // 4
					'p',
					euclid_point.create(
						'x', lx,
						'y', bp.y + descend
					)
				),
				euclid_shape_line.create( // 5
					'p',
					euclid_point.create(
						'x', lx,
						'y', f2y - ascend
					),
					'fly', true
				),
				euclid_shape_line.create( // 6
					'p',
					euclid_point.create(
						'x', fp.x,
						'y', f2y - ascend
					)
				),
				euclid_shape_line.create( // 7
					'p',
					euclid_point.create(
						'x', fp.x,
						'y', fp.y - ascend
					)
				),
				euclid_shape_line.create( // 8
					'p',
					euclid_point.create(
						'x', rx,
						'y', fp.y - ascend
					)
				),
				euclid_shape_line.create(
					'close', true,
					'fly', true
				)
			];

			return(
				euclid_shape.create(
					'ray:init', sections,
					'pc',
						euclid_point.create(
							'x', ( rx + lx ) / 2,
							'y', ( b2y + descend + f2y - ascend ) / 2
						)
				)
			);
		}
		else
		{
				sections =
				[
					euclid_shape_start.create( // 1
						'p',
						euclid_point.create(
							'x', rx,
							'y', b2y + descend
						)
					),
					euclid_shape_line.create( // 2
						'p',
						euclid_point.create(
							'x', bp.x,
							'y', b2y + descend
						)
					),
					euclid_shape_line.create( // 3
						'p',
						euclid_point.create(
							'x', bp.x,
							'y', bp.y + descend
						)
					),
					euclid_shape_line.create( // 4
						'p',
						euclid_point.create(
							'x', lx,
							'y', bp.y + descend
						)
					),
					euclid_shape_line.create( // 7
						'p',
						euclid_point.create(
							'x', lx,
							'y', fp.y - ascend
						),
						'fly', true
					),
					euclid_shape_line.create( // 8
						'p',
						euclid_point.create(
							'x', rx,
							'y', fp.y - ascend
						)
					),
					euclid_shape_line.create(
						'close', true,
						'fly', true
					)
				];

			return(
				euclid_shape.create(
					'ray:init', sections,
					'pc',
						euclid_point.create(
							'x', ( rx + lx ) / 2,
							'y', ( b2y + descend + f2y - ascend ) / 2
						)
				)
			);
		}
	}
}
);


} )( );
