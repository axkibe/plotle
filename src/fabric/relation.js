/*
| Relates two items (including other relations).
*/


var
	change_grow,
	euclid_arrow,
	euclid_display,
	euclid_point,
	euclid_rect,
	fabric_doc,
	fabric_docItem,
	fabric_item,
	fabric_label,
	fabric_para,
	fabric_relation,
	gruga_label,
	gruga_relation,
	jion,
	jion$path,
	mark_caret,
	root,
	session_uid,
	theme,
	visual_handlesBezel;


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
		id : 'fabric_relation',
		attributes :
		{
			doc :
			{
				comment : 'the labels document',
				type : 'fabric_doc',
				json : true
			},
			fontsize :
			{
				comment : 'the fontsize of the label',
				type : 'number',
				json : true
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			item1key :
			{
				comment : 'item the relation goes from',
				type : 'string',
				json : true
			},
			item2key :
			{
				comment : 'item the relation goes to',
				type : 'string',
				json : true
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			pnw :
			{
				comment : 'point in the north-west',
				type : 'euclid_point',
				json : true
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'fabric_item.concernsMark( mark, path )',
				type :
					require( '../typemaps/mark' )
					.concat( [ 'undefined' ] )
			},
			view :
			{
				comment : 'the current view',
				type : [ 'undefined', 'euclid_view' ]
			}
		},
		init : [ 'inherit' ]
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

	fabric_relation = jion.this( module, 'source' );

	fabric_relation.prototype._init = function( ) { };

	return;
}


prototype = fabric_relation.prototype;


/*
| Resize handles to show on relations.
*/
fabric_relation.handles =
	{
		ne : true,
		se : true,
		sw : true,
		nw : true
	};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( fabric_relation.handles );
/**/}



/*
| Creates a new relation by specifing its relates.
*/
fabric_relation.spawn =
	function(
		item1,
		item2
	)
{
	var
		arrow,
		key,
		pnw,
		val;

	arrow =
		euclid_arrow.connect(
			item1.silhoutte, 'normal',
			item2.silhoutte, 'normal'
		);

	pnw = arrow.pc.sub( theme.relation.spawnOffset );

	val =
		fabric_relation.create(
			'pnw', pnw,
			'doc',
				fabric_doc.create(
					'twig:add', '1',
					fabric_para.create( 'text', 'relates to' )
				),
			'fontsize', 20,
			'item1key', item1.path.get( -1 ),
			'item2key', item2.path.get( -1 )
		);

	key = session_uid( );

	root.alter(
		change_grow.create(
			'val', val,
			'path', jion$path.empty.append( 'twig' ).append( key ),
			'rank', 0
		)
	);

	root.create(
		'mark',
			mark_caret.create(
				'path', root.spaceVisual.get( key ).doc.atRank( 0 ).textPath,
				'at', 0
			)
	);
};


/*
| Initializer.
*/
prototype._init =
	function(
		inherit
	)
{
	fabric_label.prototype._init.call( this, inherit );
};


/*
| The attention center.
*/
jion.lazyValue( prototype, 'attentionCenter', fabric_docItem.attentionCenter );


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
| Sets the items position and size after an action.
*/
prototype.dragStop = fabric_label.prototype.dragStop;


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

	item1 = space.getVis( this.item1key );

	item2 = space.getVis( this.item2key );

	zone = this.zone;

	if( item1 )
	{
		arrow1 =
			euclid_arrow.connect(
				item1.silhoutte, 'normal',
				zone, 'normal'
			);

		arrow1.draw( display, this.view, gruga_relation );
	}

	if( item2 )
	{
		arrow2 =
			euclid_arrow.connect(
				zone, 'normal',
				item2.silhoutte, 'arrow'
			);

		arrow2.draw( display, this.view, gruga_relation );
	}

	fabric_label.prototype.draw.call( this, display );
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
				'handles', fabric_relation.handles,
				'silhoutte', this.silhoutte,
				'view', this.view,
				'zone', this.zone
			)
		);
	}
);


/*
| Highlights the item.
*/
prototype.highlight = fabric_label.prototype.highlight;


/*
| A text has been inputed.
*/
prototype.input = fabric_docItem.input;


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
| User is hovering their pointing device over something.
*/
prototype.pointingHover = fabric_item.pointingHover;


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
prototype.specialKey = fabric_docItem.specialKey;



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
| The relation's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
	{
		var
			doc,
			display,
			facet,
			vzone;

		vzone = this.view.rect( this.zone );

		display =
			euclid_display.create(
				'width', vzone.width,
				'height', vzone.height
			);

		doc = this.doc;

		// displays selection and text
		doc.draw(
			display,
			this.zone.width,
			euclid_point.zero
		);

		facet = gruga_label.getFacet( );

		// displays the border
		display.border(
			facet.border,
			this.zeroSilhoutte,
			this.view.home
		);

		return display;
	}
);


} )( );

