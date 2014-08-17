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
			'Note',
		unit :
			'Visual',
		attributes :
			{
				doc :
					{
						comment :
							'the notes document',
						// FUTURE make this type: 'Visual.Doc'
						type :
							'Doc',
						unit :
							'Visual',
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
									'Visual',
								type :
									'Item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						type :
							'Mark',
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
							'View',
						defaultValue :
							undefined
					},
				zone :
					{
						comment :
							'the notes zone',
						type :
							'rect',
						unit :
							'euclid',
						json :
							true
					}
			},
		init :
			[ ],
		node :
			true,
		subclass :
			'Visual.DocItem'
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools' );

	Visual =
		{
			Note :
				require( '../jion/this' )( module )
		};
}

var
	Note;

Note = Visual.Note;


/*
| Initializer.
*/
Note.prototype._init =
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
				zone.width - Note.innerMargin.x,
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
		Visual.Scrollbar.create(
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
		action,
		zone;

	action =
		shell.action;

	switch( action.reflex )
	{
		case 'action.itemResize' :

			zone = this.zone;

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

			return Visual.DocItem.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


if( SHELL )
{
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
}


/*
| The notes fabric.
*/
jools.lazyValue(
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


if( SHELL )
{
	/*
	| Default margin for all notes.
	*/
	Note.innerMargin =
	Note.prototype.innerMargin =
		new euclid.margin(
			theme.note.innerMargin
		);
}


/*
| Resize handles to show on notes.
*/
Note.prototype.handles =
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
	Note.prototype,
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
	module.exports =
		Note;
}


} )( );
