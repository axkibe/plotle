/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/

var
	change_set,
	euclid_display,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	fabric_item,
	fabric_note,
	jools,
	shell_style,
	root,
	system,
	theme,
	visual_handlesBezel,
	visual_scrollbar;


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
			'fabric_note',
		attributes :
			{
				doc :
					{
						comment :
							'the notes document',
						type :
							'fabric_doc',
						json :
							true
					},
				fontsize :
					{
						comment :
							'the fontsize of the note',
						type :
							'number',
						json :
							true
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'jion_path',
						assign :
							null,
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'fabric_item',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},
						type :
							'->mark',
						defaultValue :
							'undefined',
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the note',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				scrolly :
					{
						comment :
							'vertical scroll position',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							'undefined'
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
			[ 'inherit' ],
		alike :
			{
				alikeIgnoringView :
					{
						ignores : { 'view' : true }
					}
			},
		subclass :
			'fabric_docItem'
	};
}

/*
| Node includes.
*/
if( SERVER )
{
	fabric_note = require( '../jion/this' )( module );

	fabric_note.prototype._init = function( ) { };

	return;
}


/*
| Resize handles to show on notes.
*/
fabric_note.handles =
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

/**/if( FREEZE )
/**/{
/**/	Object.freeze( fabric_note.handles );
/**/}


/*
| Initializer.
*/
fabric_note.prototype._init =
	function(
		inherit
	)
{
	var
		aperture,
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
			'flowWidth', // FIXME remove?
				zone.width - theme.note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', theme.note.innerMargin,
			'mark', this.mark,
			'paraSep', jools.half( this.fontsize ),
			'path', docPath,
			'view', this.view.home
		);

	if( this.scrolly === undefined )
	{
		this.scrolly = 0;
	}

	aperture = zone.height - theme.note.innerMargin.y;

	if( this.doc.height > aperture )
	{
		this.scrollbarY =
			visual_scrollbar.create(
				'aperture', aperture,
				'max', this.doc.height,
				'pnw',
					euclid_point.create(
						'x', zone.pse.x,
						'y', zone.pnw.y + theme.scrollbar.vdis
					),
				'pos', this.scrolly,
				'size', zone.height - theme.scrollbar.vdis * 2
			);
	}
	else
	{
		this.scrollbarY = null;
	}

	if(
		inherit
		&& inherit.alikeIgnoringView( this )
		&& inherit.view.zoom === this.view.zoom
		&& jools.hasLazyValueSet( inherit, '_display' )
	)
	{
		jools.aheadValue( this, '_display', inherit._display );
	}
};


/*
| A move during an action.
*/
fabric_note.prototype.dragMove = fabric_item.dragMove;


/*
| Handles a potential dragStart event for this item.
*/
fabric_note.prototype.dragStart = fabric_item.dragStart;


/*
| Sets the items position and size after an action.
|
| FIXME this has duplicate code with portal.
*/
fabric_note.prototype.dragStop =
	function(
		p
	)
{
	var
		action,
		zone;

	action = root.action;

	switch( action.reflect )
	{
		case 'action_itemResize' :

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

			root.alter(
				change_set.create(
					'path', this.path.chop.append( 'zone' ),
					'val', zone,
					'prev', this.zone
				)
			);

			return true;

		default :

			return fabric_item.dragStop.call( this, p );
	}
};


/*
| Returns a handles jion.
*/
jools.lazyValue(
	fabric_note.prototype,
	'handlesBezel',
	function( )
	{
		return(
			visual_handlesBezel.create(
				'handles', fabric_note.handles,
				'silhoutte', this.silhoutte,
				'view', this.view,
				'zone', this.zone
			)
		);
	}
);


/*
| Minimum height.
*/
fabric_note.prototype.minHeight = theme.note.minHeight;


/*
| Minimum width.
*/
fabric_note.prototype.minWidth = theme.note.minWidth;


/*
| Draws the note.
*/
fabric_note.prototype.draw =
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
		'image', this._display,
		'pnw', this.view.point( zone.pnw )
	);

	if( sbary )
	{
		sbary.draw( display, this.view );
	}
};


/*
| The notes silhoutte.
*/
jools.lazyValue(
	fabric_note.prototype,
	'silhoutte',
	function( )
	{
		var
			zone,
			cr;

		zone = this.zone;

		cr = theme.note.cornerRadius;

		return(
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
| Highlights the note.
*/
fabric_note.prototype.highlight =
	function(
		display
	)
{
	display.edge(
		shell_style.getStyle( theme.note.style, 'highlight' ),
		this.silhoutte,
		this.view
	);
};


/*
| User is hovering their pointing device over something.
*/
fabric_note.prototype.pointingHover = fabric_item.pointingHover;


/*
| Notes use zone for positioning
*/
fabric_note.prototype.positioning = 'zone';


/*
| Scrolls the note so the caret comes into view.
*/
fabric_note.prototype.scrollMarkIntoView =
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

	sy = this.scrollbarY ? this.scrollbarY.pos : 0;

	// FIXME, more elegant path getting
	para = this.doc.twig[ mark.caretPath.get( 5 )  ];

/**/if( CHECK )
/**/{
/**/	if( para.reflect !== 'fabric_para' )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	zone = this.zone;

	imargin = this.doc.innerMargin;

	fs = this.doc.font.size;

	descend = fs * theme.bottombox;

	p = para.locateOffset( mark.caretAt).p;

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
fabric_note.prototype.mousewheel =
	function(
		view,
		p,
		dir
		// shift,
		// ctrl
	)
{
	if( !this.zone .within( view, p ) )
	{
		return false;
	}

	root.setPath(
		this.path.append( 'scrolly' ),
		( this.scrollbarY ? this.scrollbarY.pos : 0 )
		- dir * system.textWheelSpeed
	);

	return true;
};


/*
| The notes silhoutte anchored at zero.
*/
jools.lazyValue(
	fabric_note.prototype,
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
| The notes display.
*/
jools.lazyValue(
	fabric_note.prototype,
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

		style = shell_style.getStyle( theme.note.style, 'normal' );

		sbary = this.scrollbarY;

		f.fill(
			style,
			this.zeroSilhoutte,
			hview
		);

		// draws selection and text
		doc.draw(
			f,
			this.zone.width,
			euclid_point.create(
				'x', 0,
				'y', sbary ? sbary.pos : 0
			)
		);

		// draws the border
		f.edge( style, this.zeroSilhoutte, hview );

		return f;
	}
);


} )( );
