/*
| An item with resizing text.
*/


var
	change_set,
	euclid_display,
	euclid_point,
	euclid_rect,
	fabric_docItem,
	fabric_item,
	fabric_label,
	gruga_label,
	jion,
	root,
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
	return {
		id : 'fabric_label',
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
				type : 'jion_path',
				defaultValue : 'undefined',
				assign : ''
			},
			path :
			{
				comment : 'the path of the doc',
				type : 'jion_path',
				defaultValue : 'undefined'
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
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined'
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				defaultValue : 'undefined'
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

	fabric_label = jion.this( module, 'source' );

	fabric_label.prototype._init = function( ) { };

	return;
}


prototype = fabric_label.prototype;


/*
| Resize handles to show on labels
*/
fabric_label.handles =
	{
		ne : true,
		se : true,
		sw : true,
		nw : true
	};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( fabric_label.handles );
/**/}


/*
| Initializer.
*/
prototype._init =
	function( )
{
	var
		doc,
		height,
		pnw;

	if( !this.view )
	{
		// abstract
		return;
	}

	doc =
	this.doc =
		this.doc.create(
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', theme.label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', this.path && this.path.append( 'doc' ),
			'view', this.view.home
		);

	height = doc.height,

	pnw = this.pnw;

	this.zone =
		euclid_rect.create(
			'pnw',
				pnw,
			'pse',
				pnw.add(
					Math.round( Math.max( doc.widthUsed + 4, height / 4 ) ),
					Math.round( height + 2)
				)
		);
};


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	fabric_docItem.attentionCenter
);


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
prototype.dragStop =
	function( p )
{
	var
		action,
		changes,
		fontsize,
		zone;

	action = root.action;

	switch( action.reflect )
	{
		case 'action_itemDrag' :
		case 'action_itemResize' :

			zone = this.zone,

			fontsize = this.doc.font.size;

			changes = [ ];

			if( !this.pnw.equals( zone.pnw ) )
			{
				changes.push(
					change_set.create(
						'path', this.path.chop.append( 'pnw' ),
						'val', zone.pnw,
						'prev', this.pnw
					)
				);
			}

			if( fontsize !== this.fontsize )
			{
				changes.push(
					change_set.create(
						'path', this.path.chop.append( 'fontsize' ),
						'val', fontsize,
						'prev', this.fontsize
					)
				);
			}

			root.alter( changes );

			break;

		default :

			return fabric_item.dragStop.call( this, p );
	}
};


/*
| Draws the label.
*/
prototype.draw =
	function(
		display
	)
{
	display.drawImage(
		'image', this._display,
		'pnw', this.view.point( this.zone.pnw )
	);
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
				'handles', fabric_label.handles,
				'silhoutte', this.silhoutte,
				'view', this.view,
				'zone', this.zone
			)
		);
	}
);


/*
| Highlights the label.
|
| FIXME jionize
*/
prototype.highlight =
	function(
		display
	)
{
	display.border(
		gruga_label.getFacet( 'highlight', true ).border,
		this.silhoutte,
		this.view
	);
};


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
| Labels use pnw/fontsize for positioning
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
| Dummy since a label does not scroll.
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
| The label's display.
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
				'height', vzone.height + 1
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
		display.border( facet.border, this.zeroSilhoutte, this.view.home );

		return display;
	}
);


} )( );
