/*
| Relates two items (including other relations).
*/


var
	euclid_arrow,
	euclid_display,
	euclid_point,
	euclid_rect,
	gruga_label,
	gruga_relation,
	jion,
	root,
	visual_docItem,
	visual_handlesBezel,
	visual_item,
	visual_label,
	visual_relation;


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
		id : 'visual_relation',
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
				comment : 'the relations fabric',
				type : 'fabric_relation'
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
| Resize handles to show on relations.
*/
visual_relation.handles =
{
	ne : true,
	se : true,
	sw : true,
	nw : true
};


if( FREEZE )
{
	Object.freeze( visual_relation.handles );
}


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
| A move during an action.
*/
prototype.dragMove = visual_item.dragMove;


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
			euclid_arrow.connect(
				item1.silhoutte, 'normal',
				zone, 'normal'
			);

		arrow1 = arrow1.inView( this.view );

		arrow1.draw( display, gruga_relation );
	}

	if( item2 )
	{
		arrow2 =
			euclid_arrow.connect(
				zone, 'normal',
				item2.silhoutte, 'arrow'
			);

		arrow2 = arrow2.inView( this.view );

		arrow2.draw( display, gruga_relation );
	}

	visual_label.prototype.draw.call( this, display );
};


/*
| Fontsize of the relations label.
*/
jion.lazyValue( prototype, 'fontsize', visual_label.fontsize );


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
				'handles', visual_relation.handles,
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
| An itemDrag action stopped.
*/
prototype.itemDrag = visual_item.itemDragForFontsizePositioning;


/*
| An itemResize action stopped.
*/
prototype.itemResize = visual_item.itemResize;


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
| Dummy since a relation does not scroll.
*/
prototype.scrollMarkIntoView = function( ){ };


/*
| Dummy since a label does not scroll.
*/
prototype.scrollPage = function( ){ };


/*
| The items silhoutte anchored at zero.
| FIXME isn't that identical to label?
*/
jion.lazyValue(
	prototype,
	'zeroSilhoutte',
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
}
);

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
			euclid_display.create(
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


} )( );

