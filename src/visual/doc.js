/*
| A sequence of paragraphs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Peer,
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
		name :
			'doc',
		unit :
			'visual',
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

	this.twig =
		twig;
};


/*
| Returns the attention center.
*/
doc.prototype.attentionCenter =
	function(
		item
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
		this.getPNW( item, key ).y
		+
		this
		.twig[ key ]
		.attentionCenter
	);
};

/*
| Draws the document on a fabric.
*/
doc.prototype.draw =
	function(
		fabric,      // to draw upon
		view,        // current pan/zoom/motion TODO
		item,        // the item the doc belongs to
		width,       // the width to draw the document with
		scrollp      // scroll position
	)
{
	// FIXME <pre>
	var
		innerMargin =
			item.innerMargin,

		mark =
			this.mark;

	if(
		mark.reflect === 'marks.range'
		&&
		mark.itemPath.equals( item.path )
	)
	{
		fabric.paint(
			theme.selection.style,
			this,
			'sketchRange',
			view,
			item,
			width,
			innerMargin,
			scrollp
		);
	}

	var
		// north-west points of paras
		pnws =
			this.getPNWs( item ),

		ranks =
			this.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			vpara =
				this.atRank( r ),
			pnw =
				pnws[ ranks[ r ] ],
			p =
				pnw.sub(
					0,
					Math.round( scrollp.y )
				);

		vpara.draw(
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
	function(
		item // the item this doc belongs to
	)
{
	var
		flow,
		innerMargin,
		paraSep,
		pnws,
		ranks,
		vpara,
		y;

	if( this._$pnws )
	{
		return this._$pnws;
	}

	pnws = this._$pnws = { };

	paraSep = this.paraSep;

	innerMargin = item.innerMargin;

	y = innerMargin.n;

	ranks = this.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		vpara = this.atRank( r );

		flow = vpara.flow;

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
			fs =
				this.fontsize,
			paraSep =
				this.paraSep,
			ranks =
				this.ranks,
			height =
				0;

		for(
			var r = 0, rZ = ranks.length;
			r < rZ;
			r++
		)
		{
			var
				vpara =
					this.atRank( r ),
				flow =
					vpara.flow;

			if( r > 0 )
			{
				height +=
					paraSep;
			}

			height +=
				flow.height;
		}

		height +=
			Math.round( fs * theme.bottombox );

		return height;
	}
);


/*
| returns the north-west point of the paragraph with the key 'key'.
*/
doc.prototype.getPNW =
	function(
		item,
		key
	)
{
	return this.getPNWs( item )[ key ];
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
			spread =
				0,
			twig =
				this.twig,
			max =
				Math.max;

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
		item,
		p
	)
{
	var
		pnws =
			this.getPNWs( item ),
		ranks =
			this.ranks,
		twig =
			this.twig;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		var
			k =
				ranks[ r ],
			vpara =
				twig[ k ];

		if( p.y < pnws[ k ].y + vpara.flow.height )
		{
			return vpara;
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
		Peer.removeRange(
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
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return false;
	}

	if( mark.reflect === 'marks.range' )
	{
		switch( key )
		{
			case 'backspace' :
			case 'del' :

				if( !mark.empty )
				{
					Peer.removeRange(
						mark.frontPath,
						mark.frontAt,
						mark.backPath,
						mark.backAt
					);
				}

				return true;

			case 'enter' :

				if( !mark.empty )
				{
					Peer.removeRange(
						mark.frontPath,
						mark.frontAt,
						mark.backPath,
						mark.backAt
					);
				}

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
| Sketches a selection.
*/
doc.prototype.sketchRange =
	function(
		fabric,      // the fabric to path for
		border,      // width of the path (ignored)
		twist,       // true -> drawing a border, false -> fill
		view,        // current view
		item,        // the item of the doc
		width,       // width the vdoc is drawn
		innerMargin, // inner margin of the doc
		scrollp      // scroll position of the doc
	)
{
	var
		ascend,
		backAt,
		backFlow,
		backKey,
		backPath,
		backPara,
		backPnw,
		bo,
		bp,
		descend,
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
		lx,
		mark,
		rx,
		sp;

	sp =
		scrollp,

	mark =
		this.mark;

/**/if( CHECK )
/**/{
/**/	if( mark.reflect !== 'marks.range' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	frontPath =
		mark.frontPath;

	frontAt =
		mark.frontAt;

	backPath =
		mark.backPath;

	backAt =
		mark.backAt;

	frontKey =
		frontPath.get( -2 );

	backKey =
		backPath.get( -2 );

	frontPnw =
		this.getPNW( item, frontKey );

	backPnw =
		this.getPNW( item, backKey );

	frontPara =
		this.twig[ frontKey ];

	backPara =
		this.twig[ backKey ];

	fo =
		frontPara.locateOffset( frontAt );

	bo =
		backPara.locateOffset( backAt );

	fp =
		fo.p;

	bp =
		bo.p;

	fontsize =
		this.fontsize;

	descend =
		Math.round( fontsize * theme.bottombox );

	ascend =
		Math.round( fontsize );

	rx =
		width - innerMargin.e;

	lx =
		innerMargin.w;

	// FIXME do not create points

	fp =
		fp.add(
			frontPnw.x - sp.x,
			frontPnw.y - sp.y
		);

	bp =
		bp.add(
			backPnw.x - sp.x,
			backPnw.y - sp.y
		);

	frontFlow =
		frontPara.flow;

	backFlow =
		backPara.flow;

	frontRank =
		this.rankOf( frontKey );

	f2Key =
		( frontRank + 1 < this.ranks.length )
			?
			this.ranks[ frontRank + 1 ]
			:
			null;

	f2Para =
		f2Key
		&&
		this.twig[ f2Key ];

	if(
		frontKey === backKey &&
		fo.line === bo.line
	)
	{
		// fp o******o bp

		fabric.moveTo( fp.x, fp.y + descend, view );
		fabric.lineTo( fp.x, fp.y - ascend,  view );
		fabric.lineTo( bp.x, bp.y - ascend,  view );
		fabric.lineTo( bp.x, bp.y + descend, view );
		fabric.lineTo( fp.x, fp.y + descend, view );
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

		fabric.moveTo( rx,   fp.y -  ascend, view );
		fabric.lineTo( fp.x, fp.y -  ascend, view );
		fabric.lineTo( fp.x, fp.y + descend, view );
		fabric.lineTo( rx,   fp.y + descend, view );

		fabric.moveTo( lx,   bp.y -  ascend, view );
		fabric.lineTo( bp.x, bp.y -  ascend, view );
		fabric.lineTo( bp.x, bp.y + descend, view );
		fabric.lineTo( lx,   bp.y + descend, view );
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

		var
			f2y =
				null,
			b2y =
				null;

		if( fo.line + 1 < frontFlow.length )
		{
			f2y =
				Math.round(
					frontFlow[ fo.line + 1 ].y +
						frontPnw.y -
						sp.y
				);
		}
		else
		{
			f2y =
				Math.round(
					f2Para.flow[ 0 ].y +
						this.getPNW( item, f2Key ).y -
						sp.y
				);
		}

		if( bo.line > 0 )
		{
			b2y =
				Math.round(
					backFlow[ bo.line - 1 ].y +
						backPnw.y -
						sp.y
				);
		}
		else
		{
			var
				backRank =
					this.rankOf( backKey ),
				b2Key =
					this.ranks[ backRank - 1 ],
				b2Para =
					this.twig[ b2Key ];

			b2y =
				Math.round(
					b2Para.flow[ b2Para.flow.length - 1 ].y +
						this.getPNW( item, b2Key ).y -
						sp.y
				);
		}

		fabric.moveTo( rx,     b2y  + descend, view ); // 1
		fabric.lineTo( bp.x,   b2y  + descend, view ); // 2
		fabric.lineTo( bp.x,   bp.y + descend, view ); // 3
		fabric.lineTo( lx,     bp.y + descend, view ); // 4

		if( frontAt > 0 )
		{
			if( twist )
			{
				fabric.moveTo( lx, f2y - ascend, view ); // 5
			}
			else
			{
				fabric.lineTo( lx, f2y - ascend, view ); // 5
			}
			fabric.lineTo( fp.x, f2y  - ascend, view );  // 6
		}

		if( frontAt > 0 || !twist )
		{
			fabric.lineTo( fp.x, fp.y -  ascend, view ); // 7
		}
		else
		{
			fabric.moveTo( fp.x, fp.y -  ascend, view ); // 7
		}

		fabric.lineTo( rx,   fp.y -  ascend, view );   // 8

		if( !twist )
		{
			fabric.lineTo( rx, bp.y - ascend, view );
		}
	}
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = doc;
}


} )( );
