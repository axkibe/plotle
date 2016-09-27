/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_note',
		attributes :
		{
			action :
			{
				comment : 'current action',
				type :
					require( '../typemaps/action' )
					.concat( [ 'undefined' ] ),
				prepare : 'visual_item.concernsAction( action, path )'
			},
			fabric :
			{
				comment : 'the notes fabric',
				type : 'fabric_note'
			},
			highlight :
			{
				comment : 'the item is highlighted',
				type : 'boolean'
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
				// is force defined in _init
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'euclid_transform'
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
			alikeIgnoringTransform :
			{
				ignores : { 'transform' : true }
			}
		}
	};
}


var
	change_grow,
	euclid_point,
	euclid_rect,
	euclid_roundRect,
	euclid_transform,
	euclid_view,
	fabric_doc,
	fabric_note,
	fabric_para,
	gleam_display_canvas,
	gleam_glint_border,
	gleam_glint_fill,
	gleam_glint_paint,
	gleam_glint_twig,
	gleam_glint_disWindow,
	gruga_note,
	jion,
	math_half,
	root,
	session_uid,
	shell_settings,
	system,
	visual_doc,
	visual_docItem,
	visual_item,
	visual_mark_caret,
	visual_note,
	visual_scrollbar;


/*
| Capsule
*/
( function( ) {
'use strict';


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
| Hack to fix visual_note:static references.
*/
visual_note.equals =
	function( o )
{
	return o === this;
};


/*
| Notes do not need to be resized proportionally.
*/
prototype.proportional = false;


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
			'highlight', false,
			'view', euclid_view.proper,
			'transform', euclid_transform.normal
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
			'transform', this.transform
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
				'transform', this.transform
			);
	}

	if( false && inherit ) // FIXME
	{
		if(
			inherit.alikeIgnoringTransform( this )
			&& inherit.transform.zoom === this.transform.zoom
			&& jion.hasLazyValueSet( inherit, '_display' )
		)
		{
			jion.aheadValue( this, '_display', inherit._display );
		}

		if( jion.hasLazyValueSet( inherit, 'glint' ) )
		{
			this._inheritedGlint = inherit.glint;
		}
		else
		{
			this._inheritedGlint = inherit._inheritedGlint;
		}
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
| Reacts on clicks.
*/
prototype.click = visual_docItem.click;


/*
| Reacts on ctrl-clicks.
*/
prototype.ctrlClick = visual_item.ctrlClick;


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
prototype.dragStart = visual_docItem.dragStart;


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
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangeZone;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangeZone;


/*
| The item's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		facet,
		glint,
		sbary;

	sbary = this.scrollbarY;

	glint =
		gleam_glint_twig.create(
			'key', this.key,
			'twine:set+',
				gleam_glint_disWindow.create(
					'display', this._display,
					'key', ':body',
					'p', this.zone.pnw.transform( this.transform )
				)
		);

	if( this.highlight )
	{
		facet = gruga_note.facets.getFacet( 'highlight', true );

		glint =
			glint.create(
				'twine:set+',
					gleam_glint_paint.create(
						'facet', facet,
						'key', ':highlight',
						'shape', this.tSilhoutte
					)
			);
	}

	if( sbary )
	{
		glint = glint.create( 'twine:set+', sbary.glint );
	}

	return glint;
}
);


/*
| The key of this item.
*/
jion.lazyValue(
	prototype,
	'key',
	function( )
{
	return this.path.get( -1 );
}
);


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_docItem.pointingHover;


/*
| Notes use zone for positioning
*/
visual_note.positioning =
prototype.positioning =
	'zone';


/*
| Nofication when the item lost the users mark.
*/
prototype.markLost = function( ){ };


/*
| Returns the mark for a point
*/
prototype.markForPoint = visual_docItem.markForPoint;


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
| A move during a text select on this item.
*/
prototype.moveSelect = visual_docItem.moveSelect;


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

	pnw = para.pnw;

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
| Returns the minimum x-scale factor this item could go through.
*/
prototype.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minWidth / zone.width;
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
prototype.minScaleY =
	function(
		zone  // original zone
	)
{
	return this.minHeight / zone.height;
};


/*
| Silhoutte in current view.
*/
jion.lazyValue(
	prototype,
	'tSilhoutte',
function( )
{
	return this.silhoutte.transform( this.transform );
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
		action,
		moveBy,
		pBase,
		zone;

	action = this.action;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			moveBy = action.moveBy;

			zone = this.fabric.zone;

			return(
				moveBy
				? zone.add( moveBy )
				: zone
			);

		case 'action_resizeItems' :

			pBase = action.pBase;

			zone = action.startZones.get( this.path.get( 2 ) );

			if( !pBase ) return zone;

			zone = zone.intercept( pBase, action.scaleX, action.scaleY );

			if(
				zone.height < this.minHeight
				|| zone.width < this.minWidth
			)
			{
				zone =
					zone.create(
						'pse',
							zone.pnw.add(
								Math.max( zone.width, this.minWidth ),
								Math.max( zone.height, this.minHeight )
							)
					);
			}

			return zone;

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
		doc,
		facet,
		glint,
		vZone;

	vZone = this.vZone;

	doc = this.doc;

	facet = gruga_note.facets.getFacet( );

	glint =
		gleam_glint_twig.create(
			'key', 'root',
			'twine:set+',
				gleam_glint_fill.create(
					'facet', facet,
					'key', 'fill',
					'shape', this.vZeroSilhoutte
				),
			'twine:set+', doc.glint,
			'twine:set+',
				gleam_glint_border.create(
					'facet', facet,
					'key', 'border',
					'shape', this.vZeroSilhoutte
				)
		);

	// draws selection and text

	return(
		gleam_display_canvas.create(
			'glint', glint,
			'view',
				this.view.create(
					'height', Math.round( vZone.height + 2 ),
					'width', Math.round( vZone.width + 2 ),
					'pan', euclid_point.zero
					// FIXME scrollPos!
				)
		)
	);
}
);


} )( );
