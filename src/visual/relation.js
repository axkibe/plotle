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
					require( '../action/typemap' )
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
					require( './mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			transform :
			{
				comment : 'the current space transform',
				type : 'gleam_transform'
			}
		},
		init : [ ]
	};
}


var
	gleam_arrow,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_window,
	gleam_rect,
	gleam_size,
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
			gLen,
			gRay,
			tZone,
			wg;

		tZone = this.tZone;

		wg =
			gleam_glint_window.create(
				'glint', this.doc.glint,
				'p', tZone.pnw,
				'size',
					gleam_size.create(
						'height', Math.round( tZone.height + 1 ),
						'width', Math.round( tZone.width + 1 )
					)
			);

		arrow1 = this._arrow1Glint( );

		arrow2 = this._arrow2Glint( );

		gRay = [ wg ];

		gLen = 1;

		if( this.highlight )
		{
			facet = gruga_label.facets.getFacet( 'highlight', true );

			gRay[ gLen++ ] =
				gleam_glint_paint.create(
					'facet', facet,
					'shape', this.tSilhoutte
				);
		}

		if( arrow1 ) gRay[ gLen++ ] = arrow1;

		if( arrow2 ) gRay[ gLen++ ] = arrow2;

		return gleam_glint_ray.create( 'ray:init', gRay );
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
| FIXME see visual_label.mousewheel
*/
prototype.mousewheel =
	function(
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
		gleam_rect.create(
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
| The items silhoutte otrho-transformed.
*/
jion.lazyValue(
	prototype,
	'tOrthoSilhoutte',
	function( )
{
	return this.zeroSilhoutte.transform( this.transform.ortho );
}
);


/*
| The relations silhoutte for current transform.
*/
jion.lazyValue( prototype, 'tSilhoutte', visual_label.tSilhoutte );


/*
| The relations zone for current transform.
*/
jion.lazyValue( prototype, 'tZone', visual_label.tZone );


/*
| The relations zone.
*/
jion.lazyValue( prototype, 'zone', visual_label.zone );


/*
| The item's arrow 1 glint.
|
| This cannot be a lazyValue since when the other
| item moves, the arrow changes.
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
		gleam_arrow.create(
			'joint1', item1.silhoutte,
			'joint2', this.silhoutte,
			'end1', 'normal',
			'end2', 'normal'
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape', arrow1.shape.transform( this.transform )
		)
	);
};


/*
| The item's gleam arrow 2.
|
| This cannot be a lazyValue since when the other
| item moves, the arrow changes.
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
		gleam_arrow.create(
			'joint1', this.silhoutte,
			'joint2', item2.silhoutte,
			'end1', 'normal',
			'end2', 'arrow'
		);

	return(
		gleam_glint_paint.create(
			'facet', gruga_relation.facet,
			'shape', arrow2.shape.transform( this.transform )
		)
	);
};


jion.lazyValue( prototype, '_zoneHeight', visual_label._zoneHeight );


jion.lazyValue( prototype, '_zoneWidth', visual_label._zoneWidth );


} )( );

