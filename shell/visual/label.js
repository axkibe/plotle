/*
| An item with resizing text.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual =
	Visual || {};


/*
| Imports
*/
var Action;
var config;
var Euclid;
var fontPool;
var Jools;
var shell;
var theme;
var Visual;


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
		spacename,
		twig,
		path
	)
{
	Visual.DocItem.call(
		this,
		spacename,
		twig,
		path
	);
};


Jools.subclass(
	Label,
	Visual.DocItem
);


/*
| Default margin for all labels.
*/
Label.s_innerMargin =
	new Euclid.Margin(
		theme.label.innerMargin
	);


/*
| Resize handles to show on labels
*/
Label.s_handles =
	Jools.immute(
		{
			ne : true,
			se : true,
			sw : true,
			nw : true
		}
	);


/*
| Returns the labels silhoutte.
*/
Label.s_getSilhoutte =
	function( zone )
{
	return new Euclid.Rect(
		'pnw/pse',
		zone.pnw,
		zone.pse.sub( 1, 1 )
	);
};



/*
| Draws a transitory label
| ( A label in the making )
*/
Label.s_drawTrans =
	function(
		fabric,    // the fabric to draw upon
		view,      // the current view
		transLabel // the transLabel to draw
	)
{
	var zone =
		transLabel.zone;

	var silhoutte =
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
		theme.label.style.edge,
		silhoutte,
		'sketch',
		view
	);
};


/*
| Creates and returns a transient label.
*/
Label.s_createTrans =
	function(
		p1,
		p2
	)
{
	var dy =
		Math.abs( p1.y - p2.y );

	var ny =
		Math.min( p1.y , p2.y );

	var fs =
		Math.max(
			dy / ( 1 + theme.bottombox ),
			theme.label.minSize
		);

	var font =
		fontPool.get(
			fs,
			'la'
		);

	var flow =
		Visual.Para.s_getFlow(
			font,
			0,
			'Label'
		);

	var height =
		flow.height +
		Math.round(
			font.size * theme.bottombox
		);

	var pnw;

	if( p2.x > p1.x )
	{
		pnw =
			new Euclid.Point(
				p1.x,
				ny
			);
	}
	else
	{
		pnw =
			new Euclid.Point(
				p1.x - flow.spread,
				ny
			);
	}

	var zone =
		new Euclid.Rect(
			'pnw/size',
			pnw,
			flow.spread,
			height
		);

	return Jools.immute(
		{
			font :
				font,

			flow :
				flow,

			pnw :
				pnw,

			zone :
				zone
		}
	);
};


/*
| Default margin for all labels.
*/
Label.prototype.innerMargin =
	Label.s_innerMargin;


/*
| Resize handles to show on labels
*/
Label.prototype.handles =
	Label.s_handles;


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


/*
| Draws the label.
|
| FIXME: move the common stuff into Visual.Item.draw()
|        and make the specific into weave()
*/
Label.prototype.draw =
	function(
		fabric,
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

		var doc =
			this.$sub.doc;

		var imargin =
			this.innerMargin;

		var silhoutte =
			this.getZeroSilhoutte( zone );

		// draws selection and text
		doc.draw(
			f,
			view.home( ),
			zone.width,
			imargin,
			Euclid.Point.zero
		);

		// draws the border
		f.edge(
			theme.label.style.edge,
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
| Returns the width for the contents flow.
*/
Label.prototype.getFlowWidth =
	function( )
{
	return 0;
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

			var height =
				action.startZone.height;

			var dy;

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
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
*/
Label.prototype.getZone =
	function( )
{
	var action =
		shell.bridge.action( );

	var pnw =
		this.twig.pnw;

	// FIXME Caching!
	var doc =
		this.$sub.doc;

	var fs =
		doc.getFont( ).size;

	var width  = Math.max(
		Math.ceil( doc.getSpread( ) ),
		Math.round( fs * 0.3 )
	);

	var height = Math.max(
		Math.ceil( doc.getHeight( ) ),
		Math.round( fs )
	);

	if(
		!action ||
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

			var mx =
				action.move.x - action.start.x;

			var my =
				action.move.y - action.start.y;

			return new Euclid.Rect(
				'pnw/size',
				pnw.add( mx, my ),
				width,
				height
			);

		case 'ItemResize' :

			// resizing is done by fontSizeChange( )
			var szone =
				action.startZone;

			if( !szone )
			{
				return new Euclid.Rect(
					'pnw/size',
					pnw,
					width,
					height
				);
			}

			switch( action.align )
			{
				case 'ne' :

					pnw = pnw.add(
						0,
						szone.height - height
					);

					break;

				case 'se' :

					break;

				case 'sw' :

					pnw = pnw.add(
						szone.width - width,
						0
					);

					break;

				case 'nw' :

					pnw = pnw.add(
						szone.width - width,
						szone.height - height
					);

					break;

				default :

					throw new Error( 'unknown align' );
			}

			return new Euclid.Rect(
				'pnw/size',
				pnw,
				width,
				height
			);

		default :

			return new Euclid.Rect(
				'pnw/size',
				pnw,
				width,
				height
			);
	}
	// TODO pull the Rect creation out
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

			var zone =
				this.getZone( );

			var fontsize =
				this.$sub.doc.getFont( ).size;

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


} )( );
