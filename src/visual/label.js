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
				assign : '_action',
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
	gleam_canvas,
	gleam_glint_window,
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
| Resize handles to show on labels
*/
visual_label.prototype.resizeHandles = 'zoom';


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
| Draws the label.
*/
prototype.draw =
	function(
		display
	)
{
	var
		action;

	action = this._action;

	display.drawImage(
		'image', this._display,
		'pnw', this.vPnw
	);

	if( this.highlight )
	{
		display.border(
			gruga_label.facets.getFacet( 'highlight', true ).border,
			this.vSilhoutte
		);
	}
};


/*
| Beams the label onto a gleam container.
*/
prototype.beam =
	function(
		container
	)
{
	var
		wg;

	wg = this._windowGlint;

	return(
		container.create( 'twig:set+', wg.id, wg )
	);
};


/*
| The fontsize of the label.
*/
visual_label.fontsize =
	function( )
{
	var
		action;

	action = this._action;

	switch( action && action.reflect )
	{
		case 'action_itemResize' : return action.toFontsize;

		default : return this.fabric.fontsize;
	}
};


jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| An itemDrag action stopped.
*/
prototype.itemDrag = visual_item.itemDragForFontsizePositioning;


/*
| An itemResize action stopped.
*/
prototype.stopItemResize = visual_item.stopItemResizePnwFs;


/*
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


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
| Forwards fabric settings.
*/
visual_label.pnw =
	function( )
{
	var
		action;

	action = this._action;

	switch( action && action.reflect )
	{
		case 'action_itemDrag' :
		case 'action_itemResize' :

			return action.toPnw;

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
prototype.pointingHover = visual_item.pointingHover;


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
| Calculates the labels zone,
| possibly altered by action.
*/
visual_label.zone =
	function( )
{
	var
		doc,
		dHeight,
		dWidth,
		pnw;

	pnw = this.pnw;

	doc = this.doc;

	dHeight = doc.fullsize.height;

	dWidth = doc.fullsize.width;

	return(
		euclid_rect.create(
			'pnw', pnw,
			'pse',
				pnw.add(
					Math.max( dWidth + 4, dHeight / 4 ),
					dHeight + 2
			)
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
		facet,
		vZone;

	vZone = this.vZone;

	display =
		gleam_canvas.create(
			'width', vZone.width,
			'height', vZone.height + 1
		);

	// displays selection and text
	this.doc.draw( display, this.zone.width, euclid_point.zero );

	// displays the border
	facet = gruga_label.facets.getFacet( );

	display.border( facet.border, this.vZeroSilhoutte );

	return display;
}
);


/*
| The items window glint.
*/
jion.lazyValue(
	prototype,
	'_windowGlint',
	function( )
{
	// TODO inherit
	return(
		gleam_glint_window.create(
			'display', this._display,
			'p', this.vPnw
		)
	);
}
);

} )( );
