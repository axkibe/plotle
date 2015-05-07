/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/

var
	change_set,
	euclid_display,
	euclid_point,
	euclid_roundRect,
	gruga_note,
	jion,
	math_half,
	root,
	system,
	theme,
	visual_doc,
	visual_docItem,
	visual_handlesBezel,
	visual_item,
	visual_note,
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
		id : 'visual_note',
		attributes :
		{
			fabric :
			{
				comment : 'the notes fabric',
				type : 'fabric_note'
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'visual_item.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the note',
				type : [ 'undefined', 'jion$path' ]
			},
			scrolly :
			{
				comment : 'vertical scroll position',
				type : [ 'undefined', 'number' ]
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ]
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
	visual_note = require( 'jion' ).this( module, 'source' );

	visual_note.prototype._init = function( ) { };

	return;
}


prototype = visual_note.prototype;


/*
| Resize handles to show on notes.
*/
visual_note.handles =
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


if( FREEZE )
{
	Object.freeze( visual_note.handles );
}


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	var
		fabric,
		zone;

	fabric = this.fabric;

	zone = this.zone;

	this.doc =
		( inherit && inherit.doc || visual_doc ).create(
			'fabric', fabric.doc,
			'flowWidth', zone.width - theme.note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', theme.note.innerMargin,
			'mark', this.mark,
			'paraSep', math_half( this.fontsize ),
			'path', this.path && this.path.append( 'doc' ),
			'view', this.view.home
		);

	if( this.scrolly === undefined ) this.scrolly = 0;

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
	visual_docItem.attentionCenter
);


/*
| Checks if the item is being clicked and reacts.
*/
prototype.click = visual_docItem.click;


/*
| A shorthand to (re)create this note
| with a different zone.
*/
prototype.createWithZone =
	function(
		zone
	)
{
	return this.create( 'fabric', this.fabric.create( 'zone', zone ) );
};


/*
| A move during an action.
*/
prototype.dragMove = visual_item.dragMove;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = visual_item.dragStart;


/*
| Draws the note.
*/
prototype.draw =
	function(
		display
	)
{
	var
		sbary;

	sbary = this.scrollbarY;

	display.drawImage(
		'image', this._display,
		'pnw', this.vZone.pnw
	);

	if( sbary ) sbary.draw( display, this.view );
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

			return visual_item.dragStop.call( this, p );
	}
};


/*
| Forwards fabric settings.
*/
jion.lazyValue(
	prototype,
	'fontsize',
function( )
{
	return this.fabric.fontsize;
}
);


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
				'handles', visual_note.handles,
				'silhoutte', this.vSilhoutte,
				'zone', this.vZone
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
prototype.input = visual_docItem.input;


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_item.pointingHover;


/*
| Notes use zone for positioning
*/
prototype.positioning = 'zone';


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
	if( !this.vZone.within( p ) ) return false;

	root.setPath(
		this.path.append( 'scrolly' ),
		( this.scrollbarY ? this.scrollbarY.pos : 0 )
		- dir * system.textWheelSpeed
	);

	return true;
};


/*
| The potential scrollbar.
*/
jion.lazyValue(
	prototype,
	'scrollbarY',
	function( )
{
	var
		aperture,
		zone;

	zone = this.zone;

	aperture = this.zone.height - theme.note.innerMargin.y;

	if( this.doc.height <= aperture ) return undefined;

	return(
		visual_scrollbar.create(
			'aperture', aperture,
			'max', this.doc.height,
			'pnw',
				euclid_point.create(
					'x', zone.pse.x,
					'y', zone.pnw.y + theme.scrollbar.vdis
				),
			'pos', this.scrolly,
			'size', zone.height - theme.scrollbar.vdis * 2,
			'view', this.view
		)
	);
}
);


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
/**/	if( para.reflect !== 'visual_para' ) throw new Error( );
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
|
| FUTURE move to vSilhoutte
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
prototype.specialKey = visual_docItem.specialKey;


/*
| Silhoutte in current view.
*/
jion.lazyValue(
	prototype,
	'vSilhoutte',
function( )
{
	return this.view.roundRect( this.silhoutte );
}
);


/*
| Zone in current view.
*/
jion.lazyValue(
	prototype,
	'vZone',
function( )
{
	return this.view.rect( this.fabric.zone );
}
);


/*
| Forwards fabric settings.
|
| FUTURE remove.
*/
jion.lazyValue(
	prototype,
	'zone',
function( )
{
	return this.fabric.zone;
}
);


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
			vZone;

		vZone = this.vZone;

		hview = this.view.home;

		d =
			euclid_display.create(
				'width', vZone.width + 2,
				'height', vZone.height + 2
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
