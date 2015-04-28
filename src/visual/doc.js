/*
| A sequence of paragraph visualisations
*/


var
	euclid_point,
	euclid_shape,
	fabric_pointGroup,
	gruga_selection,
	jion,
	math_half,
	root,
	shapeSection_start,
	shapeSection_flyLine,
	shapeSection_line,
	shell_fontPool,
	theme,
	visual_doc,
	visual_para;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
|
| FIXME rework undefineds
*/
if( JION )
{
	return{
		id : 'visual_doc',
		attributes :
		{
			fabric :
			{
				comment : 'the doc fabric',
				type : 'fabric_doc'
			},
			flowWidth :
			{
				comment : 'width of the para its flow',
				type : [ 'undefined', 'number' ]
			},
			fontsize :
			{
				comment : 'size of the font',
				type : [ 'undefined', 'number' ]
			},
			innerMargin :
			{
				comment : 'inner margin of the doc',
				type : [ 'undefined', 'euclid_margin' ]
			},
			paraSep :
			{
				comment : 'vertical seperation of paragraphs',
				type : [ 'undefined', 'number' ]
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ]
			}
		},
		init : [ 'inherit' ],
		twig : [ 'visual_para' ]
	};
}


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
		key,
		twig,
		twigPath,
		ranks;

	fabric = this.fabric;

	twig = { };

	ranks = [ ];

	twigPath = this.path && this.path.append( 'twig' );

	for( a = 0, aZ = fabric.length; a < aZ; a++ )
	{
		key = fabric.getKey( a );

		ranks[ a ] = key;

		twig[ key ] =
			( inherit && inherit._twig[ key ] || visual_para ).create(
				'fabric', fabric.get( key ),
				'fontsize', this.fontsize,
				'path', twigPath && twigPath.appendNC( key ),
				'flowWidth', this.flowWidth,
				'mark', this.mark,
				'view', this.view
			);
	}

	if( FREEZE )
	{
		Object.freeze( ranks );

		Object.freeze( twig );
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

		if( !this.mark || !this.mark.hasCaret )
		{
			return 0;
		}

		path = this.mark.caretPath;

		key = path.get( 5 ); // FUTURE

/**/	if( CHECK )
/**/	{
/**/		if( !this.getPNW( key ) )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}

		return (
			this.getPNW( key ).y
			+ this.get( key ).attentionCenter
		);
	}
);


/*
| Returns the shape for a selection range
|
| FIXME, remove parameters and make lazy
*/
prototype._getRangeShape =
	function(
		width,       // width the doc is drawn
		scrollp      // scroll position of the doc
	)
{
	var
		ascend,
		b2Key,
		b2Para,
		b2y,
		back,
		backFlow,
		backKey,
		backPara,
		backPnw,
		backRank,
		bo,
		bp,
		descend,
		f2y,
		f2Key,
		f2Para,
		fo,
		fontsize,
		fp,
		front,
		frontFlow,
		frontKey,
		frontPara,
		frontPnw,
		frontRank,
		innerMargin,
		lx,
		mark,
		rx,
		sections,
		sections2;

	mark = this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.reflect !== 'visual_mark_range' ) throw new Error( );
/**/}

	front = mark.front;

	back = mark.back;

	frontKey = front.path.get( -2 );

	backKey = back.path.get( -2 );

	frontPnw = this.getPNW( frontKey );

	backPnw = this.getPNW( backKey );

	frontPara = this.get( frontKey );

	backPara = this.get( backKey );

	fo = frontPara.locateOffset( front.at );

	bo = backPara.locateOffset( back.at );

	fp = fo.p;

	bp = bo.p;

	fontsize = this.fontsize;

	descend = Math.round( fontsize * theme.bottombox );

	ascend = Math.round( fontsize );

	innerMargin = this.innerMargin;

	rx = width - innerMargin.e;

	lx = innerMargin.w;

	// FUTURE do not create points

	fp = fp.add( frontPnw.x - scrollp.x, frontPnw.y - scrollp.y );

	bp = bp.add( backPnw.x - scrollp.x, backPnw.y - scrollp.y );

	frontFlow = frontPara.flow;

	backFlow = backPara.flow;

	frontRank = this.rankOf( frontKey );

	f2Key =
		( frontRank + 1 < this.length )
		? this.getKey( frontRank + 1 )
		: undefined;

	f2Para = f2Key && this.get( f2Key );

	if( frontKey === backKey && fo.line === bo.line )
	{
		// fp o******o bp
		// FIXME return a rect-ray

		sections =
		[
			shapeSection_start.create( 'p', fp.add( 0, descend ) ),
			shapeSection_line.create( 'p', fp.add( 0, -ascend ) ),
			shapeSection_line.create( 'p', bp.add( 0, -ascend ) ),
			shapeSection_line.create( 'p', bp.add( 0, descend ) ),
			shapeSection_line.create( 'close', true )
		];

		return(
			euclid_shape.create(
				'ray:init', sections,
				'pc',
					euclid_point.create(
						'x', math_half( fp.x + bp.x ),
						'y', math_half( fp.y + bp.y )
					)
			)
		);
	}
	else if (
		bp.x < fp.x
		&&
		(
			frontKey === backKey && fo.line + 1 === bo.line
			||
			(
				f2Key === backKey
				&& fo.line + 1 >= frontFlow.length
				&& bo.line === 0
			)
		)
	)
	{
		//         fp o****
		// ****o bp

		sections =
		[
			shapeSection_start.create(
				'p', euclid_point.create( 'x', rx, 'y', fp.y - ascend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', fp.x, 'y', fp.y - ascend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', fp.x, 'y', fp.y + descend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', rx, 'y', fp.y + descend )
			),
			shapeSection_flyLine.create( 'close', true )
		];

		sections2 =
		[
			shapeSection_start.create(
				'p', euclid_point.create( 'x', lx, 'y', bp.y - ascend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', bp.x, 'y', bp.y - ascend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', bp.x, 'y', bp.y + descend )
			),
			shapeSection_line.create(
				'p', euclid_point.create( 'x', lx, 'y', bp.y + descend )
			),
			shapeSection_flyLine.create( 'close', true )
		];

		return(
			[
				euclid_shape.create(
					'ray:init', sections,
					'pc',
						euclid_point.create(
							'x', math_half( fp.x + rx ),
							'y', math_half( 2 * fp.y - ascend + descend )
						)
				),
				euclid_shape.create(
					'ray:init', sections2,
					'pc',
						euclid_point.create(
							'x', math_half( fp.x + rx ),
							'y', math_half( 2 * fp.y - ascend + descend )
						)
				)
			]
		);
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

		if( fo.line + 1 < frontFlow.length )
		{
			f2y =
				Math.round(
					frontFlow.get( fo.line + 1 ).y
					+ frontPnw.y
					- scrollp.y
				);
		}
		else
		{
			f2y =
				Math.round(
					f2Para.flow.get( 0 ).y
					+ this.getPNW( f2Key ).y
					- scrollp.y
				);
		}

		if( bo.line > 0 )
		{
			b2y =
				Math.round(
					backFlow.get( bo.line - 1 ).y
					+ backPnw.y
					- scrollp.y
				);
		}
		else
		{
			backRank = this.rankOf( backKey );

			b2Key = this.getKey( backRank - 1 );

			b2Para = this.get( b2Key );

			b2y =
				Math.round(
					b2Para.flow.get( b2Para.flow.length - 1 ).y
					+ this.getPNW( b2Key ).y
					- scrollp.y
				);
		}


		if( front.at > 0 )
		{
			sections =
			[
				shapeSection_start.create( // 1
					'p',
					euclid_point.create(
						'x', rx,
						'y', b2y + descend
					)
				),
				shapeSection_line.create( // 2
					'p',
					euclid_point.create(
						'x', bp.x,
						'y', b2y + descend
					)
				),
				shapeSection_line.create( // 3
					'p',
					euclid_point.create(
						'x', bp.x,
						'y', bp.y + descend
					)
				),
				shapeSection_line.create( // 4
					'p',
					euclid_point.create(
						'x', lx,
						'y', bp.y + descend
					)
				),
				shapeSection_flyLine.create( // 5
					'p',
					euclid_point.create(
						'x', lx,
						'y', f2y - ascend
					)
				),
				shapeSection_line.create( // 6
					'p',
					euclid_point.create(
						'x', fp.x,
						'y', f2y - ascend
					)
				),
				shapeSection_line.create( // 7
					'p',
					euclid_point.create(
						'x', fp.x,
						'y', fp.y - ascend
					)
				),
				shapeSection_line.create( // 8
					'p',
					euclid_point.create(
						'x', rx,
						'y', fp.y - ascend
					)
				),
				shapeSection_flyLine.create(
					'close', true
				)
			];

			return(
				euclid_shape.create(
					'ray:init', sections,
					'pc',
						euclid_point.create(
							'x', math_half( rx + lx ),
							'y', math_half( b2y + descend + f2y - ascend )
						)
				)
			);
		}
		else
		{
				sections =
				[
					shapeSection_start.create( // 1
						'p',
						euclid_point.create(
							'x', rx,
							'y', b2y + descend
						)
					),
					shapeSection_line.create( // 2
						'p',
						euclid_point.create(
							'x', bp.x,
							'y', b2y + descend
						)
					),
					shapeSection_line.create( // 3
						'p',
						euclid_point.create(
							'x', bp.x,
							'y', bp.y + descend
						)
					),
					shapeSection_line.create( // 4
						'p',
						euclid_point.create(
							'x', lx,
							'y', bp.y + descend
						)
					),
					shapeSection_flyLine.create( // 7
						'p',
						euclid_point.create(
							'x', lx,
							'y', fp.y - ascend
						)
					),
					shapeSection_line.create( // 8
						'p',
						euclid_point.create(
							'x', rx,
							'y', fp.y - ascend
						)
					),
					shapeSection_flyLine.create(
						'close', true
					)
				];
			return(
				euclid_shape.create(
					'ray:init', sections,
					'pc',
						euclid_point.create(
							'x', math_half( rx + lx ),
							'y', math_half( b2y + descend + f2y - ascend )
						)
				)
			);

		}
	}
};


/*
| Displays the document.
*/
prototype.draw =
	function(
		display,     // to display within
		width,       // the width to draw the document with
		scrollp      // scroll position
	)
{
	var
		a,
		aZ,
		mark,
		para,
		p,
		pnw,
		pnws,
		r,
		rZ,
		rs;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	// mark sanity check cannot be done in _init
/**/    // since it might be temporarily outOfOrder during update operation
/**/	if( this.mark && this.mark.hasCaret )
/**/	{
/**/		if( !this.get( this.mark.caretPath.get( 5 ) ) )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/}

	mark = this.mark;

	if(
		mark
		&& mark.reflect === 'visual_mark_range'
		&& mark.itemPath.subPathOf( this.path )
	)
	{
		rs = this._getRangeShape( width, scrollp );

		// FIXME have shapeRays handled more elegantly
		if( !Array.isArray( rs ) )
		{
			display.paint(
				gruga_selection.fill,
				gruga_selection.border,
				rs,
				this.view
			);
		}
		else
		{
			for(
				a = 0, aZ = rs.length;
				a < aZ;
				a++
			)
			{
				display.paint(
					gruga_selection.fill,
					gruga_selection.border,
					rs[ a ],
					this.view
				);
			}
		}
	}

	// north-west points of paras
	pnws = this.paraPnws;

	for(
		r = 0, rZ = this.length;
		r < rZ;
		r++
	)
	{
		para = this.atRank( r );

		pnw = pnws.get( this.getKey( r ) );

		p = pnw.sub( 0, Math.round( scrollp.y ) );

		para.draw( display, this.view.point( p ) );
	}
};


/*
| The para pnws.
*/
jion.lazyValue(
	prototype,
	'paraPnws',
	function( )
	{
		var
			innerMargin,
			para,
			paraSep,
			pnws,
			r,
			rZ,
			y;

		pnws = { };

		paraSep = this.paraSep;

		innerMargin = this.innerMargin;

		y = innerMargin.n;

		for(
			r = 0, rZ = this.length;
			r < rZ;
			r++
		)
		{
			para = this.atRank( r );

			pnws[ this.getKey( r ) ] =
				euclid_point.create(
					'x', innerMargin.w,
					'y', Math.round( y )
				);

			y += para.flow.height + paraSep;
		}

		return fabric_pointGroup.create( 'group:init', pnws );
	}
);


/*
| The height of the document.
*/
jion.lazyValue(
	prototype,
	'height',
	function( )
	{
		var
			flow,
			fs,
			height,
			para,
			paraSep,
			r,
			rZ;

		fs = this.fontsize;

		paraSep = this.paraSep;

		height = 0;

		for( r = 0, rZ = this.length; r < rZ; r++ )
		{
			para = this.atRank( r );

			flow = para.flow;

			if( r > 0 )
			{
				height += paraSep;
			}

			height += flow.height;
		}

		height += Math.round( fs * theme.bottombox );

		return height;
	}
);


/*
| returns the north-west point of the paragraph with the key 'key'.
*/
prototype.getPNW =
	function(
		key
	)
{
	return this.paraPnws.get( key );
};


/*
| The width actually used by the document.
*/
jion.lazyValue(
	prototype,
	'widthUsed',
	function( )
	{
		var
			a,
			aZ,
			max,
			widthUsed;

		widthUsed = 0;

		max = Math.max;

		for( a = 0, aZ = this.length; a < aZ; a++ )
		{
			widthUsed = max( widthUsed, this.atRank( a ).flow.width );
		}

		return widthUsed;
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
| Returns the paragraph at point
*/
prototype.getParaAtPoint =
	function(
		p
	)
{
	var
		para,
		pnws,
		r,
		rZ;

	if( p.y < this.innerMargin.n )
	{
		return;
	}

	pnws = this.paraPnws;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		para = this.atRank( r );

		if( p.y < pnws.get( this.getKey( r ) ).y + para.flow.height )
		{
			return para;
		}
	}

	return;
};

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

	path = this.mark.caretPath;

	if(
		mark.reflect === 'visual_mark_range'
		&& !mark.empty
	)
	{
		root.removeRange( mark.front, mark.back );

		// FIXME this is an akward workaround

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
		item, // FIXME remove
		shift,
		ctrl
	)
{
	var
		mark;

	mark = this.mark;

	if( !mark.hasCaret )
	{
		return false;
	}

	if(
		mark.reflect === 'visual_mark_range'
		&& !mark.empty
	)
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				root.removeRange( mark.front, mark.back );

				return true;

			case 'enter' :

				root.removeRange( mark.front, mark.back );

				root.specialKey( key, shift, ctrl );

				return true;
		}
	}

	return(
		this
		.get( mark.caretPath.get( 5 ) )
		.specialKey( key, item, shift, ctrl )
	);
};


} )( );
