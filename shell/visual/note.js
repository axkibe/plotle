/*
| A fix sized text item.
| Possibly has a scrollbar.
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
	Jools,
	Path,
	shell,
	Style,
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var Note =
Visual.Note =
	function(
		overload,
		twig,
		path,
		zone,
		doc
	)
{
	if( CHECK && overload !== 'XOXO' )
	{
		throw new Error(
			'do not call new Note directly'
		);
	}

	Visual.DocItem.call(
		this,
		twig,
		path,
		doc
	);

	this.zone =
		zone;

	var
		sbary =
		this.scrollbarY =
			new Visual.Scrollbar( );
};


Jools.subclass(
	Note,
	Visual.DocItem
);


Note.create =
	function(
		// free strings
	)
{
	var
		twig =
			null,

		path =
			null,

		inherit =
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
			case 'zone' :

				var
					minWidth =
						theme.note.minWidth,

					minHeight =
						theme.note.minHeight;

				zone =
					arguments[ a + 1 ];

				if(
					zone.width  < minWidth ||
					zone.height < minHeight
				)
				{
					zone =
						new Euclid.Rect(
							'pnw/size',
							zone.pnw,
							Math.max( minWidth,  zone.width  ),
							Math.max( minHeight, zone.height )
						);
				}

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'twig' :

				twig =
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

		default :

			throw new Error(
				'invalid argument: ' + arguments[ a ]
			);

		}
	}

	if( twig )
	{
		if( CHECK && !path )
		{
			throw new Error(
				'twig needs path'
			);
		}

		if( !fontsize )
		{
			fontsize =
				theme.note.fontsize;
				// twig.fontsize; FIXME
		}

		if( !zone )
		{
			// TODO multicreate
			zone =
				new Euclid.Rect(
					'pnw/pse',
					new Euclid.Point(
						twig.zone.pnw
					),
					new Euclid.Point(
						twig.zone.pse
					)
				);
		}

		if( !doc )
		{
			doc =
				Visual.Doc.create(
					'inherit',
						inherit && inherit.$sub.doc,
					'twig',
						twig.doc,
					'path',
						new Path(
							path,
							'++',
								'doc'
						),
					'fontsize',
						fontsize,
					'flowWidth',
						zone.width - Note.innerMargin.x,
					'paraSep',
						Jools.half( fontsize )
				);
		}
	}

	if( inherit )
	{
		if( !twig )
		{
			twig =
				inherit.twig;
		}

		if( !fontsize )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !path )
		{
			path =
				inherit.path;
		}

		if( !doc )
		{
			doc =
				Visual.Doc.create(
					'inherit',
						inherit.$sub.doc,
					'flowWidth',
						(
							zone
						)
						&&
						(
							zone.width - Note.innerMargin.x
						)
				);
		}

		if(
			(
				inherit.twig === twig
			)
			&&
			(
				inherit.path === path ||
				( inherit.path && inherit.path.equals( path ) )
			)
			&&
			(
				inherit.zone === zone ||
				( inherit.zone && inherit.zone.equals( zone ) )
			)
			&&
			(
				inherit.doc === doc
			)
		)
		{
			return inherit;
		}
	}

	return (
		new Note(
			'XOXO',
			twig,
			path,
			zone,
			doc
		)
	);
};


/*
| Notes use zone for positioning
*/
Note.prototype.positioning =
	'zone';


/*
| Self referencing creator.
|
| FIXME: check if ".constructor" is supported by
|        every JS implementation concerned about.
*/
Note.prototype.creator =
	Note;


/*
| Sets the items position and size after an action.
*/
Note.prototype.dragStop =
	function(
		view,
		p
	)
{
	var action =
		shell.bridge.action( );

	switch( action.type )
	{

		case 'ItemResize' :

			var zone =
				this.zone;

			if(
				zone.width  < theme.note.minWidth ||
				zone.height < theme.note.minHeight
			)
			{
				throw new Error( 'Note under minimum size!' );
			}

			if( this.twig.zone.equals( zone ) )
			{
				return;
			}

			shell.peer.setZone(
				this.path,
				zone
			);

			shell.redraw = true;

			return true;

		default :

			return Visual.DocItem.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


/*
| Minimum height.
*/
Note.prototype.minHeight =
	theme.note.minHeight;


/*
| Minimum width.
*/
Note.prototype.minWidth =
	theme.note.minWidth;

/*
| Draws the note.
*/
Note.prototype.draw =
	function(
		fabric,
		caret,
		view
	)
{
	var
		zone =
			this.zone,

		vzone =
			view.rect( zone ),

		f =
			this.$fabric,

		sbary =
			this.scrollbarY;

	// no buffer hit?
	if(
		config.debug.noCache ||
		!f ||
		vzone.width !== f.width ||
		vzone.height !== f.height
	)
	{
		f =
		this.$fabric =
			new Euclid.Fabric(
				vzone.width  + 2,
				vzone.height + 2
			);

		var
			doc =
				this.$sub.doc,

			imargin =
				this.innerMargin,

			// calculates if a scrollbar is needed
			height =
				doc.getHeight( this ),

			silhoutte =
				this.getZeroSilhoutte( ),

			style =
				Style.getStyle(
					theme.note.style,
					'normal'
				);

		sbary.visible =
			height > zone.height - imargin.y;

		f.fill(
			style,
			silhoutte,
			'sketch',
			view.home( )
		);

		// draws selection and text
		sbary.point = Euclid.Point.renew(
			0,
			sbary.getPos( ),
			sbary.point
		);

		doc.draw(
			f,
			view.home( ),
			this,
			zone.width,
			sbary.point
		);

		// draws the border
		f.edge(
			style,
			silhoutte,
			'sketch',
			view.home( )
		);
	}

	var action =
		shell.bridge.action( );

	// TODO move this logic into the callee
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
				vzone.pnw,
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
				vzone.pnw
		);
	}

	if( sbary.visible )
	{
		this.setScrollbar( );

		sbary.draw(
			fabric,
			view
		);
	}
};



/*
| Default margin for all notes.
*/
Note.innerMargin =
Note.prototype.innerMargin =
	new Euclid.Margin(
		theme.note.innerMargin
	);


/*
| Resize handles to show on notes.
*/
Note.prototype.handles =
	Jools.immute(
		{
			n :
				true,

			ne :
				true,

			e :
				true,

			se :
				true,

			s :
				true,

			sw :
				true,

			w :
				true,

			nw :
				true
		}
	);


/*
| Returns the notes silhoutte.
| XXX
*/
Note.prototype.getSilhoutte =
	function( )
{
	var
		s =
			this._$silhoutte;

	if( s )
	{
		return s;
	}

	var
		zone =
			this.zone,

		cr =
			theme.note.cornerRadius;

	s =
	this._$silhoutte =
		new Euclid.RoundRect(
			zone.pnw,
			zone.pse,
			cr,
			cr
		);

	return s;
};


/*
| Returns the notes silhoutte anchored at zero.
| XXX
*/
Note.prototype.getZeroSilhoutte =
	function( )
{
	var
		s =
			this._$zeroSilhoutte;

	if( s )
	{
		return s;
	}

	var
		zone =
			this.zone,

		cr =
			theme.note.cornerRadius;

	s =
	this._$zeroSilhoutte =
		new Euclid.RoundRect(
			Euclid.Point.zero,
			new Euclid.Point(
				zone.width,
				zone.height
			),
			cr,
			cr
		);

	return s;
};


/*
| Highlights the note.
*/
Note.prototype.highlight =
	function(
		fabric,
		view
	)
{
	var
		silhoutte =
			this.getSilhoutte( );

	fabric.edge(
		Style.getStyle(
			theme.note.style,
			'highlight'
		),
		silhoutte,
		'sketch',
		view
	);
};


/*
| Actualizes the scrollbar.
*/
Note.prototype.setScrollbar =
	function( pos )
{
	var sbary =
		this.scrollbarY;

	if( !sbary.visible )
	{
		return;
	}

	var zone =
		this.zone;

	if( !Jools.is( pos ) )
	{
		pos =
			sbary.getPos( );
	}

	sbary.setPos(
		pos,
		zone.height - this.innerMargin.y,
		this.$sub.doc.getHeight( this ),
		Euclid.Point.renew(
			zone.pse.x, zone.pnw.y + theme.scrollbar.vdis, sbary.pnw
		),
		zone.height - theme.scrollbar.vdis * 2
	);
};


/*
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollCaretIntoView =
	function( )
{
	// TODO hand down
	var
		caret =
			shell.$space.$caret,

		scrolly =
			this.scrollbarY,

		sy =
			scrolly.getPos( ),

		para =
			shell.$space.getSub(
				caret.sign.path,
				'Para'
			);

	if( para.constructor !== Visual.Para )
	{
		throw new Error( 'para not a para.' );
	}

	var
		cp =
			para.getCaretPos(
				this,
				caret
			),

		pnw =
			this.$sub.doc.getPNW( para.key ),

		zone =
			this.zone,

		imargin =
			this.innerMargin;

	if( cp.n + pnw.y - imargin.n < sy )
	{
		this.setScrollbar(
			cp.n + pnw.y - imargin.n
		);

		this.poke( );
	}
	else if( cp.s + pnw.y + imargin.s > sy + zone.height )
	{
		this.setScrollbar(
			cp.s + pnw.y - zone.height + imargin.s
		);

		this.poke( );
	}
};


/*
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollPage =
	function(
		up
	)
{
	var
		zone =
			this.zone,

		dir =
			up ? -1 : 1,

		fs =
			this.$sub.doc.getFont( ).size;

	this.setScrollbar(
		this.scrollbarY.getPos( ) + dir * zone.height - fs * 2
	);

	this.poke( );
};


/*
| Mouse wheel turned.
*/
Note.prototype.mousewheel =
	function(
		view,
		p,
		dir
		// shift,
		// ctrl
	)
{
	if(
		!this.zone
			.within(
				view,
				p
			)
		)
	{
		return false;
	}

	this.setScrollbar(
		this.scrollbarY.getPos( ) - dir * system.settings.textWheelSpeed
	);

	this.poke( );

	shell.redraw =
		true;

	return true;
};


/*
| Returns the width for the contents flow.
| XXX
*/
Note.prototype.getFlowWidth =
	function( )
{
	return this.zone.width - this.innerMargin.x;
};


/*
| Returns the zone of the item.
|
| An ongoing action can modify this
| to something different than meshmashine data.
|
| TODO remove
*/
Note.prototype.getZone =
	function( )
{
	return this.zone;
};

} )( );
