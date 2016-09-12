/*
| An item with resizing text.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_label',
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
				comment : 'the labels fabric',
				type : 'fabric_label'
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
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
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
	change_grow,
	change_shrink,
	euclid_anchor_rect,
	gleam_display_canvas,
	gleam_glint_paint,
	gleam_glint_twig,
	gleam_glint_disWindow,
	euclid_point,
	euclid_rect,
	euclid_view,
	fabric_doc,
	fabric_label,
	fabric_para,
	gruga_label,
	jion,
	session_uid,
	visual_doc,
	visual_docItem,
	visual_item,
	visual_label,
	visual_mark_caret;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;

/*
| Node includes.
*/
if( NODE )
{
	jion = require( 'jion' );

	visual_label = jion.this( module, 'source' );

	visual_label.prototype._init = function( ) { };

	return;
}

visual_label.reflect = 'visual_note:static';

prototype = visual_label.prototype;


/*
| Hack to fix visual_note:static references
*/
visual_label.equals =
	function( o )
{
	return o === this;
};


/*
| Labels resize proportional only.
*/
prototype.proportional = true;


/*
| User wants to create a new label.
*/
visual_label.createGeneric =
	function(
		action, // the create action
		dp      // the deviewed point the createGeneric
		//      // stoped at.
	)
{
	var
		fs,
		key,
		label,
		model,
		pnw,
		resized,
		zone;

	model = visual_label.model;

	zone = euclid_rect.createArbitrary( action.startPoint, dp );

	fs =
		Math.max(
			model.doc.fontsize
			* zone.height
			/ model.zone.height,
			gruga_label.minSize
		);

	resized =
		model.create(
			'fabric', model.fabric.create( 'fontsize', fs )
		);

	pnw =
		( dp.x > action.startPoint.x )
		? zone.pnw
		: euclid_point.create(
			'x', zone.pse.x - resized.zone.width,
			'y', zone.pnw.y
		);

	label =
		resized.create(
			'fabric', resized.fabric.create( 'pnw', pnw )
		);

	key = session_uid( );

/**/if( CHECK )
/**/{
/**/	if( label.fabric.fontsize !== label.doc.fontsize )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( label.fabric.pnw !== label.pnw )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	root.alter(
		change_grow.create(
			'val', label.fabric,
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
					root.spaceVisual
					.get( key )
					.doc.atRank( 0 )
					.textPath,
				'at', 0
			)
	);
};


/*
| The label model.
*/
jion.lazyStaticValue(
	visual_label,
	'model',
	function( )
{
	return(
		visual_label.create(
			'fabric',
				fabric_label.create(
					'pnw', euclid_point.zero,
					'fontsize', gruga_label.defaultFontsize,
					'doc',
						fabric_doc.create(
							'twig:add', '1',
							fabric_para.create( 'text', 'Label' )
						)
				),
			'highlight', false,
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
		fabric;

	fabric = this.fabric;

	this.doc =
		( inherit && inherit.doc || visual_doc ).create(
			'fabric', fabric.doc,
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', gruga_label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', this.path && this.path.append( 'doc' ),
			'scrollPos', euclid_point.zero,
			'view', this.view.home
		);

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
| The notes anchored silhoutte.
|
| FIXME remove
*/
jion.lazyValue(
	prototype,
	'aSilhoutte',
	function( )
{
	return(
		euclid_anchor_rect.create(
			'pnw', this.zone.pnw.apnw,
			'pse', this.zone.pse.apnw
		)
	);
}
);


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
| The fontsize of the label.
*/
visual_label.fontsize =
	function( )
{
	var
		action,
		fs;

	action = this.action;

	fs = this.fabric.fontsize;

	if( action && action.reflect === 'action_resizeItems' )
	{
/**/	if( CHECK )
/**/	{
/**/		if( action.scaleX !== action.scaleY ) throw new Error( );
/**/	}

		fs *= action.scaleY;

		fs = Math.max( fs, gruga_label.minSize );
	}

	return fs;
};


jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangePnwFs;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangePnwFs;


/*
| The items glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	// FUTURE GLINT inherit
	var
		facet,
		glint;

	glint =
		gleam_glint_twig.create(
			'key', this.key,
			'twine:set+',
				gleam_glint_disWindow.create(
					'display', this._display,
					'key', ':content',
					'p', this.pnw.apnw
				)
		);

	if( this.highlight )
	{
		facet = gruga_label.facets.getFacet( 'highlight', true );

		glint =
			glint.create(
				'twine:set+',
					gleam_glint_paint.create(
						'facet', facet,
						'key', ':highlight',
						'shape', this.vSilhoutte
					)
			);
	}

	return glint;
}
);


/*
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


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
| Returns the mark for a point
*/
prototype.markForPoint = visual_docItem.markForPoint;


/*
| Nofication when the item lost the users mark.
*/
prototype.markLost =
	function( )
{
	var
		pc;

	if( this.doc.fabric.isBlank )
	{
		pc = this.path.chop;

		root.alter(
			change_shrink.create(
				'path', pc,
				'prev', root.spaceFabric.getPath( pc ),
				'rank', root.spaceFabric.rankOf( pc.get( 1 ) )
			)
		);
	}
};


/*
| Returns the minimum x-scale factor this item could go through.
*/
visual_label.minScaleX =
prototype.minScaleX =
	function(
		zone  // original zone
	)
{
	return this.minScaleY( zone );
};


/*
| Returns the minimum y-scale factor this item could go through.
*/
visual_label.minScaleY =
prototype.minScaleY =
	function(
//		zone  // original zone
	)
{
	return ( gruga_label.minSize / this.fabric.fontsize );
};


/*
| Mouse wheel turned.
*/
prototype.mousewheel =
	function(
		// view,
		// p,
		// dir
	)
{
	return false;
};


/*
| A move during a text select on this item.
*/
prototype.moveSelect = visual_docItem.moveSelect;


/*
| Forwards fabric settings.
*/
visual_label.pnw =
	function( )
{
	var
		action,
		zone,
		pne,
		pnw,
		pse,
		psw;

	action = this.action;

	switch( action && action.reflect )
	{
		case 'action_dragItems' :

			return this.fabric.pnw.add( action.moveBy );

		case 'action_resizeItems' :

			zone = action.startZones.get( this.path.get( 2 ) );

			switch( action.resizeDir )
			{
				case 'ne' :

					psw =
						zone.psw.intercept(
							action.pBase,
							action.scaleX,
							action.scaleY
						);

					pnw = psw.sub( 0 , this._zoneHeight );

					break;

				case 'nw' :

					pse =
						zone.pse.intercept(
							action.pBase,
							action.scaleX,
							action.scaleY
						);

					pnw = pse.sub( this._zoneWidth, this._zoneHeight );

					break;

				case 'se' :

					pnw =
						zone.pnw.intercept(
							action.pBase,
							action.scaleX,
							action.scaleY
						);

					break;

				case 'sw' :

					pne =
						zone.pne.intercept(
							action.pBase,
							action.scaleX,
							action.scaleY
						);

					pnw = pne.sub( this._zoneWidth, 0 );

					break;

				default : throw new Error( );
			}

			return pnw;

		default :

			return this.fabric.pnw;
	}
};


/*
| The labels 'pnw', possibly altered by 'action'.
*/
jion.lazyValue( prototype, 'pnw', visual_label.pnw );


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_docItem.pointingHover;


/*
| Labels use pnw/fontsize for positioning
*/
visual_label.positioning =
prototype.positioning =
	'pnw/fontsize';


/*
| The item's silhoutte.
|
| FUTURE remove in favor of vSilhoutte
*/
jion.lazyValue(
	prototype,
	'silhoutte',
	function( )
{
	return(
		euclid_rect.create(
			'pnw', this.zone.pnw,
			'pse', this.zone.pse.sub( 1, 1 )
		)
	);
}
);


/*
| Handles a special key.
*/
prototype.specialKey = visual_docItem.specialKey;


/*
| Dummy since a label does not scroll.
*/
prototype.scrollMarkIntoView = function( ){ };


/*
| Dummy since a label does not scroll.
*/
prototype.scrollPage = function( ){ };


/*
| Pnw in current view.
*/
visual_label.vPnw =
	function( )
{
	return this.pnw.inView( this.view );
};


jion.lazyValue( prototype, 'vPnw', visual_label.vPnw );


/*
| The item's silhoutte in current view.
*/
visual_label.vSilhoutte =
	function( )
{
	return this.silhoutte.inView( this.view );
};


/*
| The item's silhoutte in current view.
*/
jion.lazyValue( prototype, 'vSilhoutte', visual_label.vSilhoutte);


/*
| The items silhoutte anchoret at zero for current view.
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
visual_label.vZone =
	function( )
{
	return this.zone.inView( this.view );
};


jion.lazyValue( prototype, 'vZone', visual_label.vZone );


/*
| The items silhoutte anchored at zero.
*/
visual_label.zeroSilhoutte =
	function( )
{
	var
		zone;

	zone = this.zone;

	return(
		euclid_rect.create(
			'pnw', euclid_point.zero,
			'pse',
				euclid_point.create(
					'x', Math.max( zone.width  - 1, 0 ),
					'y', Math.max( zone.height - 1, 0 )
				)
		)
	);
};


jion.lazyValue( prototype, 'zeroSilhoutte', visual_label.zeroSilhoutte );

/*
| Returns the zone height.
*/
visual_label._zoneHeight =
	function( )
{
	return this.doc.fullsize.height + 2;
};

jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


/*
| Returns the zone width.
*/
visual_label._zoneWidth =
	function( )
{
	return(
		Math.max(
			this.doc.fullsize.width + 4,
			this._zoneHeight / 4
		)
	);
};

jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


/*
| Calculates the labels zone,
| possibly altered by action.
*/
visual_label.zone =
	function( )
{
	var
		pnw;

	pnw = this.pnw;

	return(
		euclid_rect.create(
			'pnw', pnw,
			'pse', pnw.add( this._zoneWidth, this._zoneHeight )
		)
	);
};


jion.lazyValue( prototype, 'zone', visual_label.zone );


/*
| The label's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
{
	var
		display,
		vZone;

	vZone = this.vZone;

	display =
		gleam_display_canvas.create(
			'glint', this.doc.glint,
			'view',
				this.view.create(
					'height', Math.round( vZone.height + 1 ),
					'width', Math.round( vZone.width + 1 ),
					'pan', euclid_point.zero
				)
		);

	return display;
}
);


} )( );
