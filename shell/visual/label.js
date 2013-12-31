/*
| An item with resizing text.
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
	Jools,
	shell,
	shellverse,
	Style,
	theme,
	Visual;


/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


var
	_tag =
		'LABEL-30268594';


/*
| Constructor.
*/
var Label =
Visual.Label =
	function(
		tag,
		tree,
		path,
		pnw,
		fontsize,
		doc,
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

		if( fontsize !== doc.fontsize )
		{
			throw new Error(
				'fontsize mismatch'
			);
		}

		if( !mark )
		{
			throw new Error(
				'invalid mark'
			);
		}
	}

	Visual.DocItem.call(
		this,
		tree,
		path,
		doc
	);

	this.pnw =
		pnw;

	var
		height =
			doc.height;

	this.zone =
		Euclid.Rect.create(
			'pnw/size',
			pnw,
			Math.round(
				Math.max(
					doc.spread + 3,
					height / 4
				)
			),
			Math.round(
				height + 2
			)
		);

	this.fontsize =
		fontsize;

	this.mark =
		mark;
};


/*
| Creates a new Label
*/
Label.create =
	function(
		// free strings
	)
{
	var
		doc =
			null,

		fontsize =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		pnw =
			null,

		tree =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'doc' :

				doc =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
					arguments[ a + 1 ];

				break;

			case 'hover' :

				// ignored

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'pnw' :

				pnw =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				// FIXME ignoring

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

	if( tree )
	{
		if( CHECK && !path )
		{
			throw new Error(
				'tree needs path'
			);
		}

		if( fontsize === null )
		{
			fontsize =
				tree.twig.fontsize;
		}

		if( pnw === null )
		{
			pnw =
				tree.twig.pnw;
		}
	}


	if( inherit )
	{
		if( doc === null )
		{
			doc =
				inherit.sub.doc;
		}

		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !mark )
		{
			mark =
				inherit.mark;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if( pnw  === null )
		{
			pnw =
				inherit.pnw;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
		}
	}

	doc =
		Visual.Doc.create(
			'inherit',
				doc,
			'tree',
				tree && tree.twig.doc,
			'path',
				inherit ?
					inherit.sub.doc.path
					:
					(
						path
						&&
						path.append( 'doc' )
					),
			'fontsize',
				fontsize,
			'flowWidth',
				0,
			'paraSep',
				Math.round( fontsize / 20 ),
			'mark',
				mark
		);

	// FIXME return inherit

	return (
		new Label(
			_tag,
			tree,
			path,
			pnw,
			fontsize,
			doc,
			mark
		)
	);

};


Jools.subclass(
	Label,
	Visual.DocItem
);


/*
| Labels use pnw/fontsize for positioning
*/
Label.prototype.positioning =
	'pnw/fontsize';


/*
| Self referencing creator.
*/
Label.prototype.creator =
	Label;


/*
| Default margin for all labels.
*/
Label.prototype.innerMargin =
	new Euclid.Margin(
		theme.label.innerMargin
	);


/*
| Resize handles to show on labels
*/
Label.prototype.handles =
	Jools.immute(
		{
			ne :
				true,

			se :
				true,
			sw :
				true,

			nw :
				true
		}
	);


/*
| Highlights the label.
*/
Label.prototype.highlight =
	function(
		fabric,
		view
	)
{
	fabric.edge(
		Style.getStyle(
			theme.label.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		view
	);
};


/*
| Returns the labels silhoutte.
*/
Jools.lazyFixate(
	Label.prototype,
	'silhoutte',
	function( )
	{
		return (
			Euclid.Rect.create(
				'pnw/pse',
				this.zone.pnw,
				this.zone.pse.sub( 1, 1 )
			)
		);
	}
);


/*
| Returns the items silhoutte anchored at zero.
*/
Jools.lazyFixate(
	Label.prototype,
	'zeroSilhoutte',
	function( )
	{
		var
			zone =
				this.zone;

		return (
			Euclid.Rect.create(
				'pse',
				shellverse.grow(
					'Point',
					'x',
						Math.max( zone.width  - 1, 0 ),
					'y',
						Math.max( zone.height - 1, 0 )
				)
			)
		);
	}
);


/*
| Sets the items position and size aften an action.
*/
Label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action =
			shell.action( );

	switch( action.reflect )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			var
				zone =
					this.zone,

				fontsize =
					this.sub.doc.font.twig.size;

			if(
				!this.tree.twig.pnw.equals( zone.pnw )
			)
			{
				shell.peer.setPNW(
					this.path,
					zone.pnw
				);
			}

			if( fontsize !== this.tree.twig.fontsize )
			{
				shell.peer.setFontSize(
					this.path,
					fontsize
				);
			}

			shell.redraw =
				true;

			break;

		default :

			return Visual.DocItem.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


/*
| Draws the label.
|
| FIXME: move the common stuff into Visual.Item.draw()
|        and make the specific into weave()
*/
Label.prototype.draw =
	function(
		fabric,
		view
	)
{
	var
		f =
			this.$fabric,

		zone =
			view.rect( this.zone );

	// no buffer hit?
	if (
		true || // TODO, without there are issues with selection
		!f ||
		view.zoom !== f.$zoom
	)
	{
		f =
		this.$fabric =
			new Euclid.Fabric(
				zone.width,
				zone.height
			);

		f.$zoom =
			view.zoom;

		var
			doc =
				this.sub.doc;

		// draws selection and text
		doc.draw(
			f,
			view.home( ),
			this,
			zone.width,
			Euclid.Point.zero
		);

		// draws the border
		f.edge(
			Style.getStyle(
				theme.label.style,
				'normal'
			),
			this.zeroSilhoutte,
			'sketch',
			view.home( )
		);
	}

	fabric.drawImage(
		'image',
			f,
		'pnw',
			zone.pnw
	);
};


/*
| Mouse wheel turned.
*/
Label.prototype.mousewheel =
	function(
		// view,
		// p,
		// dir
	)
{
	return false;
};



/*
| Dummy since a label does not scroll.
*/
Label.prototype.scrollMarkIntoView =
	function( )
{
	// nada
};


/*
| Dummy since a label does not scroll.
*/
Label.prototype.scrollPage =
	function(
		// up
	)
{
	// nada
};

} )( );
