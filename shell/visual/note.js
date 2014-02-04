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


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {

		name :
			'Note',

		unit :
			'Visual',

		attributes :
			{
				hover :
					{
						comment :
							'node currently hovered upon',

						type :
							'Path',

						assign :
							null,

						allowNull :
							true,

						defaultVal :
							'null'
					},

				path :
					{
						comment :
							'the path of the doc',

						type :
							'Path'
					},

				mark :
					{
						comment :
							'the users mark',

						concerns :
							{
								func :
									'Visual.Item.concernsMark',

								args :
									[
										'mark',
										'path'
									]
							},

						type :
							'Mark'
					},

				scrolly :
					{
						comment :
							'vertical scroll position',

						type :
							'Number',

						defaultVal :
							'0'
					},

				traitSet :
					{
						comment :
							'traits set',

						type :
							'TraitSet',

						allowNull :
							true,

						assign :
							null,

						defaultVal :
							'null'
					},

				tree :
					{
						comment :
							'the data tree',

						type :
							'Tree'
					},

				view :
					{
						comment :
							'the current view',

						type :
							'View'
					}
			},

		init :
			[
				'inherit',
				'traitSet'
			],


		subclass :
			'Visual.DocItem'
	};
}


var
	Note =
		Visual.Note;


/*
| Initializer.
*/
Note.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	var
		twig =
			this.tree.twig;

	// FIXME remove shortcut
	this.fontsize =
		twig.fontsize;

	// FIXME remove shortcut
	var
		zone =
		this.zone =
			twig.zone,

		minWidth =
			theme.note.minWidth,

		minHeight =
			theme.note.minHeight;

	if(
		zone.width  < minWidth ||
		zone.height < minHeight
	)
	{
		zone =
		this.zone =
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

	this.sub =
		{ };

	this.sub.doc =
		Visual.Doc.create(
			'inherit',
				inherit && inherit.sub.doc,
			'path',
				inherit ?
					undefined
					:
					this.path.append( 'doc' ),
			'tree',
				twig.doc,
			'fontsize',
				this.fontsize,
			'flowWidth',
				zone.width - Note.innerMargin.x,
			'paraSep',
				Jools.half( this.fontsize ),
			'mark',
				this.mark,
			'view',
				this.view
		);

	if( traitSet )
	{
		for(
			var a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( this.path )
			)
			{
				switch( t.key )
				{
					case 'scrolly' :

						this.scrolly =
							t.val;

						break;

					default :

						throw new Error(
							CHECK
							&&
							( 'unknown trait: ' + t.key )
						);
				}
			}
		}
	}

	// tree.fontsize; FIXME
	this.fontsize =
		theme.note.fontsize;

	this.scrollbarY =
		Visual.Scrollbar.create(
			'pos',
				this.scrolly,
			'aperture',
				zone.height - this.innerMargin.y,
			'max',
				this.sub.doc.height,
			'pnw',
				Euclid.Point.create(
					'x',
						zone.pse.x,
					'y',
						zone.pnw.y + theme.scrollbar.vdis
				),
			'size',
				zone.height - theme.scrollbar.vdis * 2
		);

	// TODO ahead _fabric if only view changed
};


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
| The notes fabric.
*/
Jools.lazyValue(
	Note.prototype,
	'_fabric',
	function( )
	{
		var
			vzone =
				this.view.rect( this.zone ),

			hview =
				this.view.home,

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
			Euclid.Point.create(
				'x',
					0,
				'y',
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
| The notes silhoutte.
*/
Jools.lazyValue(
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
| The notes silhoutte anchored at zero.
*/
Jools.lazyValue(
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
/*
TODO remove:q

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

	var
		ac =
			this.sub.doc.attentionCenter( this );

	console.log( 'AC', ac );

};
*/


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
				this.scrollbarY.pos -
					dir * system.textWheelSpeed
		)
	);

	return true;
};


} )( );
