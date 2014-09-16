/*
| A sequence of paragraphs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	peer,
	visual;


/*
| Imports
*/
var
	euclid,
	fontPool,
	jools,
	root,
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
							'euclid.margin',
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
							'jion.path',
						defaultValue :
							undefined
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							undefined
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						defaultValue :
							undefined
					}
			},
		init :
			[
				'twigDup'
			],
		json :
			true,
		twig :
			[
				'visual.para'
			],
		node :
			true
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

	visual =
		{
			doc :
				require( '../jion/this' )( module )
		};
}


var
	doc;

doc = visual.doc;


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

	this._$pnws = null;

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

	this.twig = twig;
};


/*
| Returns the attention center.
*/
doc.prototype.attentionCenter =
	function(
		item // TODO remove
	)
{
	var
		path,
		key;

	if( !this.mark.hasCaret )
	{
		return 0;
	}

	path = this.mark.caretPath,

	key = path.get( 5 ); // FIXME

	return (
		this.getPNW( key ).y
		+
		this
		.twig[ key ]
		.attentionCenter
	);
};


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
/**/	if( mark.reflect !== 'marks.range' )
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
			euclid.shape.create(
				'hull',
					[
						'start',
							fp.add( 0, descend ),
						'line',
							fp.add( 0, -ascend ),
						'line',
							bp.add( 0, -ascend ),
						'line',
							bp.add( 0, descend ),
						'line',
							'close'
					],
				'pc',
					euclid.point.create(
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
				euclid.shape.create(
					'hull',
						[
							'start',
								euclid.point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'line',
								euclid.point.create(
									'x', fp.x,
									'y', fp.y - ascend
								),
							'line',
								euclid.point.create(
									'x', fp.x,
									'y', fp.y + descend
								),
							'line',
								euclid.point.create(
									'x', rx,
									'y', fp.y + descend
								),
							'0-line',
								'close'
						],
					'pc',
						euclid.point.create(
							'x', jools.half( fp.x + rx ),
							'y', jools.half( 2 * fp.y - ascend + descend )
						)
				),
				euclid.shape.create(
					'hull',
						[
							'start',
								euclid.point.create(
									'x', lx,
									'y', bp.y - ascend
								),
							'line',
								euclid.point.create(
									'x', bp.x,
									'y', bp.y - ascend
								),
							'line',
								euclid.point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line',
								euclid.point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line',
								'close'
						],
					'pc',
						euclid.point.create(
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
				euclid.shape.create(
					'hull',
						[
							'start', // 1
								euclid.point.create(
									'x', rx,
									'y', b2y + descend
								),
							'line', // 2
								euclid.point.create(
									'x', bp.x,
									'y', b2y + descend
								),
							'line', // 3
								euclid.point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line', // 4
								euclid.point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line', // 5
								euclid.point.create(
									'x', lx,
									'y', f2y - ascend
								),
							'line', // 6
								euclid.point.create(
									'x', fp.x,
									'y', f2y - ascend
								),
							'line', // 7
								euclid.point.create(
									'x', fp.x,
									'y', fp.y - ascend
								),
							'line', // 8
								euclid.point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'0-line',
								'close'
						],
					'pc',
						euclid.point.create(
							'x', jools.half( rx + lx ),
							'y', jools.half( b2y + descend + f2y - ascend )
						)
				)
			);
		}
		else
		{
			return(
				euclid.shape.create(
					'hull',
						[
							'start', // 1
								euclid.point.create(
									'x', rx,
									'y', b2y + descend
								),
							'line', // 2
								euclid.point.create(
									'x', bp.x,
									'y', b2y + descend
								),
							'line', // 3
								euclid.point.create(
									'x', bp.x,
									'y', bp.y + descend
								),
							'line', // 4
								euclid.point.create(
									'x', lx,
									'y', bp.y + descend
								),
							'0-line', // 7
								euclid.point.create(
									'x', lx,
									'y', fp.y - ascend
								),
							'line', // 8
								euclid.point.create(
									'x', rx,
									'y', fp.y - ascend
								),
							'0-line',
								'close'
						],
					'pc',
						euclid.point.create(
							'x', jools.half( rx + lx ),
							'y', jools.half( b2y + descend + f2y - ascend )
						)
				)
			);

		}
	}
};


/*
| Draws the document on a fabric.
*/
doc.prototype.draw =
	function(
		fabric,      // to draw upon
		view,        // current pan/zoom/motion TODO
		item,        // the item the doc belongs to TODO remove
		width,       // the width to draw the document with
		scrollp      // scroll position
	)
{
	// FIXME <pre>
	var
		mark,
		para,
		p,
		pnw,
		pnws,
		ranks,
		rs;

	mark = this.mark;

	if(
		mark.reflect === 'marks.range'
		&&
		mark.itemPath.equals( item.path )
	)
	{
		rs = this._getRangeShape( width, scrollp );

		// FUTURE have shapeRays handled more elegantly
		if( !Array.isArray( rs ) )
		{
			fabric.paint(
				theme.selection.style,
				rs,
				view
			);
		}
		else
		{
			for(
				var a = 0, aZ = rs.length;
				a < aZ;
				a++
			)
			{
				fabric.paint(
					theme.selection.style,
					rs[ a ],
					view
				);
			}
		}
	}

	// north-west points of paras
	pnws = this.getPNWs( );

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

		para.draw(
			fabric,
			view.point( p )
		);
	}
};


/*
| Returns the para pnws
|
| FIXME use jools lazyFunc
*/
doc.prototype.getPNWs =
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

	if( this._$pnws )
	{
		return this._$pnws;
	}

	pnws = this._$pnws = { };

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
			euclid.point.create(
				'x',
					innerMargin.w,
				'y',
					Math.round( y )
			);

		y += flow.height + paraSep;
	}

	return pnws;
};

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
	return this.getPNWs( )[ key ];
};


/*
| The width actually used by the document.
*/
jools.lazyValue(
	doc.prototype,
	'spread',
	function( )
	{
		var
			max,
			spread,
			twig;

		spread = 0;

		twig = this.twig;

		max = Math.max;

		for( var key in twig )
		{
			spread =
				max(
					spread,
					twig[ key ].flow.spread
				);
		}

		return spread;
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
		return fontPool.get( this.fontsize, 'la' );
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
		k,
		para,
		pnws,
		ranks,
		twig;

	pnws = this.getPNWs( );

	ranks = this.ranks;

	twig = this.twig;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		// FIXME use atRank
		k = ranks[ r ];

		para = twig[ k ];

		if( p.y < pnws[ k ].y + para.flow.height )
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
		mark =
			this.mark;

	if( !this.mark.hasCaret )
	{
		return false;
	}

	var
		path =
			this.mark.caretPath;

	if(
		mark.reflect === 'marks.range'
		&&
		!mark.empty
	)
	{
		peer.removeRange(
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
		.input(
			text,
			item
		)
	);
};


/*
| Handles a special key.
*/
doc.prototype.specialKey =
	function(
		key,
		item,
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
		mark.reflect === 'marks.range'
		&&
		!mark.empty
	)
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				peer.removeRange(
					mark.frontPath,
					mark.frontAt,
					mark.backPath,
					mark.backAt
				);

				return true;

			case 'enter' :

				peer.removeRange(
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





/*
| Node export.
*/
if( SERVER )
{
	module.exports = doc;
}


} )( );
