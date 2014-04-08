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
				hover :
					{
						comment :
							'node currently hovered upon',
						type :
							'Path',
						assign :
							null,
						defaultValue :
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
						assign :
							null,
						defaultValue :
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
			[ ],
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
	function( )
{
	var
		doc,
		docPath,
		twig =
			this.tree.twig;

	this.fontsize =
		twig.fontsize;

	this.pnw =
		twig.pnw;

	this.sub =
		{ };

	docPath =
		// FIXME not if inherited
		this.path.append( 'doc' );

	doc =
	this.sub.doc =
		this.tree.twig.doc.create(
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

	var
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
