/*
| An item with resizing text.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Visual;


/*
| Imports
*/
var
	euclid,
	jools,
	Peer,
	shell,
	Style,
	theme,
	Visual;


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
		name :
			'Label',
		unit :
			'Visual',
		attributes :
			{
				doc :
					{
						comment :
							'the labels document',
						// FUTURE make this type: 'Visual.Doc'
						type :
							'Doc',
						unit :
							'Visual',
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
							'path',
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
							'path',
						defaultValue :
							undefined
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'Point',
						unit :
							'euclid',
						json :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								unit :
									'Visual',
								type :
									'Item',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},

						type :
							'Mark',
						defaultValue :
							undefined
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						defaultValue :
							undefined
					}
			},
		init :
			[ ],
		node :
			true,
		subclass :
			'Visual.DocItem'
	};
}


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools' ),

	Visual =
		{
			Label :
				require( '../jion/this' )( module )
		};
}


var
	Label;

Label = Visual.Label;


/*
| Initializer.
*/
Label.prototype._init =
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
	docPath = this.path.Append( 'doc' );

	doc =
	this.doc =
		this.doc.create(
			'flowWidth',
				0,
			'fontsize',
				this.fontsize,
			'mark',
				this.mark,
			'paraSep',
				Math.round( this.fontsize / 20 ),
			'path',
				docPath,
			'view',
				this.view
		);

	height =
		doc.height,

	pnw =
		this.pnw;

	this.zone =
		euclid.Rect.create(
			'pnw',
				pnw,
			'pse',
				pnw.add(
					Math.round(
						Math.max(
							doc.spread + 3,
							height / 4
						)
					),
					Math.round(
						height + 2
					)
			)
		);
};


/*
| Labels use pnw/fontsize for positioning
*/
Label.prototype.positioning =
	'pnw/fontsize';


if( SHELL )
{
	/*
	| Default margin for all labels.
	*/
	Label.prototype.innerMargin =
		new euclid.Margin(
			theme.label.innerMargin
		);
}


/*
| Resize handles to show on labels
*/
Label.prototype.handles =
	jools.immute(
		{
			ne :
				true,
			se :
				true,
			sw :
				true,
			nw :
				true
		}
	);


/*
| Highlights the label.
*/
Label.prototype.highlight =
	function(
		fabric
	)
{
	fabric.edge(
		Style.getStyle(
			theme.label.style,
			'highlight'
		),
		this.silhoutte,
		'sketch',
		this.view
	);
};


/*
| The label's silhoutte.
*/
jools.lazyValue(
	Label.prototype,
	'silhoutte',
	function( )
	{
		return (
			euclid.Rect.create(
				'pnw',
					this.zone.pnw,
				'pse',
					this.zone.pse.sub( 1, 1 )
			)
		);
	}
);


/*
| The items silhoutte anchored at zero.
*/
jools.lazyValue(
	Label.prototype,
	'zeroSilhoutte',
	function( )
	{
		var
			zone =
				this.zone;

		return (
			euclid.Rect.create(
				'pnw',
					euclid.Point.zero,
				'pse',
					euclid.Point.create(
						'x',
							Math.max( zone.width  - 1, 0 ),
						'y',
							Math.max( zone.height - 1, 0 )
					)
			)
		);
	}
);


/*
| Sets the items position and size aften an action.
*/
Label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action,
		fontsize,
		zone;

	action =
		shell.action;

	switch( action.reflex )
	{
		case 'action.itemDrag' :
		case 'action.itemResize' :

			zone =
				this.zone,

			fontsize =
				this.doc.font.size;

			if(
				!this.pnw.equals( zone.pnw )
			)
			{
				Peer.setPNW(
					this.path,
					zone.pnw
				);
			}

			if( fontsize !== this.fontsize )
			{
				Peer.setFontSize(
					this.path,
					fontsize
				);
			}

			break;

		default :

			return Visual.DocItem.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


/*
| The label's fabric.
*/
jools.lazyValue(
	Label.prototype,
	'_fabric',
	function( )
	{
		var
			doc,
			f,
			hview,
			vzone;

		vzone = this.view.rect( this.zone );

		f =
			euclid.fabric.create(
				'width',
					vzone.width,
				'height',
					vzone.height
			);

		doc = this.doc;

		hview = this.view.home;

		// draws selection and text
		doc.draw(
			f,
			hview,
			this,
			this.zone.width,
			euclid.Point.zero
		);

		// draws the border
		f.edge(
			Style.getStyle(
				theme.label.style,
				'normal'
			),
			this.zeroSilhoutte,
			'sketch',
			hview
		);

		return f;
	}
);


/*
| Draws the label.
|
| FIXME: move the common stuff into Visual.Item.draw()
*/
Label.prototype.draw =
	function(
		fabric
	)
{
	fabric.drawImage(
		'image',
			this._fabric,
		'pnw',
			this.view.point( this.zone.pnw )
	);
};


/*
| Mouse wheel turned.
*/
Label.prototype.mousewheel =
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
Label.prototype.scrollMarkIntoView =
	function( )
{
	// nada
};


/*
| Dummy since a label does not scroll.
*/
Label.prototype.scrollPage =
	function(
		// up
	)
{
	// nada
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Label;
}


} )( );
