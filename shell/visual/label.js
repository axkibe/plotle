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
	Action,
	config,
	Euclid,
	fontPool,
	Jools,
	Path,
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


if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


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
		doc
	)
{
	if( CHECK )
	{
		if( tag !== 'XOXO' )
		{
			throw new Error(
				'do not call new Label directly'
			);
		}

		if( fontsize !== doc.fontsize )
		{
			throw new Error(
				'fontsize mismatch'
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
		h =
			doc.getHeight( );

	this.zone =
		Euclid.Rect.create(
			'pnw/size',
			pnw,
			Math.round(
				Math.max(
					doc.getSpread( ),
					h / 4
				)
			),
			Math.round(
				h
			)
		);

	this.fontsize =
		fontsize;
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
		tree =
			null,

		path =
			null,

		inherit =
			null,

		pnw =
			null,

		zone =
			null,

		doc =
			null,

		fontsize =
			null;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'pnw' :

				pnw =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'doc' :

				doc =
					arguments[ a + 1 ];

				break;

			case 'fontsize' :

				fontsize =
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
		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( !path )
		{
			path =
				inherit.path;
		}

		if( fontsize === null )
		{
			fontsize =
				inherit.fontsize;
		}

		if( pnw  === null )
		{
			pnw =
				inherit.pnw;
		}

		if( doc === null )
		{
			doc =
				inherit.$sub.doc;
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
					(
						inherit.$sub.doc.path
					)
					:
					(
						path &&
						new Path(
							path,
							'++',
								'doc'
						)
					),
			'fontsize',
				fontsize,
			'flowWidth',
				0,
			'paraSep',
				0
		);

	// TODO return inherit

	return (
		new Label(
			'XOXO',
			tree,
			path,
			pnw,
			fontsize,
			doc
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
			ne : true,
			se : true,
			sw : true,
			nw : true
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
	var silhoutte =
		this.getSilhoutte( );

	fabric.edge(
		Style.getStyle(
			theme.label.style,
			'highlight'
		),
		silhoutte,
		'sketch',
		view
	);
};


/*
| Returns the labels silhoutte.
*/
Label.prototype.getSilhoutte =
	function( )
{
	var s =
		this._$silhoutte;

	if(
		s
	)
	{
		return s;
	}


	s =
	this._$silhoutte =
		Euclid.Rect.create(
			'pnw/pse',
			this.zone.pnw,
			this.zone.pse.sub( 1, 1 )
		);

	return s;
};


/*
| Returns the items silhoutte anchored at zero.
| XXX
*/
Label.prototype.getZeroSilhoutte =
	function( )
{
	var
		s =
			this._zeroSilhoutte;

	if( s )
	{
		return s;
	}

	var
		zone =
			this.zone;

	s =
	this._zeroSilhoutte =
		Euclid.Rect.create(
			'pse',
			shellverse.grow(
				'Point',
				'x',
					Math.max( zone.width  - 1, 0 ),
				'y',
					Math.max( zone.height - 1, 0 )
			)
		);

	return s;
};


/*
| Sets the items position and size aften an action.
*/
Label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var action =
		shell.bridge.action( );

	switch( action.type )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			var
				zone =
					this.zone,

				fontsize =
					this.$sub.doc.getFont( this ).size;

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

			shell.redraw = true;

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
		caret,
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
				this.$sub.doc,

			imargin =
				this.innerMargin,

			silhoutte =
				this.getZeroSilhoutte( );

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
			silhoutte,
			'sketch',
			Euclid.View.proper
		);
	}

	var action =
		shell.bridge.action( );

	if(
		action &&
		action.type === 'Remove' &&
		action.removeItemFade &&
		this.path.equals( action.removeItemPath )
	)
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				zone.pnw,
			'alpha',
				theme.removeAlpha
		);
	}
	else
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				zone.pnw
		);
	}
};


/*
| Calculates the change of fontsize due to resizing.
*/
Label.prototype.fontSizeChange =
	function( fontsize )
{
	var action =
		shell.bridge.action( );

	if(
		!action ||
		!this.path ||
		!this.path.equals( action.itemPath )
	)
	{
		return fontsize;
	}

	switch( action.type )
	{
		case 'ItemResize' :

			if( !action.startZone )
			{
				return fontsize;
			}

			var
				height =
					action.startZone.height,

				dy;

			switch( action.align )
			{
				case 'ne' :
				case 'nw' :

					dy =
						action.start.y - action.move.y;

					break;

				case 'se' :
				case 'sw' :

					dy =
						action.move.y - action.start.y;

					break;

				default :

					throw new Error(
						'unknown align: '+ action.align
					);
			}

			return Math.max(
				fontsize * ( height + dy ) / height,
				theme.label.minSize
			);

		default:

			return fontsize;
	}

	return Math.max( fontsize, 4 );
};


/*
| Returns the width for the contents flow.
*/
Label.prototype.getFlowWidth =
	function( )
{
	return 0;
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
Label.prototype.scrollCaretIntoView =
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
