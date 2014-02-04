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


Visual =
	Visual || { };


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
				hover :
					{
						comment :
							'node currently hovered upon',

						type :
							'Path',

						assign :
							null,

						allowNull :
							true,

						defaultVal :
							'null'
					},

				path :
					{
						comment :
							'the path of the doc',

						type :
							'Path'
					},

				mark :
					{
						comment :
							'the users mark',

						concerns :
							{
								func :
									'Visual.Item.concernsMark',

								args :
									[
										'mark',
										'path'
									]
							},

						type :
							'Mark'
					},

				traitSet :
					{
						comment :
							'traits set',

						type :
							'TraitSet',

						allowNull :
							true,

						assign :
							null,

						defaultVal :
							'null'
					},

				tree :
					{
						comment :
							'the data tree',

						type :
							'Tree'
					},

				view :
					{
						comment :
							'the current view',

						type :
							'View'
					}
			},

		init :
			[
				'inherit'
			],


		subclass :
			'Visual.DocItem'
	};
}


var
	Label =
		Visual.Label;


/*
| Initializer.
*/
Label.prototype._init =
	function(
		inherit
	)
{
	var
		twig =
			this.tree.twig;

	// FIXME remove shortcut
	this.fontsize =
		twig.fontsize;

	// FIXME remove shortcut
	this.pnw =
		twig.pnw;

	this.sub =
		{ };

	var
		doc =
		this.sub.doc =
			Visual.Doc.create(
				'inherit',
					inherit && inherit.sub.doc,
				'path',
					inherit ?
						undefined
						:
						this.path.append( 'doc' ),
				'tree',
					twig.doc,
				'fontsize',
					this.fontsize,
				'flowWidth',
					0,
				'paraSep',
					Math.round( this.fontsize / 20 ),
				'mark',
					this.mark,
				'view',
					this.view
			),

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

/* TODO
			case 'hover' :
				// ignored
				break;

			case 'traitSet' :
				break;
*/


/*
| Labels use pnw/fontsize for positioning
*/
Label.prototype.positioning =
	'pnw/fontsize';


/*
| Default margin for all labels.
*/
Label.prototype.innerMargin =
	new Euclid.Margin(
		theme.label.innerMargin
	);


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
		action =
			shell.action;

	switch( action.reflect )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			var
				zone =
					this.zone,

				fontsize =
					this.sub.doc.font.size;

			if(
				!this.tree.twig.pnw.equals( zone.pnw )
			)
			{
				shell.peer.setPNW(
					this.path,
					zone.pnw
				);
			}

			if( fontsize !== this.tree.twig.fontsize )
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
			vzone =
				this.view.rect( this.zone ),

			f =
				Euclid.Fabric.create(
					'width',
						vzone.width,
					'height',
						vzone.height
				),

			doc =
				this.sub.doc,

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


} )( );
