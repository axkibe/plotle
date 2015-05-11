/*
| An item with resizing text.
*/


var
	change_set,
	euclid_display,
	euclid_point,
	euclid_rect,
	gruga_label,
	jion,
	root,
	theme,
	visual_doc,
	visual_docItem,
	visual_handlesBezel,
	visual_item,
	visual_label;


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
		id : 'visual_label',
		attributes :
		{
			fabric :
			{
				comment : 'the labels fabric',
				type : 'fabric_label'
			},
			hover :
			{
				comment : 'node currently hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				prepare : 'visual_item.concernsMark( mark, path )',
				type :
					require( '../typemaps/visualMark' )
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

	visual_label = jion.this( module, 'source' );

	visual_label.prototype._init = function( ) { };

	return;
}


prototype = visual_label.prototype;


/*
| Resize handles to show on labels
*/
visual_label.handles =
{
	ne : true,
	se : true,
	sw : true,
	nw : true
};


if( FREEZE )
{
	Object.freeze( visual_label.handles );
}


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
			'innerMargin', theme.label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', this.path && this.path.append( 'doc' ),
			'view', this.view.home
		);
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
| A shorthand to (re)create this note
| with a different fontsize.
*/
prototype.createWithFontsize =
	function(
		fontsize
	)
{
	return(
		this.create( 'fabric', this.fabric.create( 'fontsize', fontsize ) )
	);
};


/*
| A shorthand to (re)create this note
| with a different pnw.
*/
prototype.createWithPnw =
	function(
		pnw
	)
{
	return(
		this.create( 'fabric', this.fabric.create( 'pnw', pnw ) )
	);
};


/*
| A move during an action.
*/
prototype.dragMove = visual_item.dragMove;


/*
| Handles a potential dragStart event for this item.
*/
prototype.dragStart = visual_item.dragStart;


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

			return visual_item.dragStop.call( this, p );
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
		'pnw', this.vPnw
	);
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
			'handles', visual_label.handles,
			'silhoutte', this.vSilhoutte,
			'zone', this.vZone
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
		this.vSilhoutte
	);
};


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
jion.lazyValue(
	prototype,
	'pnw',
function( )
{
	return this.fabric.pnw;
}
);


/*
| User is hovering their pointing device over something.
*/
prototype.pointingHover = visual_item.pointingHover;


/*
| Labels use pnw/fontsize for positioning
*/
prototype.positioning = 'pnw/fontsize';


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
	return this.fabric.pnw.inView( this.view );
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
| Zone in current view.
*/
visual_label.vZone =
	function( )
{
	return this.zone.inView( this.view );
};


jion.lazyValue( prototype, 'vZone', visual_label.vZone );


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
| Calculates the labels zone, FUTURE vZone only
*/
visual_label.zone =
	function( )
{
	var
		doc,
		pnw;

	pnw = this.fabric.pnw;

	doc = this.doc;

	return(
		euclid_rect.create(
			'pnw', pnw,
			'pse',
				pnw.add(
					Math.round(
						Math.max( doc.widthUsed + 4, doc.height / 4 )
					),
					Math.round( doc.height + 2 )
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
			doc,
			display,
			facet,
			vZone; // FIXME use lazyVal

		vZone = this.zone.inView( this.view );

		display =
			euclid_display.create(
				'width', vZone.width,
				'height', vZone.height + 1
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
		display.border( facet.border, this.vZeroSilhoutte );

		return display;
	}
);


} )( );
