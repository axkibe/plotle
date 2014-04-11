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
	Euclid,
	Jools,
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
| The joobj definition.
*/
if( JOOBJ )
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
							'Path',
						assign :
							null,
						// FIXME make defaultValue undefined for server
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the doc',
						type :
							'Path',
						defaultValue :
							'undefined'
					},
				pnw :
					{
						comment :
							'point in the north-west',
						type :
							'Point',
						unit :
							'Euclid',
						json :
							true
					},
				mark :
					{
						comment :
							'the users mark',
						concerns :
							{
								func :
									// FUTURE this is kinda not nice
									'Visual.Item && Visual.Item.concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},

						type :
							'Mark',
						defaultValue :
							'undefined'
					},
				traitSet :
					{
						comment :
							'traits set',
						type :
							'TraitSet',
						assign :
							null,
						// FIXME make defaultValue undefined for server
						defaultValue :
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						defaultValue :
							'undefined'
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
	Jools =
		require( '../jools/jools' ),

	Visual =
		{
			Label :
				require( '../joobj/this' )( module )
		};
}


var
	Label =
		Visual.Label;


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

	docPath =
		// FIXME not if inherited
		this.path.append( 'doc' );

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
		Euclid.Rect.create(
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
		new Euclid.Margin(
			theme.label.innerMargin
		);
}


/*
| Resize handles to show on labels
*/
Label.prototype.handles =
	Jools.immute(
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
Jools.lazyValue(
	Label.prototype,
	'silhoutte',
	function( )
	{
		return (
			Euclid.Rect.create(
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
Jools.lazyValue(
	Label.prototype,
	'zeroSilhoutte',
	function( )
	{
		var
			zone =
				this.zone;

		return (
			Euclid.Rect.create(
				'pnw',
					Euclid.Point.zero,
				'pse',
					Euclid.Point.create(
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

	switch( action.reflect )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			zone =
				this.zone,

			fontsize =
				this.doc.font.size;

			if(
				!this.pnw.equals( zone.pnw )
			)
			{
				shell.peer.setPNW(
					this.path,
					zone.pnw
				);
			}

			if( fontsize !== this.fontsize )
			{
				shell.peer.setFontSize(
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
Jools.lazyValue(
	Label.prototype,
	'_fabric',
	function( )
	{
		var
			doc,
			f,
			hview,
			vzone;

		vzone =
			this.view.rect( this.zone );

		f =
			Euclid.Fabric.create(
				'width',
					vzone.width,
				'height',
					vzone.height
			);

		doc =
			this.doc;

		hview =
			this.view.home;

		// draws selection and text
		doc.draw(
			f,
			hview,
			this,
			this.zone.width,
			Euclid.Point.zero
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
