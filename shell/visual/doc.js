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
|
| TODO: make fontsize into doc twig
*/
var Doc =
Visual.Doc =
	function(
		overload,
		inherit,
		a1,   // twig       | phrase
		a2,   // path       | fontsize
		a3    // fontsize
	)
{
	var
		sub;

	this._$pnws =
		null;

	switch( overload )
	{
		case 'twig' :

			var
				twig =
					a1,

				path =
					a2,

				ranks =
					twig.ranks,

				copse =
					twig.copse;

			Visual.Base.call(
				this,
				twig,
				path
			);

			this.fontsize =
				a3;

			this.ranks =
				ranks;

			sub =
			this.$sub =
				[ ];

			for(
				var r = 0, rZ = twig.length;
				r < rZ;
				r++
			)
			{
				var k =
					ranks[ r ];

				if(
					inherit &&
					inherit.twig.copse[ k ] === copse[ k ]
				)
				{
					sub[ k ] =
						inherit.$sub[ k ];
				}
				else
				{
					sub[ k ] =
						new Visual.Para(
							'twig',
							copse[ k ],
							new Path(
								path,
								'++', k
							)
						);
				}
			}

			break;

		case 'phrase' :

			var
				phrase =
					a1;

			this.fontsize =
				a2;

			Visual.Base.call(
				this,
				null,
				null
			);

			sub =
			this.$sub =
				[ ];

			this.ranks =
				[
					'1'
				];

			sub[ '1' ] =
				new Visual.Para(
					'phrase',
					phrase
				);

			break;

		default :

			throw new Error(
				'invalid overload'
			);
	}
};


Jools.subclass(
	Doc,
	Visual.Base
);


/*
| Marker
*/
Doc.prototype.Doc =
	true;


/*
| Returns the vtwig at rank 'rank'.
*/
Doc.prototype.atRank =
	function( rank )
{
	return this.$sub[ this.ranks[ rank ] ];
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
		paraSep =
			this.getParaSep( item ),

		selection =
			shell.getSelection( ),

		innerMargin =
			item.innerMargin;

	// draws the selection
	if (
		selection &&
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
		y =
			innerMargin.n,

		// north-west points of paras
		pnws =
			{ },

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
				vpara.getFlow( item );

		pnws[ ranks[ r ] ] =
			new Euclid.Point(
				innerMargin.w,
				Math.round( y )
			);

		var p =
			new Euclid.Point(
				innerMargin.w,
				Math.round( y - scrollp.y )
			);

		vpara.draw(
			this,
			fabric,
			view,
			item,
			view.point( p )
		);

		y += flow.height + paraSep;
	}

	this._$pnws = pnws;   // north-west points of paras
};


/*
| Returns the height of the document.
| FIXME caching
*/
Doc.prototype.getHeight =
	function(
		item
	)
{
	if(! Jools.is( item ) )
	{
		throw new Error(
			'TODO'
		);
	}

	var
		fs =
			this.getFont( item ).size,

		paraSep =
			this.getParaSep( item ),

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
				vpara.getFlow( item );

		if( r > 0 )
		{
			height += paraSep;
		}

		height += flow.height;
	}

	height += Math.round( fs * theme.bottombox );

	return height;
};


/*
| returns the north-west point of the paragraph with the key 'key'.
*/
Doc.prototype.getPNW =
	function( key )
{
	return this._$pnws[ key ];
};


/*
| Returns the width actually used of the document.
*/
Doc.prototype.getSpread =
	function( item )
{
	var
		spread =
			0,

		sub =
			this.$sub,

		max =
			Math.max;

	for( var k in sub )
	{
		spread =
			max(
				spread,
				sub[ k ].getFlow( item ).spread
			);
	}

	return spread;
};


/*
| Returns the default font for the document.
*/
Doc.prototype.getFont =
	function( item )
{
	if(! Jools.is( item ) )
	{
		throw new Error(
			'TODO'
		);
	}

	var fontsize =
		this.fontsize;

	if( item.fontSizeChange )
	{
		fontsize =
			item.fontSizeChange( fontsize );
	}

	var f =
		this._$font;

	if( f && f.size === fontsize )
	{
		return f;
	}

	f =
	this._$font =
		fontPool.get( fontsize, 'la' );

	return f;
};


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
			this.$sub,

		pnws =
			this._$pnws;

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

		if( p.y < pnws[ k ].y + vpara.getFlow( item ).height )
		{
			return vpara;
		}
	}

	return null;
};



/*
| Returns the (default) paraSeperator for this document.
| Parameter item is optional,
| just to safe double and tripple lookups.
*/
Doc.prototype.getParaSep =
	function( item )
{
	if( !Jools.is( item ) )
	{
		throw new Error('TODO');
	}

	var fs =
		this.getFont( item ).size;

	return item.getParaSep( fs );
};


/*
| Force-clears all caches.
*/
Doc.prototype.knock =
	function( )
{
	for(
		var r = 0, rZ = this.ranks.length;
		r < rZ;
		r++
	)
	{
		this.atRank( r ).knock( );
	}
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
			shell.getSelection( ),

		space =
			shell.$space;

	selection.normalize( space );

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
			this.getPNW( key1 ),

		pnw2 =
			this.getPNW( key2 ),

		vpara1 =
			this.$sub[ key1 ],

		vpara2 =
			this.$sub[ key2 ],

		p1 =
			vpara1.locateOffset(
				item,
				s1.at1
			),

		p2 =
			vpara2.locateOffset(
				item,
				s2.at1
			),

		fontsize =
			this.getFont( item ).size,

		descend =
			Math.round( fontsize * theme.bottombox ),

		ascend =
			Math.round( fontsize ),

		rx =
			width - innerMargin.e,

		lx =
			innerMargin.w;

	p1 =
		new Euclid.Point(
			Math.round( p1.x + pnw1.x - sp.x ),
			Math.round( p1.y + pnw1.y - sp.y )
		);

	p2 =
		new Euclid.Point(
			Math.round( p2.x + pnw2.x - sp.x ),
			Math.round( p2.y + pnw2.y - sp.y )
		);

	if( ( Math.abs( p2.y - p1.y ) < 2 ) )
	{
		// ***
		fabric.moveTo( p1.x, p1.y + descend, view );
		fabric.lineTo( p1.x, p1.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y -  ascend, view );
		fabric.lineTo( p2.x, p2.y + descend, view );
		fabric.lineTo( p1.x, p1.y + descend, view );
	}
	else if ( Math.abs( p1.y + fontsize + descend - p2.y ) < 2 && ( p2.x <= p1.x ) )
	{
		//      ***
		// ***
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
		//    *****
		// *****
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
