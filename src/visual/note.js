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
	visual;


/*
| Imports
*/
var
	euclid,
	jools,
	Peer,
	shell,
	Style,
	system,
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
			'note',
		unit :
			'visual',
		attributes :
			{
				doc :
					{
						comment :
							'the notes document',
						type :
							'visual.doc',
						json :
							true
					},
				fontsize :
					{
						comment :
							'the fontsize of the note',
						type :
							'Number',
						json :
							true
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'path',
						assign :
							null,
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								unit :
									'visual',
								type :
									'item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the note',
						type :
							'path',
						defaultValue :
							undefined
					},
				scrolly :
					{
						comment :
							'vertical scroll position',
						type :
							'Number',
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
					},
				zone :
					{
						comment :
							'the notes zone',
						type :
							'euclid.rect',
						json :
							true
					}
			},
		init :
			[ ],
		node :
			true,
		subclass :
			'visual.docItem'
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools' );

	visual =
		{
			note :
				require( '../jion/this' )( module )
		};
}

var
	note;

note = visual.note;


/*
| Initializer.
*/
note.prototype._init =
	function( )
{
	var
		minHeight,
		minWidth,
		zone;

	if( !this.view )
	{
		// abstract
		return;
	}

	zone = this.zone;

	minWidth = theme.note.minWidth;

	minHeight = theme.note.minHeight;

	if(
		zone.width  < minWidth ||
		zone.height < minHeight
	)
	{
		zone =
		this.zone =
			euclid.rect.create(
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

	var
		docPath =
			// FIXME not if inherited
			this.path.Append( 'doc' );

	this.doc =
		this.doc.create(
			'flowWidth',
				zone.width - note.innerMargin.x,
			'fontsize',
				this.fontsize,
			'mark',
				this.mark,
			'paraSep',
				jools.half( this.fontsize ),
			'path',
				docPath,
			'view',
				this.view
		);

	if( this.scrolly === undefined )
	{
		this.scrolly = 0;
	}

	this.scrollbarY =
		visual.Scrollbar.create(
			'aperture',
				zone.height - this.innerMargin.y,
			'max',
				this.doc.height,
			'pnw',
				euclid.point.create(
					'x',
						zone.pse.x,
					'y',
						zone.pnw.y + theme.scrollbar.vdis
				),
			'pos',
				this.scrolly,
			'size',
				zone.height - theme.scrollbar.vdis * 2
		);

	// TODO ahead _fabric if only view changed
};


/*
| Notes use zone for positioning
*/
note.prototype.positioning =
	'zone';


/*
| Sets the items position and size after an action.
*/
note.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action,
		zone;

	action =
		shell.action;

	switch( action.reflex )
	{
		case 'actions.itemResize' :

			zone = this.zone;

/**/		if( CHECK )
/**/		{
/**/			if(
/**/				zone.width  < theme.note.minWidth ||
/**/				zone.height < theme.note.minHeight
/**/			)
/**/			{
/**/				throw new Error( );
/**/			}
/**/		}

			if( this.zone.equals( zone ) )
			{
				return;
			}

			Peer.setZone(
				this.path,
				zone
			);

			return true;

		default :

			return (
				visual.docItem.prototype.dragStop.call(
					this,
					view,
					p
				)
			);
	}
};


if( SHELL )
{
	/*
	| Minimum height.
	*/
	note.prototype.minHeight = theme.note.minHeight;


	/*
	| Minimum width.
	*/
	note.prototype.minWidth = theme.note.minWidth;
}


/*
| The notes fabric.
*/
jools.lazyValue(
	note.prototype,
	'_fabric',
	function( )
	{
		var
			vzone =
				this.view.rect( this.zone ),

			hview =
				this.view.home,

			f =
				euclid.fabric.create(
					'width',
						vzone.width + 2,
					'height',
						vzone.height + 2
				),

			doc =
				this.doc,

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
			euclid.point.create(
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
note.prototype.draw =
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


if( SHELL )
{
	/*
	| Default margin for all notes.
	*/
	note.innerMargin =
	note.prototype.innerMargin =
		// FIXME create!
		new euclid.margin(
			theme.note.innerMargin
		);
}


/*
| Resize handles to show on notes.
*/
note.prototype.handles =
	jools.immute(
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
jools.lazyValue(
	note.prototype,
	'silhoutte',
	function( )
	{
		var
			zone =
				this.zone,

			cr =
				theme.note.cornerRadius;

			return (
				euclid.roundRect.create(
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
jools.lazyValue(
	note.prototype,
	'zeroSilhoutte',
	function( )
	{
		var
			zone,
			cr;

		zone = this.zone;

		cr = theme.note.cornerRadius;

		return (
			euclid.roundRect.create(
				'pnw',
					euclid.point.zero,
				'pse',
					euclid.point.create(
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
note.prototype.highlight =
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
note.prototype.scrollMarkIntoView =
	function( )
{
	var
		descend,
		imargin,
		fs,
		mark,
		n,
		p,
		para,
		pnw,
		s,
		sy,
		zone;

	mark = this.mark;

	if( !mark.hasCaret )
	{
		return;
	}

	sy = this.scrollbarY.pos;

	// FIXME, more elegant path getting
	para = this.doc.twig[ mark.caretPath.get( 5 )  ];

/**/if( CHECK )
/**/{
/**/	if( para.reflex !== 'visual.para' )
/**/	{
/**/		throw new Error(
/**/			'para not a para.'
/**/		);
/**/	}
/**/}

	zone = this.zone;

	imargin = this.innerMargin;

	fs = this.doc.font.size;

	descend = fs * theme.bottombox;

	p =
		para.locateOffset(
			mark.caretAt
		).p;


	pnw =
		this.doc.getPNW(
			this,
			para.key
		);

	s = Math.round( p.y + descend );

	n = s - Math.round( fs + descend );

	if( n + pnw.y - imargin.n < sy )
	{
		shell.setPath(
			this.path.Append( 'scrolly' ),
			n + pnw.y - imargin.n
		);
	}
	else if( s + pnw.y + imargin.s > sy + zone.height )
	{
		shell.setPath(
			this.path.Append( 'scrolly' ),
			s + pnw.y - zone.height + imargin.s
		);
	}
};


/*
| Mouse wheel turned.
*/
note.prototype.mousewheel =
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

	shell.setPath(
		this.path.Append( 'scrolly' ),
		this.scrollbarY.pos - dir * system.textWheelSpeed
	);

	return true;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = note;
}


} )( );
