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
	euclid_point,
	gleam_display_canvas,
	gleam_glint_paint,
	gleam_glint_twig,
	gleam_glint_disWindow,
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
| Arrow 1 shape.
|
| This cannot be a lazyValue since when the other
| item moves, the arrow changes.
*/
prototype.arrow1Shape =
	function( )
{
	var
		item1;

	item1 = root.spaceVisual.get( this.item1key );

	if( !item1 ) return undefined;

	return(
		euclid_arrow.create(
			'joint1', item1.silhoutte,
			'joint2', this.silhoutte,
			'end1', 'normal',
			'end2', 'normal'
		)
	);
};


/*
| Arrow 2 shape.
|
| This cannot be a lazyValue since when the other
| item moves, the arrow changes.
*/
prototype.arrow2Shape =
	function( )
{
	var
		item2;

	item2 = root.spaceVisual.get( this.item2key );

	if( !item2 ) return undefined;

	return(
		euclid_arrow.create(
			'joint1', this.silhoutte,
			'joint2', item2.silhoutte,
			'end1', 'normal',
			'end2', 'arrow'
		)
	);
};


/*
| Fontsize of the relations label.
*/
jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


/*
| The item's glint.
|
| This cannot be done lazily, since
| when one of the items the relation
| points to is moved the arrows are moved
| too.
|
| FIXME do some caching nonetheless.
*/
Object.defineProperty(
	prototype,
	'glint',
{
	get:
		function( )
	{
		var
			arrow1,
			arrow2,
			facet,
			glint,
			wg;

		wg =
			gleam_glint_disWindow.create(
				'display', this._display,
				'key', ':label',
				'p', this.pnw.inView( this.view )
			);

		arrow1 = this._arrow1Glint( );

		arrow2 = this._arrow2Glint( );

		glint =
			gleam_glint_twig.create(
				'key', this.key,
				'twine:set+', wg
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

		if( arrow1 )
		{
			glint = glint.create( 'twine:set+', arrow1 );
		}

		if( arrow2 )
		{
			glint = glint.create( 'twine:set+', arrow2 );
		}

		return glint;
	}
}
);


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
prototype.pointingHover = visual_docItem.pointingHover;


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
| Nofication when the item lost the users mark.
*/
prototype.markLost = visual_label.prototype.markLost;


/*
| Returns the minimum scale factor this item could go through.
*/
prototype.minScaleX = visual_label.minScaleX;

prototype.minScaleY = visual_label.minScaleY;


/*
| A move during a text select on this item.
*/
prototype.moveSelect = visual_docItem.moveSelect;


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
		vZone;

	vZone = this.vZone;

	display =
		gleam_display_canvas.create(
			'view',
				this.view.create(
					'pan', euclid_point.zero,
					'height', Math.round( vZone.height ),
					'width', Math.round( vZone.width )
				),
			'glint', this.doc.glint
		);

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
		arrow1;

	arrow1 = this.arrow1Shape( );

	if( !arrow1 ) return undefined;

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'key', 'arrow1',
			'shape', arrow1.shape.inView( this.view )
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
		arrow2;

	arrow2 = this.arrow2Shape( );

	if( !arrow2 ) return undefined;

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'key', 'arrow2',
			'shape', arrow2.shape.inView( this.view )
		)
	);
};


jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


} )( );

