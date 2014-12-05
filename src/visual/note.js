/*
| A fix sized text item.
|
| Has a scrollbar.
*/

var
	euclid_display,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	jools,
	peer,
	root,
	Style,
	system,
	theme,
	visual;


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
		id :
			'visual.note',
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
							'jion.path',
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
								type :
									'visual.item',
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
							undefined,
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the note',
						type :
							'jion.path',
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
							'euclid_view',
						defaultValue :
							undefined
					},
				zone :
					{
						comment :
							'the notes zone',
						type :
							'euclid_rect',
						json :
							true
					}
			},
		init :
			[ ],
		subclass :
			'visual.docItem'
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' );

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
		docPath,
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
			euclid_rect.create(
				'pnw',
					zone.pnw,
				'pse',
					zone.pnw.add(
						Math.max( minWidth, zone.width ),
						Math.max( minHeight, zone.height )
					)
			);
	}

	// FIXME not if inherited
	docPath = this.path.append( 'doc' );

	this.doc =
		this.doc.create(
			'flowWidth', // FUTURE remove?
				zone.width - theme.note.innerMargin.x,
			'fontsize',
				this.fontsize,
			'innerMargin',
				theme.note.innerMargin,
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
		visual.scrollbar.create(
			'aperture',
				zone.height - theme.note.innerMargin.y,
			'max',
				this.doc.height,
			'pnw',
				euclid_point.create(
					'x', zone.pse.x,
					'y', zone.pnw.y + theme.scrollbar.vdis
				),
			'pos',
				this.scrolly,
			'size',
				zone.height - theme.scrollbar.vdis * 2
		);

	// TODO ahead _display if only view changed
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

	action = root.action;

	switch( action.reflect )
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

			peer.setZone( this.path, zone );

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
| The notes display.
*/
jools.lazyValue(
	note.prototype,
	'_display',
	function( )
	{
		var
			doc,
			f,
			hview,
			sbary,
			style,
			vzone;

		vzone = this.view.rect( this.zone );

		hview = this.view.home;

		f =
			euclid_display.create(
				'width', vzone.width + 2,
				'height', vzone.height + 2
			);

		doc = this.doc;

		style = Style.getStyle( theme.note.style, 'normal' );

		sbary = this.scrollbarY;

		f.fill(
			style,
			this.zeroSilhoutte,
			hview
		);

		// draws selection and text
		doc.draw(
			f,
			hview,
			this.zone.width,
			euclid_point.create(
				'x', 0,
				'y', sbary.pos
			)
		);

		// draws the border
		f.edge(
			style,
			this.zeroSilhoutte,
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
		display
	)
{
	var
		zone,
		sbary;

	zone = this.zone;

	sbary = this.scrollbarY;

	display.drawImage(
		'image',
			this._display,
		'pnw',
			this.view.point( zone.pnw )
	);

	// FIXME maybe just set sbary null
	if( sbary.visible )
	{
		sbary.draw( display, this.view );
	}
};


/*
| Resize handles to show on notes.
*/
note.prototype.handles =
	{
		n : true,
		ne : true,
		e : true,
		se : true,
		s : true,
		sw : true,
		w : true,
		nw : true
	};

/**/if( CHECK )
/**/{
/**/	Object.freeze( note.prototype.handles );
/**/}


/*
| The notes silhoutte.
*/
jools.lazyValue(
	note.prototype,
	'silhoutte',
	function( )
	{
		var
			zone,
			cr;

		zone = this.zone;

		cr = theme.note.cornerRadius;

		return (
			euclid_roundRect.create(
				'pnw', zone.pnw,
				'pse', zone.pse,
				'a', cr,
				'b', cr
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
			euclid_roundRect.create(
				'pnw', euclid_point.zero,
				'pse',
					euclid_point.create(
						'x', zone.width,
						'y', zone.height
					),
				'a', cr,
				'b', cr
			)
		);
	}
);


/*
| Highlights the note.
*/
note.prototype.highlight =
	function(
		display
	)
{
	display.edge(
		Style.getStyle( theme.note.style, 'highlight' ),
		this.silhoutte,
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
/**/	if( para.reflect !== 'visual.para' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	zone = this.zone;

	imargin = this.doc.innerMargin;

	fs = this.doc.font.size;

	descend = fs * theme.bottombox;

	p =
		para.locateOffset(
			mark.caretAt
		).p;


	pnw = this.doc.getPNW( para.key );

	s = Math.round( p.y + descend );

	n = s - Math.round( fs + descend );

	if( n + pnw.y - imargin.n < sy )
	{
		root.setPath(
			this.path.append( 'scrolly' ),
			n + pnw.y - imargin.n
		);
	}
	else if( s + pnw.y + imargin.s > sy + zone.height )
	{
		root.setPath(
			this.path.append( 'scrolly' ),
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

	root.setPath(
		this.path.append( 'scrolly' ),
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
