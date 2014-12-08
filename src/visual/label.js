/*
| An item with resizing text.
*/


var
	euclid_display,
	euclid_point,
	euclid_rect,
	jools,
	peer,
	root,
	Style,
	theme,
	visual;


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
			'visual.label',
		attributes :
			{
				doc :
					{
						comment :
							'the labels document',
						type :
							'visual.doc',
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
							'jion.path',
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
							'jion.path',
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
									'visual.item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},

						type :
							'Object', // FUTURE '->marks',
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
			'visual.docItem'
	};
}


var
	label;


/*
| Node includes.
*/
if( SERVER )
{
	jools = require( '../jools/jools' ),

	label = require( '../jion/this' )( module );
}
else
{
	label = visual.label;
}


/*
| Initializer.
*/
label.prototype._init =
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
			'flowWidth',
				0,
			'fontsize',
				this.fontsize,
			'innerMargin',
				theme.label.innerMargin,
			'mark',
				this.mark,
			'paraSep',
				Math.round( this.fontsize / 20 ),
			'path',
				docPath,
			'view',
				this.view
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
label.prototype.positioning =
	'pnw/fontsize';


/*
| Resize handles to show on labels
*/
label.prototype.handles =
	{
		ne : true,
		se : true,
		sw : true,
		nw : true
	};

/**/if( CHECK )
/**/{
/**/	Object.freeze( label.prototype.handles );
/**/}


/*
| Highlights the label.
*/
label.prototype.highlight =
	function(
		display
	)
{
	display.edge(
		Style.getStyle(
			theme.label.style,
			'highlight'
		),
		this.silhoutte,
		this.view
	);
};


/*
| The label's silhoutte.
*/
jools.lazyValue(
	label.prototype,
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
	label.prototype,
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
| Sets the items position and size aften an action.
*/
label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action,
		fontsize,
		zone;

	action = root.action;

	switch( action.reflect )
	{
		case 'actions.itemDrag' :
		case 'actions.itemResize' :

			zone = this.zone,

			fontsize = this.doc.font.size;

			if(
				!this.pnw.equals( zone.pnw )
			)
			{
				peer.setPNW( this.path, zone.pnw );
			}

			if( fontsize !== this.fontsize )
			{
				peer.setFontSize( this.path, fontsize );
			}

			break;

		default :

			return(
				visual.docItem.prototype.dragStop.call(
					this,
					view,
					p
				)
			);
	}
};


/*
| The label's display.
*/
jools.lazyValue(
	label.prototype,
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
			Style.getStyle(
				theme.label.style,
				'normal'
			),
			this.zeroSilhoutte,
			hview
		);

		return display;
	}
);


/*
| Draws the label.
|
| FIXME: move the common stuff into visual.item.draw()
*/
label.prototype.draw =
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
label.prototype.mousewheel =
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
label.prototype.scrollMarkIntoView =
	function( )
{
	// nada
};


/*
| Dummy since a label does not scroll.
*/
label.prototype.scrollPage =
	function(
		// up
	)
{
	// nada
};



} )( );
