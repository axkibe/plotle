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
	config,
	Euclid,
	Jools,
	shell,
	shellverse,
	Style,
	system,
	theme,
	TraitSet;


/*
| Capsule
*/
( function( ) {
'use strict';


/**/if( CHECK && typeof( window ) === 'undefined' )
/**/{
/**/	throw new Error(
/**/		'this code needs a browser!'
/**/	);
/**/}


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
		zone,
		doc,
		scrolly,
		mark
	)
{
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
		path,
		doc,
		mark
	);

	this.zone =
		zone;

	this.scrollbarY =
		new Visual.Scrollbar(
			scrolly,
			zone.height - this.innerMargin.y,
			this.sub.doc.height,
			shellverse.grow(
				'Point',
				'x',
					zone.pse.x,
				'y',
					zone.pnw.y + theme.scrollbar.vdis
			),
			zone.height - theme.scrollbar.vdis * 2
		);
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

		zone =
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
							'pnw/size',
							zone.pnw,
							Math.max( minWidth,  zone.width  ),
							Math.max( minHeight, zone.height )
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
			(
				inherit.tree === tree
			)
			&&
			(
				inherit.path && inherit.path.equals( path )
			)
			&&
			(
				inherit.zone && inherit.zone.equals( zone )
			)
			&&
			(
				inherit.sub.doc === doc
			)
			&&
			(
				inherit.scrollbarY.pos === scrolly
			)
		)
		{
			return inherit;
		}
	}

	return (
		new Note(
			_tag,
			tree,
			path,
			zone,
			doc,
			scrolly || 0,
			mark
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
	var
		action =
			shell.action;

	switch( action.reflect )
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

			if( this.tree.twig.zone.equals( zone ) )
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
		config.debug.noCache
		||
		!f
		||
		vzone.width !== f.width
		||
		vzone.height !== f.height
	)
	{
		f =
		this.$fabric =
			new Euclid.Fabric(
				vzone.width,
				vzone.height
			);

		var
			doc =
				this.sub.doc,

			style =
				Style.getStyle(
					theme.note.style,
					'normal'
				);

		f.fill(
			style,
			this.zeroSilhoutte,
			'sketch',
			view.home( )
		);

		// draws selection and text
		sbary.point =
			Euclid.Point.renew(
				0,
				sbary.pos,
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
			this.zeroSilhoutte,
			'sketch',
			view.home( )
		);
	}

	fabric.drawImage(
		'image',
			f,
		'pnw',
			vzone.pnw
	);

	if( sbary.visible ) // FIXME maybe just set sbary null
	{
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
				new Euclid.RoundRect(
					zone.pnw,
					zone.pse,
					cr,
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
			new Euclid.RoundRect(
				Euclid.Point.zero,
				shellverse.grow(
					'Point',
					'x',
						zone.width,
					'y',
						zone.height
				),
				cr,
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
		fabric,
		view
	)
{
	fabric.edge(
		Style.getStyle(
			theme.note.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		view
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
			shell.space.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	var
		sy =
			this.scrollbarY.pos,

		para =
			shell.space.getSub(
				mark.caretPath,
				'Para'
			);

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
			this.sub.doc.font.twig.size,

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
			this.sub.doc.font.twig.size;

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

	shell.redraw =
		true;

	return true;
};


} )( );
