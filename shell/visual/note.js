/*
| A fix sized text item.
|
| Has a scrollbar.
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
	Style,
	system,
	theme,
	TraitSet;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	_tag =
		'NOTE-69907604';


/*
| Constructor.
*/
var Note =
Visual.Note =
	function(
		tag,
		tree,
		path,
		view,
		zone,
		doc,
		scrolly,
		mark,
		ifabric,
		iview
	)
{
	Jools.logNew(
		this,
		path
	);

/**/if( CHECK )
/**/{
/**/	if( tag !== _tag )
/**/	{
/**/		throw new Error(
/**/			'tag mismatch'
/**/		);
/**/	}
/**/}

	Visual.DocItem.call(
		this,
		tree,
		doc,
		mark
	);

	this.path =
		path;

	this.zone =
		zone;

	this.scrollbarY =
		new Visual.Scrollbar(
			scrolly,
			zone.height - this.innerMargin.y,
			this.sub.doc.height,
			Euclid.Point.create(
				'x',
					zone.pse.x,
				'y',
					zone.pnw.y + theme.scrollbar.vdis
			),
			zone.height - theme.scrollbar.vdis * 2
		);

	this.view =
		view;

	this._ifabric =
		ifabric;

	this._iview =
		iview;
};


Jools.subclass(
	Note,
	Visual.DocItem
);


/*
| Creates a note.
*/
Note.create =
	function(
		// free strings
	)
{
	var
		a,
		aZ,

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

		scrolly =
			null,

		traitSet =
			null,

		tree =
			null,

		view =
			null,

		zone =
			null,

		ifabric =
			null,

		iview =
			null;

	for(
		a = 0, aZ = arguments.length;
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

			case 'hover' :

				// ignored

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'scrolly' :

				scrolly =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				traitSet =
					arguments[ a + 1 ];

				break;

			case 'view' :

				view =
					arguments[ a + 1 ];

				break;

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
						Euclid.Rect.create(
							'pnw',
								zone.pnw,
							'pse',
								zone.pnw.add(
									Math.max(
										minWidth,
										zone.width
									),
									Math.max(
										minHeight,
										zone.height
									)
								)
						);
				}

				break;

			case 'mark' :

				mark =
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
		if( !path )
		{
			path =
				inherit.path;
		}
	}


	if( mark && mark.reflect !== 'Vacant' )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'mark needs path'
/**/			);
/**/		}
/**/	}

		mark =
			Visual.Item.concernsMark(
				mark,
				path
			);
	}


	if( traitSet )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'traitSet needs path'
/**/			);
/**/		}
/**/	}

		for(
			a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( path )
			)
			{
				switch( t.key )
				{
					case 'scrolly' :

						scrolly =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	if( tree )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'tree needs path'
/**/			);
/**/		}
/**/	}

		if( !fontsize )
		{
			fontsize =
				theme.note.fontsize;
				// tree.fontsize; FIXME
		}

		if( !zone )
		{
			zone =
				tree.twig.zone;
		}

		if( !doc )
		{
			doc =
				Visual.Doc.create(
					'inherit',
						inherit && inherit.sub.doc,
					'tree',
						tree.twig.doc,
					'path',
						path.append( 'doc' ),
					'fontsize',
						fontsize,
					'flowWidth',
						zone.width - Note.innerMargin.x,
					'paraSep',
						Jools.half( fontsize ),
					'mark',
						mark
				);
		}
	}


	if( inherit )
	{
		if( !doc )
		{
			doc =
				Visual.Doc.create(
					'inherit',
						inherit.sub.doc,
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

		if( !fontsize )
		{
			fontsize =
				inherit.fontsize;
		}

		if( !view )
		{
			view =
				inherit.view;
		}

		if( !mark )
		{
			mark =
				inherit.mark;
		}

		if( !path )
		{
			path =
				inherit.path;
		}

		if( scrolly === null )
		{
			scrolly =
				inherit.scrollbarY.pos;
		}

		if( !tree )
		{
			tree =
				inherit.tree;
		}

		if(
			inherit.tree === tree
			&&
			inherit.path.equals( path )
			&&
			inherit.zone.equals( zone )
			&&
			inherit.sub.doc === doc
			&&
			inherit.scrollbarY.pos === scrolly
			&&
			inherit.mark.equals( mark )
		)
		{
			if( inherit.view.equals( view ) )
			{
				return inherit;
			}
			else
			{
				ifabric =
					inherit._fabric;

				iview =
					inherit.view;
			}
		}
	}

	return (
		new Note(
			_tag,
			tree,
			path,
			view,
			zone,
			doc,
			scrolly || 0,
			mark,
			ifabric,
			iview
		)
	);
};


/*
| Reflection.
*/
Note.prototype.reflect =
	'Note';


/*
| Notes use zone for positioning
*/
Note.prototype.positioning =
	'zone';


/*
| Sets the items position and size after an action.
*/
Note.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action =
			shell.action;

	switch( action.reflect )
	{

		case 'ItemResize' :

			var
				zone =
					this.zone;

/**/		if( CHECK )
/**/		{
/**/			if(
/**/				zone.width  < theme.note.minWidth ||
/**/				zone.height < theme.note.minHeight
/**/			)
/**/			{
/**/				throw new Error(
/**/					'Note under minimum size!'
/**/				);
/**/			}
/**/		}

			if( this.tree.twig.zone.equals( zone ) )
			{
				return;
			}

			shell.peer.setZone(
				this.path,
				zone
			);

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
| Creates the items fabric.
*/
Jools.lazyFixate(
	Note.prototype,
	'_fabric',
	function( )
	{
		var
			vzone =
				this.view.rect( this.zone ),

			hview =
				this.view.home( );

		if(
			this._ifabric
			&&
			this._iview.zoom === this.view.zoom
		)
		{
			return this._ifabric;
		}

		var
			f =
				Euclid.Fabric.create(
					'width',
						vzone.width + 2,
					'height',
						vzone.height + 2
				),

			doc =
				this.sub.doc,

			style =
				Style.getStyle(
					theme.note.style,
					'normal'
				),

			sbary =
				this.scrollbarY;

		f.fill(
			style,
			this.zeroSilhoutte,
			'sketch',
			hview
		);

		// draws selection and text
		doc.draw(
			f,
			hview,
			this,
			this.zone.width,
			Euclid.Point.renew( // TODO
				0,
				sbary.pos
			)
		);

		// draws the border
		f.edge(
			style,
			this.zeroSilhoutte,
			'sketch',
			hview
		);

		return f;
	}
);

/*
| Draws the note.
*/
Note.prototype.draw =
	function(
		fabric
	)
{
	var
		zone =
			this.zone,

		sbary =
			this.scrollbarY;


	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			this.view.point( zone.pnw )
	);

	// FIXME maybe just set sbary null
	if( sbary.visible )
	{
		sbary.draw(
			fabric,
			this.view
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
*/
Jools.lazyFixate(
	Note.prototype,
	'silhoutte',
	function( )
	{
		var
			zone =
				this.zone,

			cr =
				theme.note.cornerRadius;

			return (
				Euclid.RoundRect.create(
					'pnw',
						zone.pnw,
					'pse',
						zone.pse,
					'a',
						cr,
					'b',
						cr
				)
			);
	}
);


/*
| Returns the notes silhoutte anchored at zero.
*/
Jools.lazyFixate(
	Note.prototype,
	'zeroSilhoutte',
	function( )
	{
		var
			zone =
				this.zone,

			cr =
				theme.note.cornerRadius;

		return (
			Euclid.RoundRect.create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.create(
						'x',
							zone.width,
						'y',
							zone.height
					),
				'a',
					cr,
				'b',
					cr
			)
		);
	}
);


/*
| Highlights the note.
*/
Note.prototype.highlight =
	function(
		fabric
	)
{
	fabric.edge(
		Style.getStyle(
			theme.note.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		this.view
	);
};


/*
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollMarkIntoView =
	function( )
{
	var
		mark =
			this.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	var
		sy =
			this.scrollbarY.pos,

		para =
			// FIXME, more elegant path getting
			this.sub.doc.sub[ mark.caretPath.get( 3 )  ];

/**/if( CHECK )
/**/{
/**/	if( para.reflect !== 'Para' )
/**/	{
/**/		throw new Error(
/**/			'para not a para.'
/**/		);
/**/	}
/**/}

	var
		zone =
			this.zone,

		imargin =
			this.innerMargin,

		fs =
			this.sub.doc.font.size,

		descend =
			fs * theme.bottombox,

		p =
			para.locateOffset(
				mark.caretAt
			).p,

		pnw =
			this.sub.doc.getPNW(
				this,
				para.key
			),

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend );


	if( n + pnw.y - imargin.n < sy )
	{
		shell.setTraits(
			TraitSet.create(
				'trait',
					this.path,
					'scrolly',
					n + pnw.y - imargin.n
			)
		);
	}
	else if( s + pnw.y + imargin.s > sy + zone.height )
	{
		shell.setTraits(
			TraitSet.create(
				'trait',
					this.path,
					'scrolly',
					s + pnw.y - zone.height + imargin.s
			)
		);
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
			this.sub.doc.font.size;

	shell.setTraits(
		TraitSet.create(
			'trait',
				this.path,
				'scrolly',
				this.scrollbarY.pos + dir * zone.height - fs * 2
		)
	);
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

	shell.setTraits(
		TraitSet.create(
			'trait',
				this.path,
				'scrolly',
				this.scrollbarY.pos - dir * system.settings.textWheelSpeed
		)
	);

	return true;
};


} )( );
