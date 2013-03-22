/*
| A portal to another space
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
var fontPool;
var Euclid;
var Jools;
var shell;
var theme;


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
var Portal = Visual.Portal =
	function(
		spacename,
		twig,
		path
	)
{
	Visual.Item.call(
		this,
		spacename,
		twig,
		path
	);
};


Jools.subclass(
	Portal,
	Visual.Item
);


Portal.s_handles =
	Jools.immute(
		{
			n  : true,
			ne : true,
			e  : true,
			se : true,
			s  : true,
			sw : true,
			w  : true,
			nw : true
		}
	);



/*
| Resize handles to show on portals.
*/
Portal.prototype.handles =
	Portal.s_handles;


/*
| Gets the zone for a transient portal
*/
Portal.s_getZone =
	function(
		p1,
		p2
	)
{
	var zone =
		new Euclid.Rect(
			'arbitrary',
			p1,
			p2
		);

	var minWidth =
		theme.portal.minWidth;

	var minHeight =
		theme.portal.minHeight;

	if(
		zone.width  < minWidth ||
		zone.height < minHeight
	)
	{
		return new Euclid.Rect(
			'pnw/size',
			zone.pnw,
			Math.max( minWidth,  zone.width  ),
			Math.max( minHeight, zone.height )
		);
	}
	else
	{
		return zone;
	}
};


/*
| Draws a transitory portal
| ( A portal in the making )
*/
Portal.s_drawTrans =
	function(
		fabric,
		view,
		zone
	)
{
	var silhoutte =
		Portal.s_getSilhoutte( zone );

	fabric.fill(
		theme.portal.style.fill,
		silhoutte,
		'sketch',
		view
	);

	fabric.edge(
		theme.portal.style.edge,
		silhoutte,
		'sketch',
		view
	);
};


/*
| Returns the portals silhoutte anchored at zero.
*/
Portal.s_getZeroSilhoutte =
	function(
		zone //  the portals zone
	)
{
	return new Euclid.Ellipse(
		Euclid.Point.zero,
		new Euclid.Point(
			zone.width,
			zone.height
		)
	);
};


/*
| Returns the portals silhoutte.
*/
Portal.s_getSilhoutte =
	function(
		zone //  the portals zone
	)
{
	return new Euclid.Ellipse(
		zone.pnw,
		zone.pse
	);
};


/*
| Returns the portals silhoutte.
*/
Portal.prototype.getSilhoutte =
	function(
		zone //  the portals zone
	)
{
	// checks for a cache hit
	var s = this._$silhoutte;

	if(
		s &&
		s.eq( zone )
	)
	{
		return s;
	}

	// otherwise creates a new silhoutte

	return this._$silhoutte = Portal.s_getSilhoutte( zone );
};


/*
| Returns the portals silhoutte.
*/
Portal.prototype.getZeroSilhoutte =
	function(
		zone    // the cache for the items zone
	)
{
	// checks for cache hit
	var s = this._$zeroSilhoutte;

	if(
		s &&
		s.width  === zone.width &&
		s.height === zone.height
	)
	{
		return s;
	}

	// if not creates a new silhoutte
	return this._$zeroSilhoutte = Portal.s_getZeroSilhoutte( zone );
};



/*
| Sets the items position and size after an action.
*/
Portal.prototype.dragStop =
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

			if(
				zone.width < theme.portal.minWidth ||
				zone.height < theme.portal.minHeight
			)
			{
				throw new Error( 'Portal under minimum size!' );
			}

			if( this.twig.zone.eq( zone ) )
			{
				return;
			}

			shell.peer.setZone(
				this.path,
				zone
			);

			shell.redraw =
				true;

			return true;

		default :

			return Visual.Item.prototype.dragStop.call(
				this,
				view,
				p
			);
	}

};


/*
| Sets the focus to this item.
*/
Portal.prototype.grepFocus =
	function( )
{
	var space =
		shell.$space;

	// already have focus?
	if( space.focusedItem( ) === this )
	{
		return;
	}

	var caret = space.setCaret(
		{
			path :
				this.path,
			at1 :
				0
		}
	);

	caret.show( );

	shell.peer.moveToTop( this.path );
};



/*
| Sees if this portal is being clicked.
*/
Portal.prototype.click =
	function(
		view,
		p
	)
{
	if(
		!this.getZone( )
			.within(
				view,
				p
			)
		)
	{
		return false;
	}

	var space =
		shell.$space;

	var focus =
		space.focusedItem( );

	if( focus !== this )
	{
		this.grepFocus( );

		// TODO double deselect below?

		shell.deselect( );
	}

	shell.redraw =
		true;

	var caret = shell.$space.setCaret(
		{
			path :
				this.path,

			at1  :
				null
		}
	);

	caret.show( );

	shell.deselect( );

	return true;
};

/*
| Draws the portal.
|
| TODO move draw to visual item.
*/
Portal.prototype.draw =
	function(
		fabric,
		view
	)
{
	var zone =
		this.getZone( );

	var vzone =
		view.rect( zone );

	var f =
		this.$fabric;

	// no buffer hit?
	if (
		config.debug.noCache ||
		!f ||
		vzone.width !== f.width ||
		vzone.height !== f.height
	)
	{
		f =
			this._weave( vzone );
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
			'image', f,
			'pnw', vzone.pnw,
			'alpha', theme.removeAlpha
		);
	}
	else
	{
		fabric.drawImage(
			'image', f,
			'pnw', vzone.pnw
		);
	}
};


/*
| Mouse wheel turned.
*/
Portal.prototype.mousewheel =
	function(
		view,
		p
		// dir,
		// shift,
		// ctrl
	)
{
	return (
		this.getZone().within(
			view,
			p
		)
	);
};


/*
|
*/
Portal.prototype.positionCaret =
	function(
		// view
	)
{
	// FIXME
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
Portal.prototype.pointingHover = function( view, p )
{
	if( p === null )
	{
		return null;
	}

	if(
		this.getZone( )
			.within(
				view,
				p
			)
		)
	{
		return 'default';
	}

	return null;
};


/*
| Returns the zone of the item.
| An ongoing action can modify this to be different than meshmashine data.
|
| TODO move to Visual.Item
*/
Portal.prototype.getZone =
	function( )
{
	var twig =
		this.twig;

	var action =
		shell.bridge.action( );

	var max =
		Math.max;

	var min =
		Math.min;

	if(
		!action ||
		!this.path.equals( action.itemPath )
	)
	{
		return twig.zone;
	}

	// FIXME cache the last zone

	switch( action.type )
	{

		case 'ItemDrag' :

			return twig.zone.add(
				action.move.x - action.start.x,
				action.move.y - action.start.y
			);

		case 'ItemResize' :

			var szone =
				action.startZone;

			if( !szone )
			{
				return twig.zone;
			}

			var spnw = szone.pnw;
			var spse = szone.pse;
			var dx = action.move.x - action.start.x;
			var dy = action.move.y - action.start.y;
			var minw = theme.portal.minWidth;
			var minh = theme.portal.minHeight;
			var pnw, pse;

			switch( action.align )
			{

				case 'n'  :

					pnw =
						Euclid.Point.renew(
							spnw.x,
							min( spnw.y + dy, spse.y - minh ),
							spnw,
							spse
						);

					pse =
						spse;

					break;

				case 'ne' :

					pnw =
						Euclid.Point.renew(
							spnw.x,
							min( spnw.y + dy, spse.y - minh ),
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							max( spse.x + dx, spnw.x + minw ),
							spse.y,
							spnw,
							spse
						);
					break;

				case 'e'  :

					pnw =
						spnw;

					pse =
						Euclid.Point.renew(
							max( spse.x + dx, spnw.x + minw ),
							spse.y,
							spnw,
							spse
						);

					break;

				case 'se' :

					pnw =
						spnw;

					pse =
						Euclid.Point.renew(
							max( spse.x + dx, spnw.x + minw ),
							max( spse.y + dy, spnw.y + minh ),
							spnw,
							spse
						);

					break;

				case 's' :

					pnw =
						spnw;

					pse =
						Euclid.Point.renew(
							spse.x,
							max( spse.y + dy, spnw.y + minh ),
							spnw,
							spse
						);

					break;

				case 'sw'  :

					pnw =
						Euclid.Point.renew(
							min( spnw.x + dx, spse.x - minw ),
							spnw.y,
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							spse.x,
							max( spse.y + dy, spnw.y + minh ),
							spnw,
							spse
						);

					break;

				case 'w'   :
					pnw =
						Euclid.Point.renew(
							min( spnw.x + dx, spse.x - minw ),
							spnw.y,
							spnw,
							spse
						);

					pse =
						spse;

					break;

				case 'nw' :
					pnw =
						Euclid.Point.renew(
							min( spnw.x + dx, spse.x - minw ),
							min( spnw.y + dy, spse.y - minh ),
							spnw,
							spse
						);

					pse =
						spse;

					break;

				//case 'c' :
				default  :
					throw new Error('unknown align');
			}

			return new Euclid.Rect( 'pnw/pse', pnw, pse );

		default :

			return twig.zone;
	}
};


/*
| Returns the fabric for the input field.
*/
Portal.prototype._weave =
	function( vzone )
{
	var f =
	this.$fabric =
		new Euclid.Fabric(
			vzone.width + 1,
			vzone.height + 1
		);

	var silhoutte =
		this.getZeroSilhoutte( vzone );

	f.fill(
		theme.portal.style.fill,
		silhoutte,
		'sketch',
		Euclid.View.proper
	);

	var font =
		fontPool.get( 13, 'la' );

	var usertext =
		'meshcraft';

	var userwidth =
		Euclid.Measure.width( font, usertext  );

	var upnw =
		new Euclid.Point(
			Jools.half( vzone.width - userwidth ),
			Math.round( vzone.height / 3 )
		);

	//var userrect  = new Euclid.RoundRect(
	//Math.round( vzone.height / 3 );

	var spacetext =
		'sandbox';

	var spacewidth =
		Euclid.Measure.width( font, spacetext );

	var spnw =
		new Euclid.Point(
			Jools.half( vzone.width - spacewidth ),
			upnw.y + 20
		);

	f.paintText(
		'text',
			usertext,
		'p',
			upnw,
		'font',
			font
	);

	f.paintText(
		'text',
			spacetext,
		'p',
			spnw,
		'font',
			font
	);

	f.edge(
		theme.portal.style.edge,
		silhoutte,
		'sketch',
		Euclid.View.proper
	);

	return f;
};

} )( );
