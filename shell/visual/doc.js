/*
| A sequence of paragraphs.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;

Visual =
	Visual || { };


/*
| Imports
*/
var
	fontPool,
	Jools,
	shellverse,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if ( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}


var
	_tag =
		'DOC-15472002';


/*
| Constructor.
*/
var Doc =
Visual.Doc =
	function(
		tag,
		inherit,
		tree,
		path,
		fontsize,
		flowWidth,
		paraSep,
		mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	var
		ranks,
		sub;

	Visual.Base.call(
		this,
		tree,
		path
	);

	this.fontsize =
		fontsize;

	this.flowWidth =
		flowWidth;

	this.paraSep =
		paraSep;

	this._$pnws =
		null;

	this.mark =
		mark;

	if( CHECK )
	{
		if( !tree )
		{
			throw new Error(
				'tree missing.'
			);
		}

		if( !fontsize )
		{
			throw new Error(
				'fontsize missing'
			);
		}

		if( !Jools.is( this.flowWidth ) )
		{
			throw new Error(
				'flowWidth missing'
			);
		}

		if( typeof( paraSep ) !== 'number' )
		{
			throw new Error(
				'paraSep missing'
			);
		}
	}

	sub =
	this.sub =
		[ ];

	ranks =
	this.ranks =
		tree.ranks;

	var
		twig =
			tree.twig;

	for(
		var r = 0, rZ = tree.length;
		r < rZ;
		r++
	)
	{
		var
			k =
				ranks[ r ],

			paraPath =
				path &&  // TODO is this ever null?
				path.appendNC( k );

		sub[ k ] =
			Visual.Para.create(
				'inherit',
					inherit && inherit.sub[ k ],
				'tree',
					twig[ k ],
				'path',
					paraPath,
				'fontsize',
					fontsize,
				'flowWidth',
					flowWidth,
				'mark',
					mark.concerns( paraPath )
			);
	}
};


Jools.subclass(
	Doc,
	Visual.Base
);


/*
| Creates a new doc.
*/
Doc.create =
	function(
		// free strings
	)
{
	var
		tree =
			null,

		fontsize =
			null,

		flowWidth =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		paraSep =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'flowWidth' :

				flowWidth =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'paraSep' :

				paraSep =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}


	if( inherit )
	{
		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}


		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
		}

		if( flowWidth === null )
		{
			flowWidth =
				inherit.flowWidth;
		}

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( paraSep === null )
		{
			paraSep =
				inherit.paraSep;
		}

		if(
			inherit.tree === tree &&
			(
				inherit.path && inherit.path.equals( path )
			)
			&&
			inherit.fontsize === fontsize
			&&
			inherit.flowWidth === flowWidth
			&&
			inherit.paraSep === paraSep
			&&
			inherit.mark.equals( mark )
		)
		{
			return inherit;
		}
	}

	return (
		new Doc(
			_tag,
			inherit,
			tree,
			path,
			fontsize,
			flowWidth,
			paraSep,
			mark
		)
	);
};

/*
| Marker
*/
Doc.prototype.Doc =
	true;


/*
| Returns the tree at rank 'rank'.
*/
Doc.prototype.atRank =
	function(
		rank
	)
{
	return (
		this.sub[ this.ranks[ rank ] ]
	);
};


/*
| Draws the document on a fabric.
*/
Doc.prototype.draw =
	function(
		fabric,      // to draw upon
		view,        // current pan/zoom/motion
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
		mark.reflect === 'Range'
		&&
		mark.concerns( this.path )
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
			view,
			view.point( p )
		);
	}
};


/*
| Returns the para pnws
*/
Doc.prototype.getPNWs =
	function(
		item // the item this doc belongs to
	)
{
	if( this._$pnws )
	{
		return this._$pnws;
	}

	var
		pnws =
		this._$pnws =
			{ },

		paraSep =
			this.paraSep,

		innerMargin =
			item.innerMargin,

		y =
			innerMargin.n,

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

			flow =
				vpara.flow;

		pnws[ ranks[ r ] ] =
			shellverse.grow(
				'Point',
				'x',
					innerMargin.w,
				'y',
					Math.round( y )
			);

		y +=
			flow.height + paraSep;
	}

	return pnws;
};

/*
| Returns the height of the document.
*/
Jools.lazyFixate(
	Doc.prototype,
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
Doc.prototype.getPNW =
	function(
		item,
		key
	)
{
	return this.getPNWs( item )[ key ];
};


/*
| Returns the width actually used by the document.
*/
Jools.lazyFixate(
	Doc.prototype,
	'spread',
	function( )
	{
		var
			spread =
				0,

			sub =
				this.sub,

			max =
				Math.max;

		for( var k in sub )
		{
			spread =
				max(
					spread,
					sub[ k ].flow.spread
				);
		}

		return spread;
	}
);


/*
| Returns the default font for the document.
*/
Jools.lazyFixate(
	Doc.prototype,
	'font',
	function( )
	{
		return fontPool.get( this.fontsize, 'la' );
	}
);


/*
| Returns the paragraph at point
*/
Doc.prototype.getParaAtPoint =
	function(
		item,
		p
	)
{
	var
		ranks =
			this.ranks,

		sub =
			this.sub,

		pnws =
			this.getPNWs( item );

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
				sub[ k ];

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
Doc.prototype.input =
	function(
		text
	)
{
	if( !this.mark.hasCaret )
	{
		return false;
	}

	var
		path =
			this.mark.caretPath;

	return (
		this
			.sub[ path.get( 3 ) ]
			.input(
				text
			)
	);
};


/*
| Handles a special key.
*/
Doc.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	if( !this.mark.hasCaret )
	{
		return false;
	}

	var
		path =
			this.mark.caretPath;

	return (
		this
			.sub[ path.get( 3 ) ]
			.specialKey(
				key,
				shift,
				ctrl
			)
	);
};



/*
| Sketches a selection.
*/
Doc.prototype.sketchRange =
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
		sp =
			scrollp,

		mark =
			this.mark;

	if( CHECK )
	{
		if( mark.reflect !== 'Range' )
		{
			throw new Error(
				'wrong mark'
			);
		}
	}

	var
		tree =
			this.tree,

		frontPath =
			mark.frontPath,

		frontAt =
			mark.frontAt,

		backPath =
			mark.backPath,

		backAt =
			mark.backAt,

		frontKey =
			frontPath.get( -2 ),

		backKey =
			backPath.get( -2 ),

		frontPnw =
			this.getPNW( item, frontKey ),

		backPnw =
			this.getPNW( item, backKey ),

		frontPara =
			this.sub[ frontKey ],

		backPara =
			this.sub[ backKey ],

		fo =
			frontPara.locateOffset(
				frontAt
			),

		bo =
			backPara.locateOffset(
				backAt
			),

		fp =
			fo.p,

		bp =
			bo.p,

		fontsize =
			this.fontsize,

		descend =
			Math.round( fontsize * theme.bottombox ),

		ascend =
			Math.round( fontsize ),

		rx =
			width - innerMargin.e,

		lx =
			innerMargin.w;

	// FIXME do not grow points

	fp =
		shellverse.grow(
			'Point',
			'x',
				Math.round( fp.x + frontPnw.x - sp.x ),
			'y',
				Math.round( fp.y + frontPnw.y - sp.y )
		);

	bp =
		shellverse.grow(
			'Point',
			'x',
				Math.round( bp.x + backPnw.x - sp.x ),
			'y',
				Math.round( bp.y + backPnw.y - sp.y )
		);

	var
		frontFlow =
			frontPara.flow,

		backFlow =
			backPara.flow,

		frontRank =
			tree.rankOf( frontKey ),

		f2Key =
			( frontRank + 1 < tree.length )
				?
				( tree.ranks[ frontRank + 1 ] )
				:
				( null ),

		f2Para =
			f2Key
			&&
			this.sub[ f2Key ];


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
		//          6 7            8
		//        fp o*************
		// fp2  x******************
		//    5 *******************
		//      ******************x  bp2
		//      ************o bp   1
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
					tree.rankOf( backKey ),

				b2Key =
					tree.ranks[ backRank - 1 ],

				b2Para =
					this.sub[ b2Key ];

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

		if( twist )
		{
			fabric.moveTo( lx, f2y - ascend, view ); // 5
		}
		else
		{
			fabric.lineTo( lx, f2y - ascend, view ); // 5
		}
		fabric.lineTo( fp.x, f2y  - ascend, view );   // 6

		fabric.lineTo( fp.x, fp.y -  ascend, view );   // 7
		fabric.lineTo( rx,   fp.y -  ascend, view );   // 8

		if( !twist )
		{
			fabric.lineTo( rx, bp.y - ascend, view );
		}
	}
};


} )( );
