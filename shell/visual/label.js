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
	Action,
	config,
	Euclid,
	fontPool,
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


if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var Label =
Visual.Label =
	function(
		overload,
		inherit,
		a1,   // twig  -  p1
		a2    // path  -  p2
	)
{
	switch( overload )
	{
		case 'twig' :

			var
				twig =
					a1,

				path =
					a2;

			Visual.DocItem.call(
				this,
				'twig',
				inherit,
				twig,
				path
			);

			this.pnw =
				twig.pnw;

			break;

		case 'p1p2' :

			var
				p1 =
					a1,

				p2 =
					a2;

			var
				dy =
					Math.abs( p1.y - p2.y ),

				ny =
					Math.min( p1.y , p2.y ),

				fontsize =
					Math.max(
						dy / ( 1 + theme.bottombox ),
						theme.label.minSize
					),

				font =
					fontPool.get(
						fontsize,
						'la'
					),

				flow =
					Visual.Para.s_getFlow(
						font,
						0,
						'Label'
					),

				height =
					flow.height +
					Math.round(
						font.size * theme.bottombox
					);

			Visual.DocItem.call(
				this,
				'phrase',
				null,
				'Label',
				fontsize
			);


			if( p2.x > p1.x )
			{
				this.pnw =
					new Euclid.Point(
						p1.x,
					ny
				);
			}
			else
			{
				this.pnw =
					new Euclid.Point(
						p1.x - flow.spread,
						ny
					);
			}

			var zone =
				new Euclid.Rect(
					'pnw/size',
					this.pnw,
					flow.spread,
					height
				);

			break;

		default :

			throw new Error(
				'invalid overload'
			);
	}
};


Jools.subclass(
	Label,
	Visual.DocItem
);


/*
| Draws a transitory label
| ( A label in the making )
*/
/*
Label.s_drawTrans =
	function(
		fabric,    // the fabric to draw upon
		view,      // the current view
		transLabel // the transLabel to draw
	)
{
	var
		zone =
			transLabel.zone,

		silhoutte =
			Label.s_getSilhoutte( zone );

	// draws selection and text
	var f =
		Visual.Para.s_draw(
			zone.width,
			zone.height,
			view.zoom,
			transLabel.font,
			transLabel.flow
		);

	fabric.drawImage(
		'image',
			f,
		'pnw',
			view.point( zone.pnw )
	);

	// draws the border
	fabric.edge(
		Style.getStyle(
			theme.label.style,
			'normal'
		),
		silhoutte,
		'sketch',
		view
	);
};
*/


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
			ne : true,
			se : true,
			sw : true,
			nw : true
		}
	);


/*
| Highlights the label.
*/
Label.prototype.highlight =
	function(
		fabric,
		view
	)
{
	var silhoutte =
		this.getSilhoutte(
			this.getZone( )
		);

	fabric.edge(
		Style.getStyle(
			theme.label.style,
			'highlight'
		),
		silhoutte,
		'sketch',
		view
	);
};


/*
| Returns the labels silhoutte.
*/
Label.prototype.getSilhoutte =
	function(
		zone
	)
{
	var s =
		this._$silhoutte;

	if(
		s &&
		s.pnw.eq( zone.pnw ) &&
		s.pse.x === zone.pse.x - 1 &&
		s.pse.y === zone.pse.y - 1
	)
	{
		return s;
	}


	s =
	this._$silhoutte =
		new Euclid.Rect(
			'pnw/pse',
			zone.pnw,
			zone.pse.sub( 1, 1 )
		);

	return s;
};


/*
| Returns the items silhoutte anchored at zero.
*/
Label.prototype.getZeroSilhoutte =
	function(
		zone
	)
{
	var s =
		this._$zeroSilhoutte;

	if(
		s &&
		s.width  === zone.width  - 1 &&
		s.height === zone.height - 1
	)
	{
		return s;
	}

	s =
	this._$zeroSilhoutte =
		new Euclid.Rect(
			'pse',
			new Euclid.Point(
				zone.width  - 1,
				zone.height - 1
			)
		);

	return s;
};


/*
| Sets the items position and size aften an action.
*/
Label.prototype.dragStop =
	function(
		view,
		p
	)
{
	var action =
		shell.bridge.action( );

	switch( action.type )
	{
		case 'ItemDrag' :
		case 'ItemResize' :

			var
				zone =
					this.getZone( ),

				fontsize =
					this.$sub.doc.getFont( this ).size;

			if( !this.twig.pnw.eq( zone.pnw ) )
			{
				shell.peer.setPNW(
					this.path,
					zone.pnw
				);
			}

			if( fontsize !== this.twig.fontsize )
			{
				shell.peer.setFontSize(
					this.path,
					fontsize
				);
			}

			shell.redraw = true;

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
| Draws the label.
|
| FIXME: move the common stuff into Visual.Item.draw()
|        and make the specific into weave()
*/
Label.prototype.draw =
	function(
		fabric,
		caret,
		view
	)
{
	var f =
		this.$fabric;

	var zone =
		view.rect( this.getZone( ) );

	// no buffer hit?
	if (
		config.debug.noCache ||
		!f ||
		zone.width  !== f.width ||
		zone.height !== f.height ||
		view.zoom !== f.$zoom
	)
	{
		f =
		this.$fabric =
			new Euclid.Fabric(
				zone.width,
				zone.height
			);

		f.$zoom =
			view.zoom;

		var
			doc =
				this.$sub.doc,

			imargin =
				this.innerMargin,

			silhoutte =
				this.getZeroSilhoutte( zone );

		// draws selection and text
		doc.draw(
			f,
			view.home( ),
			this,
			zone.width,
			Euclid.Point.zero
		);

		// draws the border
		f.edge(
			Style.getStyle(
				theme.label.style,
				'normal'
			),
			silhoutte,
			'sketch',
			Euclid.View.proper
		);
	}

	var action =
		shell.bridge.action( );

	if(
		action &&
		action.type === 'Remove' &&
		action.removeItemFade &&
		this.path.equals( action.removeItemPath )
	)
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				zone.pnw,
			'alpha',
				theme.removeAlpha
		);
	}
	else
	{
		fabric.drawImage(
			'image',
				f,
			'pnw',
				zone.pnw
		);
	}
};


/*
| Calculates the change of fontsize due to resizing.
*/
Label.prototype.fontSizeChange =
	function( fontsize )
{
	var action =
		shell.bridge.action( );

	if(
		!action ||
		!this.path ||
		!this.path.equals( action.itemPath )
	)
	{
		return fontsize;
	}

	switch( action.type )
	{
		case 'ItemResize' :

			if( !action.startZone )
			{
				return fontsize;
			}

			var
				height =
					action.startZone.height,

				dy;

			switch( action.align )
			{
				case 'ne' :
				case 'nw' :

					dy =
						action.start.y - action.move.y;

					break;

				case 'se' :
				case 'sw' :

					dy =
						action.move.y - action.start.y;

					break;

				default :

					throw new Error(
						'unknown align: '+ action.align
					);
			}

			return Math.max(
				fontsize * ( height + dy ) / height,
				theme.label.minSize
			);

		default:

			return fontsize;
	}

	return Math.max( fontsize, 4 );
};


/*
| Returns the width for the contents flow.
*/
Label.prototype.getFlowWidth =
	function( )
{
	return 0;
};


/*
| Returns the para seperation height.
*/
Label.prototype.getParaSep =
	function(
		// fontsize
	)
{
	return 0;
};


/*
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Label.prototype.getZone =
	function( )
{
	var
		action =
			shell.bridge.action( ),

		pnw =
			this.pnw,

		// FIXME Caching!
		doc =
			this.$sub.doc,

		fontsize =
			doc.getFont( this ).size,

		width =
			Math.max(
				Math.ceil(
					doc.getSpread( this )
				),
				Math.round( fontsize * 0.3 )
			),

		height =
			Math.max(
				Math.ceil( doc.getHeight( this ) ),
				Math.round( fontsize )
			);

	if(
		!action ||
		!this.path ||
		!this.path.equals( action.itemPath )
	)
	{
		return new Euclid.Rect(
			'pnw/size',
			pnw,
			width,
			height
		);
	}

	// FIXME cache the last zone

	switch( action.type )
	{
		case 'ItemDrag' :

			pnw =
				pnw.add(
					action.move.x - action.start.x,
					action.move.y - action.start.y
				);

			break;

		case 'ItemResize' :

			// resizing is done by fontSizeChange( )
			var szone =
				action.startZone;

			if( !szone )
			{
				break;
			}

			switch( action.align )
			{
				case 'ne' :

					pnw =
						pnw.add(
							0,
							szone.height - height
						);

					break;

				case 'se' :

					break;

				case 'sw' :

					pnw =
						pnw.add(
							szone.width - width,
							0
						);

					break;

				case 'nw' :

					pnw =
						pnw.add(
							szone.width - width,
							szone.height - height
						);

					break;

				default :

					throw new Error( 'unknown align' );
			}

			break;
	}

	return (
		new Euclid.Rect(
			'pnw/size',
			pnw,
			width,
			height
		)
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
Label.prototype.scrollCaretIntoView =
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
