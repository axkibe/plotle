/*
| Relates two items (including other relations).
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_relation',
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
				comment : 'the relations fabric',
				type : 'fabric_relation'
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
		init : [ ]
	};
}


var
	euclid_arrow,
	euclid_connect,
	gleam_canvas,
	gleam_glint_paint,
	gleam_glint_window,
	euclid_point,
	euclid_rect,
	gleam_glint_paint,
	gruga_label,
	gruga_relation,
	jion,
	root,
	visual_docItem,
	visual_item,
	visual_label,
	visual_relation;


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

	visual_relation = jion.this( module, 'source' );

	visual_relation.prototype._init = function( ) { };

	return;
}


prototype = visual_relation.prototype;


/*
| Relations resize proportional only.
*/
prototype.proportional = true;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	visual_label.prototype._init.call( this );
};


/*
| The attention center.
*/
jion.lazyValue( prototype, 'attentionCenter', visual_docItem.attentionCenter );


/*
| Beams the item onto a gleam container.
*/
prototype.beam =
	function(
		container
	)
{
	var
		arrow1,
		arrow2,
		wg;

	wg = this._windowGlint;

	arrow1 = this._arrow1Glint( );

	arrow2 = this._arrow2Glint( );

	container = container.create( 'twig:set+', wg.id, wg );

	if( arrow1 )
	{
		container = container.create( 'twig:set+', arrow1.id, arrow1 );
	}

	if( arrow2 )
	{
		container = container.create( 'twig:set+', arrow2.id, arrow2 );
	}

	return container;
};


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
prototype.dragStart = visual_item.dragStart;


/*
| Displays the relation.
*/
prototype.draw =
	function(
		display
	)
{
	var
		item1,
		item2,
		arrow1,
		arrow2,
		space,
		zone;

	space = root.spaceVisual;

	item1 = space.get( this.item1key );

	item2 = space.get( this.item2key );

	zone = this.zone;

	if( item1 )
	{
		arrow1 =
			euclid_arrow.shape(
				euclid_connect.line(
					item1.silhoutte,
					zone
				),
				'normal',
				'normal'
			);

		arrow1 = arrow1.inView( this.view );

		display.paint( gruga_relation.facet, arrow1 );
	}

	if( item2 )
	{
		arrow2 =
			euclid_arrow.shape(
				euclid_connect.line(
					zone,
					item2.silhoutte
				),
				'normal',
				'arrow'
			);

		arrow2 = arrow2.inView( this.view );

		display.paint( gruga_relation.facet, arrow2 );
	}

	visual_label.prototype.draw.call( this, display );
};


/*
| Fontsize of the relations label.
*/
jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| A text has been inputed.
*/
prototype.input = visual_docItem.input;


/*
| Forwards fabric settings.
*/
jion.lazyValue(
	prototype,
	'item1key',
	function( )
{
	return this.fabric.item1key;
}
);


/*
| Forwards fabric settings.
*/
jion.lazyValue(
	prototype,
	'item2key',
	function( )
{
	return this.fabric.item2key;
}
);


/*
| Returns the change for dragging this item.
*/
prototype.getDragItemChange = visual_item.getDragItemChangePnwFs;


/*
| Returns the change for resizing this item.
*/
prototype.getResizeItemChange = visual_item.getResizeItemChangePnwFs;


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
| The labels 'pnw', possibly altered by 'action'.
*/
jion.lazyValue( prototype, 'pnw', visual_label.pnw );


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_item.pointingHover;


/*
| Relations use pnw/fontsize for positioning
*/
prototype.positioning = 'pnw/fontsize';


/*
| The item's silhoutte.
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
| Returns the minimum scale factor this item could go through.
*/
prototype.minScaleX = visual_label.minScaleX;

prototype.minScaleY = visual_label.minScaleY;


/*
| Dummy since a relation does not scroll.
*/
prototype.scrollMarkIntoView = function( ){ };


/*
| Dummy since a label does not scroll.
*/
prototype.scrollPage = function( ){ };


/*
| The items silhoutte anchored at zero.
*/
jion.lazyValue( prototype, 'zeroSilhoutte', visual_label.zeroSilhoutte );


/*
| The items silhoutte anchored at zero for current view.
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
| Pnw in current view.
*/
jion.lazyValue( prototype, 'vPnw', visual_label.vPnw );


/*
| Calculates the relations silhoutte for current view.
*/
jion.lazyValue( prototype, 'vSilhoutte', visual_label.vSilhoutte );


/*
| Calculates the relations zone for current view.
*/
jion.lazyValue( prototype, 'vZone', visual_label.vZone );


/*
| Calculates the relations zone, FUTURE vZone only
*/
jion.lazyValue( prototype, 'zone', visual_label.zone );


/*
| The relation's display.
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
		this.doc.draw(
			display,
			this.zone.width,
			euclid_point.zero
		);

		facet = gruga_label.facets.getFacet( );

		// displays the border
		display.border( facet.border, this.vZeroSilhoutte );

		return display;
	}
);


/*
| The item's arrow 1 glint.
*/
prototype._arrow1Glint =
	function( )
{
	var
		arrow1,
		item1;

	item1 = root.spaceVisual.get( this.item1key );

	if( !item1 ) return undefined;

	arrow1 =
		euclid_arrow.shape(
			euclid_connect.line(
				item1.silhoutte,
				this.zone
			),
			'normal',
			'normal'
		).
		inView( this.view );

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape', arrow1
		)
	);
};


/*
| The item's gleam arrow 2.
*/
prototype._arrow2Glint =
	function( )
{
	var
		arrow2,
		item2;

	item2 = root.spaceVisual.get( this.item2key );

	if( !item2 ) return undefined;

	arrow2 =
		euclid_arrow.shape(
			euclid_connect.line(
				this.zone,
				item2.silhoutte
			),
			'normal',
			'arrow'
		).
		inView( this.view );

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape', arrow2
		)
	);
};


/*
| The item's window gling
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
			'p', this.vZone.pnw
		)
	);
}
);


jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


} )( );

