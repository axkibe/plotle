/*
| A sequence of paragraphs.
*/


var
	euclid_point,
	euclid_shape,
	fabric_doc,
	jools,
	root,
	shapeSection_start,
	shapeSection_flyLine,
	shapeSection_line,
	shell_fontPool,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'fabric_doc',
		attributes :
			{
				flowWidth :
					{
						comment :
							'width of the para its flow',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				fontsize :
					{
						comment :
							'size of the font',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				innerMargin :
					{
						comment :
							'inner margin of the doc',
						type :
							'euclid_margin',
						defaultValue :
							'undefined'
					},
				paraSep :
					{
						comment :
							'vertical seperation of paragraphs',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'->mark',
						defaultValue :
							'undefined',
						allowsNull :
							true
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							'undefined'
					}
			},
		init :
			[ 'twigDup' ],
		json :
			true,
		twig :
			[ 'fabric_para' ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	fabric_doc = require( '../jion/this' )( module );
}


prototype = fabric_doc.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		key,
		path,
		twig,
		ranks;

	if( !this.view )
	{
		// if abstract nothing is initialized
		return;
	}

	ranks = this.ranks;

	twig =
		twigDup
		? this.twig
		: jools.copy( this.twig );

	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		key = ranks[ r ];

		path =
			this.path
			.append( 'twig' )
			.appendNC( key );

		twig[ key ] =
			twig[ key ].create(
				'path', path,
				'fontsize', this.fontsize,
				'flowWidth', this.flowWidth,
				'mark', this.mark,
				'view', this.view
			);
	}

	this.twig = twig;
};


/*
| Returns the attention center.
*/
jools.lazyValue(
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
			+ this.twig[ key ].attentionCenter
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
/**/	if( mark.reflect !== 'mark_range' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	front = mark.front;

	back = mark.back;

	frontKey = front.path.get( -2 );

	backKey = back.path.get( -2 );

	frontPnw = this.getPNW( frontKey );

	backPnw = this.getPNW( backKey );

	frontPara = this.twig[ frontKey ];

	backPara = this.twig[ backKey ];

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

	// FIXME do not create points

	fp =
		fp.add(
			frontPnw.x - scrollp.x,
			frontPnw.y - scrollp.y
		);

	bp =
		bp.add(
			backPnw.x - scrollp.x,
			backPnw.y - scrollp.y
		);

	frontFlow = frontPara.flow;

	backFlow = backPara.flow;

	frontRank = this.rankOf( frontKey );

	f2Key =
		( frontRank + 1 < this.ranks.length )
			? this.ranks[ frontRank + 1 ]
			: null;

	f2Para = f2Key && this.twig[ f2Key ];

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
						'x', jools.half( fp.x + bp.x ),
						'y', jools.half( fp.y + bp.y )
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
				f2Key === backKey &&
				fo.line + 1 >= frontFlow.length &&
				bo.line === 0
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
			shapeSection_flyLine.create(
				'close', true
			)
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
							'x', jools.half( fp.x + rx ),
							'y', jools.half( 2 * fp.y - ascend + descend )
						)
				),
				euclid_shape.create(
					'ray:init', sections2,
					'pc',
						euclid_point.create(
							'x', jools.half( fp.x + rx ),
							'y', jools.half( 2 * fp.y - ascend + descend )
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

		f2y = null;

		b2y = null;

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

			b2Key = this.ranks[ backRank - 1 ];

			b2Para = this.twig[ b2Key ];

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
							'x', jools.half( rx + lx ),
							'y', jools.half( b2y + descend + f2y - ascend )
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
							'x', jools.half( rx + lx ),
							'y', jools.half( b2y + descend + f2y - ascend )
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
		ranks,
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
/**/		if( !this.twig[ this.mark.caretPath.get( 5 ) ] )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/}

	mark = this.mark;

	if(
		mark
		&& mark.reflect === 'mark_range'
		&& mark.itemPath.subPathOf( this.path )
	)
	{
		rs = this._getRangeShape( width, scrollp );

		// FIXME have shapeRays handled more elegantly
		if( !Array.isArray( rs ) )
		{
			display.oldPaint(
				theme.selection.style,
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
				display.oldPaint(
					theme.selection.style,
					rs[ a ],
					this.view
				);
			}
		}
	}

	// north-west points of paras
	pnws = this.paraPNWs;

	ranks = this.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		para = this.atRank( r );

		pnw = pnws[ ranks[ r ] ];

		p = pnw.sub( 0, Math.round( scrollp.y ) );

		para.draw( display, this.view.point( p ) );
	}
};


/*
| The para pnws.
|
| FIXME make this a twig.
*/
jools.lazyValue(
	prototype,
	'paraPNWs',
	function( )
	{
		var
			flow,
			innerMargin,
			para,
			paraSep,
			pnws,
			ranks,
			r,
			rZ,
			y;

		pnws = { };

		paraSep = this.paraSep;

		innerMargin = this.innerMargin;

		y = innerMargin.n;

		ranks = this.ranks;

		for(
			r = 0, rZ = ranks.length;
			r < rZ;
			r++
		)
		{
			para = this.atRank( r );

			flow = para.flow;

			pnws[ ranks[ r ] ] =
				euclid_point.create(
					'x', innerMargin.w,
					'y', Math.round( y )
				);

			y += flow.height + paraSep;
		}

		return pnws;
	}
);


/*
| The height of the document.
*/
jools.lazyValue(
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
			ranks;

		fs = this.fontsize;

		paraSep = this.paraSep;

		ranks = this.ranks;

		height = 0;

		for(
			var r = 0, rZ = ranks.length;
			r < rZ;
			r++
		)
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
	return this.paraPNWs[ key ];
};


/*
| The width actually used by the document.
*/
jools.lazyValue(
	prototype,
	'widthUsed',
	function( )
	{
		var
			max,
			widthUsed,
			twig;

		widthUsed = 0;

		twig = this.twig;

		max = Math.max;

		for( var key in twig )
		{
			widthUsed =
				max(
					widthUsed,
					twig[ key ].flow.width
				);
		}

		return widthUsed;
	}
);


/*
| The default font for the document.
*/
jools.lazyValue(
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
		key,
		para,
		pnws,
		r,
		ranks,
		rZ,
		twig;

	if( p.y < this.innerMargin.n )
	{
		return null;
	}

	pnws = this.paraPNWs;

	ranks = this.ranks;

	twig = this.twig;

	for(
		r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		key = ranks[ r ];

		para = twig[ key ];

		if( p.y < pnws[ key ].y + para.flow.height )
		{
			return para;
		}
	}

	return null;
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
		mark.reflect === 'mark_range'
		&& !mark.empty
	)
	{
		root.space.removeRange( mark.front, mark.back );

		// FIXME this is an akward workaround

		root.input( text );

		return true;
	}

	return(
		this
		.twig[ path.get( 5 ) ]
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
		mark.reflect === 'mark_range'
		&& !mark.empty
	)
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				root.space.removeRange( mark.front, mark.back );

				return true;

			case 'enter' :

				root.space.removeRange( mark.front, mark.back );

				root.specialKey( key, shift, ctrl );

				return true;
		}
	}

	return(
		this
		.twig[ mark.caretPath.get( 5 ) ]
		.specialKey( key, item, shift, ctrl )
	);
};


} )( );
