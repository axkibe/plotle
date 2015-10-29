/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/

var
	change_grow,
	euclid_display,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_view,
	fabric_doc,
	fabric_note,
	fabric_para,
	gruga_note,
	jion,
	math_half,
	root,
	session_uid,
	shell_settings,
	system,
	visual_doc,
	visual_docItem,
	visual_handlesBezel,
	visual_item,
	visual_mark_caret,
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
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				assign : '_action',
				prepare : 'visual_item.concernsAction( action, path )'
			},
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
			scrollPos :
			{
				comment : 'scroll position',
				type : [ 'undefined', 'euclid_point' ]
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
| Node.
*/
if( NODE )
{
	visual_note = require( 'jion' ).this( module, 'source' );

	visual_note.prototype._init = function( ) { };

	return;
}

visual_note.reflect = 'visual_note:static';

prototype = visual_note.prototype;


/*
| Hack to fix visual_note:static references
*/
visual_note.equals =
	function( o )
{
	return o === this;
};


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


if( FREEZE ) Object.freeze( visual_note.handles );


/*
| User wants to create a new note.
*/
visual_note.createGeneric =
	function(
		action, // the create action
		dp      // the deviewed point the createGeneric
		//      // stoped at.
	)
{
	var
		key,
		note,
		zone;

	zone = euclid_rect.createArbitrary( action.startPoint, dp );

	note = action.transItem.fabric.create( 'zone', zone );

	key = session_uid( );

	root.alter(
		change_grow.create(
			'val', note,
			'path',
				jion.path.empty
				.append( 'twig' )
				.append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			visual_mark_caret.create(
				'path',
					root
					.spaceVisual.get( key )
					.doc
					.atRank( 0 ).textPath,
				'at', 0
			)
	);
};


/*
| The note model.
*/
jion.lazyStaticValue(
	visual_note,
	'model',
	function( )
{
	return(
		visual_note.create(
			'fabric',
				fabric_note.create(
					'fontsize', gruga_note.defaultFontsize,
					'zone',
						euclid_rect.create(
							'pnw', euclid_point.zero,
							'pse', euclid_point.zero
						),
					'doc',
						fabric_doc.create(
							'twig:add', '1', fabric_para.create( 'text', '' )
						)
				),
			'view', euclid_view.proper
		)
	);
}
);




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
		doc,
		dHeight,
		fabric,
		path,
		zone;

	fabric = this.fabric;

	path = this.path;

	zone = this.zone;

	if( this.scrollPos === undefined )
	{
		this.scrollPos = euclid_point.zero;
	}
	else if( this.scrollPos.x < 0 || this.scrollPos.y < 0 )
	{
		this.scrollPos =
			this.scrollPos.create(
				'x', Math.max( 0, this.scrollPos.x ),
				'y', Math.max( 0, this.scrollPos.y )
			);
	}

	doc =
	this.doc =
		( inherit && inherit.doc || visual_doc )
		.create(
			'clipsize', zone.zeroPnw,
			'fabric', fabric.doc,
			'flowWidth', zone.width - gruga_note.innerMargin.x,
			'fontsize', this.fontsize,
			'innerMargin', gruga_note.innerMargin,
			'mark', this.mark,
			'paraSep', math_half( this.fontsize ),
			'path', path && path.append( 'doc' ),
			'scrollPos', this.scrollPos,
			'view', this.view.home
		);

	dHeight = doc.fullsize.height;

	aperture = this.zone.height - gruga_note.innerMargin.y;

	if( dHeight > aperture )
	{
		if( this.scrollPos.y > dHeight - aperture )
		{
			this.scrollPos =
				this.scrollPos.create(
					'y', dHeight - aperture
				);

			doc =
			this.doc =
				doc.create( 'scrollPos', this.scrollPos );
		}

		this.scrollbarY =
			visual_scrollbar.create(
				'aperture', aperture,
				'max', dHeight,
				'pnw',
					euclid_point.create(
						'x', zone.pse.x,
						'y', zone.pnw.y + gruga_note.vScrollbarDis
					),
				'pos', this.scrollPos.y,
				'size', zone.height - gruga_note.vScrollbarDis * 2,
				'view', this.view
			);
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
	visual_docItem.attentionCenter
);


/*
| Checks if the item is being clicked and reacts.
*/
prototype.click = visual_docItem.click;


/*
| A create relation action moves.
*/
prototype.createRelationMove = visual_item.createRelationMove;


/*
| A create relation action stops.
*/
prototype.createRelationStop = visual_item.createRelationStop;


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
		action,
		sbary;

	action = this._action;

	sbary = this.scrollbarY;

	display.drawImage(
		'image', this._display,
		'pnw', this.vZone.pnw
	);

	if( sbary ) sbary.draw( display, this.view );

	if( action && action.reflect === 'action_createRelation' )
	{
		display.border(
			gruga_note.facets.getFacet( 'highlight', true ).border,
			this.vSilhoutte
		);
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
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


/*
| An itemDrag action stopped.
*/
prototype.itemDrag = visual_item.itemDragForZonePositioning;


/*
| An itemResize action stopped.
*/
prototype.stopItemResize = visual_item.stopItemResizeZone;


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_item.pointingHover;


/*
| Notes use zone for positioning
*/
visual_note.positioning =
prototype.positioning =
	'zone';


/*
| Minimum height.
*/
prototype.minHeight = gruga_note.minHeight;


/*
| Minimum width.
*/
prototype.minWidth = gruga_note.minWidth;


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
		this.path.append( 'scrollPos' ),
		this.scrollPos.create(
			'y',
				( this.scrollbarY ? this.scrollbarY.pos : 0 )
				- dir * system.textWheelSpeed
		)
	);

	return true;
};


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

	if( !mark || !mark.hasCaret ) return;

	sy = this.scrollbarY ? this.scrollbarY.pos : 0;

	// FUTURE, more elegant path getting
	para = this.doc.get( mark.caret.path.get( 5 ) );

/**/if( CHECK )
/**/{
/**/	if( para.reflect !== 'visual_para' ) throw new Error( );
/**/}

	zone = this.zone;

	imargin = this.doc.innerMargin;

	fs = this.doc.font.size;

	descend = fs * shell_settings.bottombox;

	p = para.locateOffsetPoint( mark.caret.at );

	pnw = this.doc.getPNW( para.key );

	s = Math.round( p.y + descend );

	n = s - Math.round( fs + descend );

	if( n + pnw.y - imargin.n < sy )
	{
		root.setPath(
			this.path.append( 'scrollPos' ),
			this.scrollPos.create(
				'y', n + pnw.y - imargin.n
			)
		);
	}
	else if( s + pnw.y + imargin.s > sy + zone.height )
	{
		root.setPath(
			this.path.append( 'scrollPos' ),
			this.scrollPos.create(
				'y', s + pnw.y - zone.height + imargin.s
			)
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

	cr = gruga_note.cornerRadius;

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
	return this.silhoutte.inView( this.view );
}
);


/*
| The notes silhoutte anchored at zero.
*/
jion.lazyValue(
	prototype,
	'vZeroSilhoutte',
	function( )
{
	return this.zeroSilhoutte.inView( this.view.home );
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
	return this.zone.inView( this.view );
}
);


/*
| The items zone possibly altered by action.
*/
jion.lazyValue(
	prototype,
	'zone',
function( )
{
	var
		action;

	action = this._action;

	switch( action && action.reflect )
	{
		case 'action_itemDrag' :

			return(
				action.toPnw
				? euclid_rect.create(
					'pnw', action.toPnw,
					'pse',
						action.toPnw.add(
							this.fabric.zone.width,
							this.fabric.zone.height
						)
				)
				: this.fabric.zone
			);

		case 'action_itemResize' :

			return(
				action.toPnw
				?  euclid_rect.create(
					'pnw', action.toPnw,
					'pse', action.toPse
				)
				: this.fabric.zone
			);

		default :

			return this.fabric.zone;
	}
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

		cr = gruga_note.cornerRadius;

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
			sbary,
			vZone;

		vZone = this.vZone;

		d =
			euclid_display.create(
				'width', vZone.width + 2,
				'height', vZone.height + 2
			);

		doc = this.doc;

		facet = gruga_note.facets.getFacet( );

		sbary = this.scrollbarY;

		d.fill( facet.fill, this.vZeroSilhoutte );

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
		d.border( facet.border, this.vZeroSilhoutte );

		return d;
	}
);


} )( );
