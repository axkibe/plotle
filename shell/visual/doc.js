/*
| A sequence of visual paragraphs.
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
	Euclid,
	fontPool,
	Jools,
	Path,
	shell,
	shellverse,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if ( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code requires a browser!'
	);
}


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
		paraSep
	)
{
	if( CHECK )
	{
		if( tag !== 'XOXO' )
		{
			throw new Error(
				'do not call new Doc directly'
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
		var k =
			ranks[ r ];

		sub[ k ] =
			Visual.Para.create(
				'inherit',
					inherit && inherit.sub[ k ],
				'tree',
					twig[ k ],
				'path',
					path &&
					new Path(
						path,
						'++', k
					),
				'fontsize',
					fontsize,
				'flowWidth',
					flowWidth
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

		inherit =
			null,

		path =
			null,

		fontsize =
			null,

		flowWidth =
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
			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'flowWidth' :

				flowWidth =
					arguments[ a + 1 ];

				break;

			case 'paraSep' :

				paraSep =
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

		if( paraSep === null )
		{
			paraSep =
				inherit.paraSep;
		}

		if(
			inherit.tree === tree &&
			(
				inherit.path === path ||
				( inherit.path && inherit.path.equals( path ) )
			) &&
			inherit.fontsize === fontsize &&
			inherit.flowWidth === flowWidth &&
			inherit.paraSep === paraSep
		)
		{
			return inherit;
		}
	}

	return (
		new Doc(
			'XOXO',
			inherit,
			tree,
			path,
			fontsize,
			flowWidth,
			paraSep
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
		selection =
			shell.getSelection( ),

		innerMargin =
			item.innerMargin;

	// draws the selection
	if (
		selection &&
		this.path &&
		this.path.subPathOf( selection.sign1.path )
	)
	{
		fabric.paint(
			theme.selection.style,
			this,
			'sketchSelection',
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
		item
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
	return this.getPNWs(item)[ key ];
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
| Sketches a selection.
*/
Doc.prototype.sketchSelection =
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
		selection =
			shell.getSelection( );

	selection.normalize( shell.$space );

	var
		sp =
			scrollp,

		s1 =
			selection.$begin,

		s2 =
			selection.$end,

		key1 =
			s1.path.get( -2 ),

		key2 =
			s2.path.get( -2 ),

		pnw1 =
			this.getPNW( item, key1 ),

		pnw2 =
			this.getPNW( item, key2 ),

		para1 =
			this.sub[ key1 ],

		para2 =
			this.sub[ key2 ],

		o1 =
			para1.locateOffset(
				s1.at1
			),

		o2 =
			para2.locateOffset(
				s2.at1
			),

		p1 =
			o1.p,

		p2 =
			o2.p,

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

	p1 =
		shellverse.grow(
			'Point',
			'x',
				Math.round( p1.x + pnw1.x - sp.x ),
			'y',
				Math.round( p1.y + pnw1.y - sp.y )
		);

	p2 =
		shellverse.grow(
			'Point',
			'x',
				Math.round( p2.x + pnw2.x - sp.x ),
			'y',
				Math.round( p2.y + pnw2.y - sp.y )
		);

	if(
		key1 === key2 &&
		o1.line === o2.line
	)
	{
		// p1***p2
		fabric.moveTo( p1.x, p1.y + descend, view );
		fabric.lineTo( p1.x, p1.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y + descend, view );
		fabric.lineTo( p1.x, p1.y + descend, view );
	}
	else if (
		p2.y - ascend - 1 <= p1.y + descend &&
		p2.x < p1.x
	)
	{
		//        p1***
		// ***p2
		fabric.moveTo( rx,   p1.y -  ascend, view );
		fabric.lineTo( p1.x, p1.y -  ascend, view );
		fabric.lineTo( p1.x, p1.y + descend, view );
		fabric.lineTo( rx,   p1.y + descend, view );

		fabric.moveTo( lx,   p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y + descend, view );
		fabric.lineTo( lx,   p2.y + descend, view );
	}
	else
	{
		//   p1*******
		// ******p2
		fabric.moveTo( rx,   p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y + descend, view );
		fabric.lineTo( lx,   p2.y + descend, view );

		if( twist )
		{
			fabric.moveTo( lx, p1.y + descend, view );
		}
		else
		{
			fabric.lineTo( lx, p1.y + descend, view );
		}
		fabric.lineTo( p1.x, p1.y + descend, view );


		fabric.lineTo( p1.x, p1.y -  ascend, view );
		fabric.lineTo( rx,   p1.y -  ascend, view );

		if( !twist )
		{
			fabric.lineTo( rx, p2.y - ascend, view );
		}
	}
};


} )( );
