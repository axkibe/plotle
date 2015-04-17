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
	fabric_docItem,
	fabric_item,
	fabric_note,
	gruga_note,
	jion,
	math_half,
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
	return{
		id : 'fabric_note',
		attributes :
		{
			doc :
			{
				comment : 'the notes document',
				type : 'fabric_doc',
				json : true
			},
			fontsize :
			{
				comment : 'the fontsize of the note',
				type : 'number',
				json : true
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : 'jion$path',
				defaultValue : 'undefined',
				assign : ''
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'fabric_item.concernsMark( mark, path )',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined'
			},
			path :
			{
				comment : 'the path of the note',
				type : 'jion$path',
				defaultValue : 'undefined'
			},
			scrolly :
			{
				comment : 'vertical scroll position',
				type : 'number',
				defaultValue : 'undefined'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				defaultValue : 'undefined'
			},
			zone :
			{
				comment : 'the notes zone',
				type : 'euclid_rect',
				json : true
			}
		},
		init : [ 'inherit' ],
		alike :
			{
				alikeIgnoringView :
					{
						ignores : { 'view' : true }
					}
			}
	};
}


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	fabric_note = require( 'jion' ).this( module, 'source' );

	fabric_note.prototype._init = function( ) { };

	return;
}


prototype = fabric_note.prototype;


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
prototype._init =
	function(
		inherit
	)
{
	var
		aperture,
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

	this.doc =
		this.doc.create(
			'flowWidth', zone.width - theme.note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', theme.note.innerMargin,
			'mark', this.mark,
			'paraSep', math_half( this.fontsize ),
			'path', this.path && this.path.append( 'doc' ),
			'view', this.view.home
		);

	if( this.scrolly === undefined )
	{
		this.scrolly = 0;
	}

	aperture = zone.height - theme.note.innerMargin.y;

	// FIXME lazyvalue sbary
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
		this.scrollbarY = undefined;
	}

	if(
		inherit
		&& inherit.alikeIgnoringView( this )
		&& inherit.view.zoom === this.view.zoom
		&& jion.hasLazyValueSet( inherit, '_display' )
	)
	{
		jion.aheadValue( this, '_display', inherit._display );
	}
};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	fabric_docItem.attentionCenter
);


/*
| Checks if the item is being clicked and reacts.
*/
prototype.click = fabric_docItem.click;


/*
| A move during an action.
*/
prototype.dragMove = fabric_item.dragMove;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = fabric_item.dragStart;


/*
| Draws the note.
*/
prototype.draw =
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
| Sets the items position and size after an action.
|
| FIXME this has duplicate code with portal.
*/
prototype.dragStop =
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
jion.lazyValue(
	prototype,
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
| Highlights the note.
|
| FIXME this should be jion variable
*/
prototype.highlight =
	function(
		display
	)
{
	display.border(
		gruga_note.getFacet( 'highlight', true ).border,
		this.silhoutte,
		this.view
	);
};


/*
| A text has been inputed.
*/
prototype.input = fabric_docItem.input;


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = fabric_item.pointingHover;


/*
| Minimum height.
*/
prototype.minHeight = theme.note.minHeight;


/*
| Minimum width.
*/
prototype.minWidth = theme.note.minWidth;


/*
| Mouse wheel turned.
*/
prototype.mousewheel =
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
| Notes use zone for positioning
*/
prototype.positioning = 'zone';


/*
| Scrolls the note so the caret comes into view.
*/
prototype.scrollMarkIntoView =
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

	if( !mark || !mark.hasCaret )
	{
		return;
	}

	sy = this.scrollbarY ? this.scrollbarY.pos : 0;

	// FUTURE, more elegant path getting
	para = this.doc.get( mark.caretPath.get( 5 ) );

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
| The notes silhoutte.
*/
jion.lazyValue(
	prototype,
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
| Handles a special key.
*/
prototype.specialKey = fabric_docItem.specialKey;


/*
| The notes silhoutte anchored at zero.
*/
jion.lazyValue(
	prototype,
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
jion.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			d,
			doc,
			facet,
			hview,
			sbary,
			vzone;

		vzone = this.view.rect( this.zone );

		hview = this.view.home;

		d =
			euclid_display.create(
				'width', vzone.width + 2,
				'height', vzone.height + 2
			);

		doc = this.doc;

		facet = gruga_note.getFacet( );

		sbary = this.scrollbarY;

		d.fill( facet.fill, this.zeroSilhoutte, hview );

		// draws selection and text
		doc.draw(
			d,
			this.zone.width,
			euclid_point.create(
				'x', 0,
				'y', sbary ? sbary.pos : 0
			)
		);

		// draws the border
		d.border( facet.border, this.zeroSilhoutte, hview );

		return d;
	}
);


} )( );
