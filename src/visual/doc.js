/*
| A sequence of paragraphs.
*/


var
	euclid_point,
	euclid_shape,
	jools,
	root,
	shell_fontPool,
	shell_peer,
	theme,
	visual;


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
			'visual.doc',
		attributes :
			{
				flowWidth :
					{
						comment :
							'width of the para its flow',
						type :
							'Number',
						defaultValue :
							undefined
					},
				fontsize :
					{
						comment :
							'size of the font',
						type :
							'Number',
						defaultValue :
							undefined
					},
				innerMargin :
					{
						comment :
							'inner margin of the doc',
						type :
							'euclid_margin',
						defaultValue :
							undefined
					},
				paraSep :
					{
						comment :
							'vertical seperation of paragraphs',
						type :
							'Number',
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE '->marks_',
						defaultValue :
							undefined,
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
							undefined
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
	doc;

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	doc = require( '../jion/this' )( module );
}
else
{
	doc = visual.doc;
}



/*
| Initializer.
*/
doc.prototype._init =
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
				'path',
					path,
				'fontsize',
					this.fontsize,
				'flowWidth',
					this.flowWidth,
				'mark',
					this.mark,
				'view',
					this.view
			);
	}

/**/if( CHECK )
/**/{
/**/	if( this.mark && this.mark.hasCaret )
/**/	{
/**/		if( !this.twig[ this.mark.caretPath.get( 5 ) ] )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
/**/}

	this.twig = twig;
};


/*
| Returns the attention center.
*/
jools.lazyValue(
	doc.prototype,
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

		key = path.get( 5 ); // FUTURUE

/**/		if( CHECK )
/**/		{
/**/			if( !this.getPNW( key ) )
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

		return (
			this.getPNW( key ).y
			+
			this.twig[ key ].attentionCenter
		);
	}
);


/*
| Returns the shape for a selection range
|
| FIXME, remove parameters and make lazy
*/
doc.prototype._getRangeShape =
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
		backAt,
		backFlow,
		backKey,
		backPath,
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
		frontAt,
		frontFlow,
		frontKey,
		frontPara,
		frontPath,
		frontPnw,
		frontRank,
		innerMargin,
		lx,
		mark,
		rx;

	mark = this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.reflect_ !== 'marks_range' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	frontPath = mark.frontPath;

	frontAt = mark.frontAt;

	backPath = mark.backPath;

	backAt = mark.backAt;

	frontKey = frontPath.get( -2 );

	backKey = backPath.get( -2 );

	frontPnw = this.getPNW( frontKey );

	backPnw = this.getPNW( backKey );

	frontPara = this.twig[ frontKey ];

	backPara = this.twig[ backKey ];

	fo = frontPara.locateOffset( frontAt );

	bo = backPara.locateOffset( backAt );

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

	if(
		frontKey === backKey &&
		fo.line === bo.line
	)
	{
		// fp o******o bp
		// FIXME return a rect-ray

		return(
			euclid_shape.create(
				'hull',
					[
						'start', fp.add( 0, descend ),
						'line', fp.add( 0, -ascend ),
						'line', bp.add( 0, -ascend ),
						'line', bp.add( 0, descend ),
						'line', 'close'
					],
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
			(
				frontKey === backKey &&
				fo.line + 1 === bo.line
			)
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

		return(
			[
				euclid_shape.create(
					'hull',
						[
							'start',
								euclid_point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'line',
								euclid_point.create(
									'x', fp.x,
									'y', fp.y - ascend
								),
							'line',
								euclid_point.create(
									'x', fp.x,
									'y', fp.y + descend
								),
							'line',
								euclid_point.create(
									'x', rx,
									'y', fp.y + descend
								),
							'0-line',
								'close'
						],
					'pc',
						euclid_point.create(
							'x', jools.half( fp.x + rx ),
							'y', jools.half( 2 * fp.y - ascend + descend )
						)
				),
				euclid_shape.create(
					'hull',
						[
							'start',
								euclid_point.create(
									'x', lx,
									'y', bp.y - ascend
								),
							'line',
								euclid_point.create(
									'x', bp.x,
									'y', bp.y - ascend
								),
							'line',
								euclid_point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line',
								euclid_point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line',
								'close'
						],
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
					frontFlow[ fo.line + 1 ].y
					+
					frontPnw.y
					-
					scrollp.y
				);
		}
		else
		{
			f2y =
				Math.round(
					f2Para.flow[ 0 ].y
					+
					this.getPNW( f2Key ).y
					-
					scrollp.y
				);
		}

		if( bo.line > 0 )
		{
			b2y =
				Math.round(
					backFlow[ bo.line - 1 ].y
					+
					backPnw.y
					-
					scrollp.y
				);
		}
		else
		{
			backRank = this.rankOf( backKey );

			b2Key = this.ranks[ backRank - 1 ];

			b2Para = this.twig[ b2Key ];

			b2y =
				Math.round(
					b2Para.flow[ b2Para.flow.length - 1 ].y
					+
					this.getPNW( b2Key ).y
					-
					scrollp.y
				);
		}


		if( frontAt > 0 )
		{
			return(
				euclid_shape.create(
					'hull',
						[
							'start', // 1
								euclid_point.create(
									'x', rx,
									'y', b2y + descend
								),
							'line', // 2
								euclid_point.create(
									'x', bp.x,
									'y', b2y + descend
								),
							'line', // 3
								euclid_point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line', // 4
								euclid_point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line', // 5
								euclid_point.create(
									'x', lx,
									'y', f2y - ascend
								),
							'line', // 6
								euclid_point.create(
									'x', fp.x,
									'y', f2y - ascend
								),
							'line', // 7
								euclid_point.create(
									'x', fp.x,
									'y', fp.y - ascend
								),
							'line', // 8
								euclid_point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'0-line',
								'close'
						],
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
			return(
				euclid_shape.create(
					'hull',
						[
							'start', // 1
								euclid_point.create(
									'x', rx,
									'y', b2y + descend
								),
							'line', // 2
								euclid_point.create(
									'x', bp.x,
									'y', b2y + descend
								),
							'line', // 3
								euclid_point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line', // 4
								euclid_point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line', // 7
								euclid_point.create(
									'x', lx,
									'y', fp.y - ascend
								),
							'line', // 8
								euclid_point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'0-line',
								'close'
						],
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
doc.prototype.draw =
	function(
		display,     // to display within
		view,        // current pan/zoom/motion TODO
		width,       // the width to draw the document with
		scrollp      // scroll position
	)
{
	// FUTURE <pre>
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

	mark = this.mark;

	if(
		mark
		&&
		mark.reflect_ === 'marks_range'
		&&
		mark.itemPath.subPathOf( this.path )
	)
	{
		rs = this._getRangeShape( width, scrollp );

		// FUTURE have shapeRays handled more elegantly
		if( !Array.isArray( rs ) )
		{
			display.paint(
				theme.selection.style,
				rs,
				view
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
					theme.selection.style,
					rs[ a ],
					view
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

		para.draw( display, view.point( p ) );
	}
};


/*
| The para pnws.
*/
jools.lazyValue(
	doc.prototype,
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
			y;

		pnws = { };

		paraSep = this.paraSep;

		innerMargin = this.innerMargin;

		y = innerMargin.n;

		ranks = this.ranks;

		for(
			var r = 0, rZ = ranks.length;
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
	doc.prototype,
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
doc.prototype.getPNW =
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
	doc.prototype,
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
					twig[ key ].flow.widthUsed
				);
		}

		return widthUsed;
	}
);


/*
| The default font for the document.
*/
jools.lazyValue(
	doc.prototype,
	'font',
	function( )
	{
		return shell_fontPool.get( this.fontsize, 'la' );
	}
);


/*
| Returns the paragraph at point
*/
doc.prototype.getParaAtPoint =
	function(
		item, // TODO remove
		p
	)
{
	var
		key,
		para,
		pnws,
		ranks,
		twig;

	pnws = this.paraPNWs;

	ranks = this.ranks;

	twig = this.twig;

	for(
		var r = 0, rZ = ranks.length;
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
doc.prototype.input =
	function(
		text,
		item
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
		mark.reflect_ === 'marks_range'
		&& !mark.empty
	)
	{
		shell_peer.removeRange(
			mark.frontPath,
			mark.frontAt,
			mark.backPath,
			mark.backAt
		);

		// FIXME this is an akward workaround

		root.input( text );

		return true;
	}

	return (
		this
		.twig[ path.get( 5 ) ]
		.input( text, item )
	);
};


/*
| Handles a special key.
*/
doc.prototype.specialKey =
	function(
		key,
		item, // TODO remove ?
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
		mark.reflect_ === 'marks_range'
		&&
		!mark.empty
	)
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				shell_peer.removeRange(
					mark.frontPath,
					mark.frontAt,
					mark.backPath,
					mark.backAt
				);

				return true;

			case 'enter' :

				shell_peer.removeRange(
					mark.frontPath,
					mark.frontAt,
					mark.backPath,
					mark.backAt
				);

				root.specialKey(
					key,
					shift,
					ctrl
				);

				return true;
		}
	}


	return (
		this
		.twig[ mark.caretPath.get( 5 ) ]
		.specialKey(
			key,
			item,
			shift,
			ctrl
		)
	);
};


} )( );
