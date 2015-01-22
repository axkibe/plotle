/*
| An item with resizing text.
*/


var
	change_set,
	euclid_display,
	euclid_point,
	euclid_rect,
	fabric_docItem,
	fabric_label,
	jools,
	root,
	shell_style,
	theme;


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
		id :
			'fabric_label',
		attributes :
			{
				doc :
					{
						comment :
							'the labels document',
						type :
							'fabric_doc',
						json :
							true
					},
				fontsize :
					{
						comment :
							'the fontsize of the label',
						type :
							'Number',
						json :
							true
					},
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'jion_path',
						assign :
							null,
						// FIXME make defaultValue undefined for server
						defaultValue :
							null
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'jion_path',
						defaultValue :
							undefined
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'euclid_point',
						json :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								type :
									'fabric_item',
								func :
									'concernsMark',
								args :
									[ 'mark', 'path' ]
							},

						type :
							'Object', // FUTURE '->mark',
						defaultValue :
							undefined,
						allowsNull :
							true
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						defaultValue :
							undefined
					}
			},
		init :
			[ ],
		subclass :
			'fabric_docItem'
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	fabric_label = require( '../jion/this' )( module );

	jools = require( '../jools/jools' );
}


/*
| Initializer.
*/
fabric_label.prototype._init =
	function( )
{
	var
		doc,
		docPath,
		height,
		pnw;

	if( !this.view )
	{
		// abstract
		return;
	}

	// FIXME not if inherited
	docPath = this.path.append( 'doc' );

	doc =
	this.doc =
		this.doc.create(
			'flowWidth', 0,
			'fontsize', this.fontsize,
			'innerMargin', theme.label.innerMargin,
			'mark', this.mark,
			'paraSep', Math.round( this.fontsize / 20 ),
			'path', docPath,
			'view', this.view
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
| Labels use pnw/fontsize for positioning
*/
fabric_label.prototype.positioning = 'pnw/fontsize';


/*
| Resize handles to show on labels
*/
fabric_label.prototype.handles =
	{
		ne : true,
		se : true,
		sw : true,
		nw : true
	};

/**/if( FREEZE )
/**/{
/**/	Object.freeze( fabric_label.prototype.handles );
/**/}


/*
| Highlights the label.
*/
fabric_label.prototype.highlight =
	function(
		display
	)
{
	display.edge(
		shell_style.getStyle( theme.label.style, 'highlight' ),
		this.silhoutte,
		this.view
	);
};


/*
| The label's silhoutte.
*/
jools.lazyValue(
	fabric_label.prototype,
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
| The items silhoutte anchored at zero.
*/
jools.lazyValue(
	fabric_label.prototype,
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
| Sets the items position and size after an action.
|
| FIXME, is this ever called???
*/
fabric_label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action,
		changes,
		fontsize,
		zone;

	action = root.action;

	switch( action.reflect )
	{
		case 'actions_itemDrag' :
		case 'actions_itemResize' :

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

			return(
				fabric_docItem.prototype.dragStop.call( this, view, p )
			);
	}
};


/*
| The label's display.
*/
jools.lazyValue(
	fabric_label.prototype,
	'_display',
	function( )
	{
		var
			doc,
			display,
			hview,
			vzone;

		vzone = this.view.rect( this.zone );

		display =
			euclid_display.create(
				'width', vzone.width,
				'height', vzone.height
			);

		doc = this.doc;

		hview = this.view.home;

		// displays selection and text
		doc.draw(
			display,
			hview,
			this.zone.width,
			euclid_point.zero
		);

		// displays the border
		display.edge(
			shell_style.getStyle( theme.label.style, 'normal' ),
			this.zeroSilhoutte,
			hview
		);

		return display;
	}
);


/*
| Draws the label.
|
| FIXME: move the common stuff into fabric_item.draw()
*/
fabric_label.prototype.draw =
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
| Mouse wheel turned.
*/
fabric_label.prototype.mousewheel =
	function(
		// view,
		// p,
		// dir
	)
{
	return false;
};



/*
| Dummy since a label does not scroll.
*/
fabric_label.prototype.scrollMarkIntoView =
	function( )
{
	// nada
};


/*
| Dummy since a label does not scroll.
*/
fabric_label.prototype.scrollPage =
	function(
		// up
	)
{
	// nada
};



} )( );
