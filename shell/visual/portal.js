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
var Path;
var Portal;
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
var Portal =
Visual.Portal =
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

	// Paths to spaceUser and spaceTag
	this._spacePath =
		Jools.immute({

			spaceUser :
				new Path(
					this.path,
					'++',
					'spaceUser'
				),

			spaceTag :
				new Path(
					this.path,
					'++',
					'spaceTag'
				)
		});
};


Jools.subclass(
	Portal,
	Visual.Item
);


/*
| Resizing handles.
*/
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
		zone.width < minWidth ||
		zone.height < minHeight
	)
	{
		return new Euclid.Rect(
			'pnw/size',
			zone.pnw,
			Math.max(
				minWidth,
				zone.width
			),
			Math.max(
				minHeight,
				zone.height
			)
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

	s =
	this._$silhoutte =
		Portal.s_getSilhoutte( zone );

	return s;
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
	var zs =
	this._$zeroSilhoutte =
		Portal.s_getZeroSilhoutte( zone );

	return zs;
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
	var
		space =
			shell.$space;

	// already have focus?
	if( space.focusedItem( ) === this )
	{
		return;
	}

	var
		caret =
			space.setCaret(
				{
					path :
						this._spacePath.spaceUser,

					at1 :
						0
				}
			);

	caret.show( );

	shell.peer.moveToTop(
		this.path
	);
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

	// TODO
	var caret =
		shell.$space.setCaret(
			{
				path :
					this._spacePath.spaceUser,

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
			this._weave(
				zone,
				vzone,
				view.home( )
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
				vzone.pnw,
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
				vzone.pnw
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
| Draws the caret if its in this portal.
*/
Portal.prototype.positionCaret =
	function(
		view
	)
{
	var
		caret =
			shell.$space.$caret,

		section =
			caret.sign.path.get( -1 ),

		cpos =
			caret.$pos =
			this.getCaretPos( ),

		pnw =
			this.getZone( ).pnw,

		fieldPNW =
			this[ '_$' + section ].pnw;

	caret.$screenPos =
		view.point(
			cpos.x + pnw.x,
			cpos.n + pnw.y
		).add( fieldPNW );

	caret.$height =
		Math.round(
			( cpos.s - cpos.n ) * view.zoom
		);
};


/*
| User is hovering his/her pointing device around.
|
| Checks if this item reacts on this.
*/
Portal.prototype.pointingHover =
	function(
		view,
		p
	)
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
	function(
		zone,
		vzone,
		view
	)
{
	var f =
	this.$fabric =
		new Euclid.Fabric(
			vzone.width + 1,
			vzone.height + 1
		);

	var twig =
		this.twig;

	var silhoutte =
		this.getZeroSilhoutte( vzone );

	f.paint(
		theme.portal.style,
		silhoutte,
		'sketch',
		Euclid.View.proper
	);

	f.clip(
		silhoutte,
		'sketch',
		Euclid.View.proper,
		0
	);

	var spaceUser =
	this._$spaceUser =
		this._prepareField(
			'spaceUser',
			vzone,
			view,
			null
		);

	var spaceTag =
	this._$spaceTag =
		this._prepareField(
			'spaceTag',
			vzone,
			view,
			spaceUser.pnw
		);

	f.edge(
		theme.portal.input.edge,
		spaceUser.box,
		'sketch',
		Euclid.View.proper
	);

	f.edge(
		theme.portal.input.edge,
		spaceTag.box,
		'sketch',
		Euclid.View.proper
	);

	f.scale( view.zoom );

	f.paintText(
		'text',
			spaceUser.text,
		'p',
			view.depoint( spaceUser.pnw ),
		'font',
			this._spaceFont.spaceUser
	);

	f.paintText(
		'text',
			spaceTag.text,
		'p',
			view.depoint( spaceTag.pnw ),
		'font',
			this._spaceFont.spaceTag
	);

	f.scale( 1 / view.zoom );

	// redraws the edge on the end to top
	// everything else

	f.edge(
		theme.portal.style.edge,
		silhoutte,
		'sketch',
		Euclid.View.proper
	);

	return f;
};


/*
| Text has been inputed.
*/
Portal.prototype.input =
	function(
		text
	)
{
    var
		reg  =
			/([^\n]+)(\n?)/g,

		// TODO, how about handing the caret as param to input?
		caret =
			shell.$space.$caret,

		section =
			caret.sign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	// ignores newlines
    for(
		var rx = reg.exec(text);
		rx !== null;
		rx = reg.exec( text )
	)
	{
		var line = rx[ 1 ];

		shell.peer.insertText(
			this._spacePath[ section ],
			caret.sign.at1,
			line
		);
	}
};


/*
| Font for spacesUser/Tag
*/
Portal.prototype._spaceFont =
	Jools.immute( {
		spaceUser :
			fontPool.get(
				13,
				'la'
			),

		spaceTag :
			fontPool.get(
				13,
				'la'
			)
	} );


/*
| Returns the caret position.
|
| FIXME remove?
| FIXME private?
*/
Portal.prototype.getCaretPos =
	function( )
{
	var
		// TODO hand down caret.
		caret =
			shell.$space.$caret,

		section =
			caret.sign.path.get( -1 ),

		fs =
			this._spaceFont[ section ].size,

		descend =
			fs * theme.bottombox,

		p =
			this._locateOffset(
				section,
				caret.sign.at1
			),

		s =
			Math.round( p.y + descend ),

		n =
			s - Math.round( fs + descend ),

		x =
			p.x - 1;

	return Jools.immute(
		{
			s :
				s,
			n :
				n,
			x :
				x
		}
	);
};


/*
| Returns the point of a given offset.
|
| FIXME change to multireturn.
*/
Portal.prototype._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset    // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		twig =
			this.twig,

		font =
			this._spaceFont[ section ],

		text =
			this.twig[ section ];

	return new Euclid.Point(
		Math.round(
			Euclid.Measure.width(
				font,
				text.substring(
					0,
					offset
				)
			)
		),
		0
	);
};


/*
| User pressed a special key.
*/
Portal.prototype.specialKey =
	function( key )
{
	var poke =
		false;

	switch( key )
	{
		case 'backspace' :

			poke =
				this.keyBackspace( );

			break;
/*

		case 'del' :

			poke =
				this.keyDel( );

			break;
*/

		case 'down' :

			poke =
				this.keyDown( );

			break;

		case 'end' :

			poke =
				this.keyEnd( );

			break;

/*
		case 'enter' :

			poke =
				this.keyEnter( );

			break;
*/

		case 'left' :

			poke =
				this.keyLeft( );

			break;

		case 'pos1' :

			poke =
				this.keyPos1( );

			break;

		case 'right' :

			poke =
				this.keyRight( );

			break;

		case 'up' :

			poke =
				this.keyUp( );

			break;
	}

	if( poke )
	{
		this.poke( );
	}
};

/*
| User pressed right key.
*/
Portal.prototype.keyLeft =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	if( csign.at1 === 0 )
	{
		return false;
	}

	shell.$space.setCaret(
		{
			path :
				csign.path,
			at1 :
				csign.at1 - 1
		}
	);

	return true;
};

/*
| User pressed down key.
*/
Portal.prototype.keyDown =
	function( )
{
	var
		caret =
			shell.$space.$caret,

		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	switch( section )
	{
		case 'spaceUser' :

			shell.$space.setCaret(
				{
					path :
						new Path(
							csign.path,
							csign.path.length - 1,
								'spaceTag'
							),

					at1 :
						0
				}
			);

			break;
	}


	return true;
};


/*
| User pressed down key.
*/
Portal.prototype.keyUp =
	function( )
{
	var
		caret =
			shell.$space.$caret,

		csign =
			caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	switch( section )
	{
		case 'spaceTag' :

			shell.$space.setCaret(
				{
					path :
						new Path(
							csign.path,
							csign.path.length - 1,
								'spaceUser'
							),

					at1 :
						0
				}
			);

			break;
	}


	return true;
};

/*
| User pressed right key.
*/
Portal.prototype.keyRight =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	var section =
		csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	var value =
		this.twig[ section ];

	if( csign.at1 >= value.length )
	{
		return false;
	}

	shell.$space.setCaret(
		{
			path :
				csign.path,

			at1 :
				csign.at1 + 1
		}
	);

	return true;
};


/*
| User pressed backspace.
*/
Portal.prototype.keyBackspace =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	var section =
		csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	var at1 =
		csign.at1;

	if( at1 <= 0 )
	{
		return false;
	}

	shell.peer.removeText(
		this._spacePath.spaceUser,
		at1 - 1,
		1
	);

	return true;
};

/*
| User pressed end key.
*/
Portal.prototype.keyEnd =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	var section =
		csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}

	// AAAA

	var at1 =
		csign.at1;

	var value =
		this.twig.spaceUser;

	if( at1 >= value.length )
	{
		return false;
	}

	shell.$space.setCaret(
		{
			path :
				csign.path,

			at1 :
				value.length
		}
	);

	return true;
};


/*
| Returns true if section is a section.
*/
Portal.prototype._isSection =
	function(
		section
	)
{
	switch( section )
	{
		case 'spaceUser' :
		case 'spaceTag' :

			return true;

		default :

			return false;

	}
}


/*
| Prepares an input field ( user / tag )
*/
Portal.prototype._prepareField =
	function(
		section,
		vzone,
		view,
		basePNW
	)
{
	var pitch =
		Math.round(
			5 * view.zoom
		);

	var round =
		Math.round(
			3 * view.zoom
		);

	var text =
		this.twig[ section ];

	var width =
		Math.round(
			Euclid.Measure.width(
				this._spaceFont[ section ],
				text
			)
			*
			view.zoom
		);

	var height =
		Math.round(
			( this._spaceFont[ section ].size + 2 )
			*
			view.zoom
		);

	var pnw =
		basePNW === null
		?
		(
			new Euclid.Point(
				Jools.half(
					vzone.width - width
				),
				Math.round(
					vzone.height / 3
				)
			)
		)
		:
		(
			new Euclid.Point(
				Jools.half(
					vzone.width - width
				),
				basePNW.y + Math.round( 23 * view.zoom )
			)
		);

	var box =
		new Euclid.RoundRect(
			pnw.sub(
				pitch,
				height
			),
			pnw.add(
				width + pitch,
				pitch
			),
			round,
			round
		);

	return {
		text :
			text,

		width :
			width,

		height :
			height,

		pnw :
			pnw,

		box :
			box
	};
};


/*
| User pressed pos1 key
*/
Portal.prototype.keyPos1 =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	if( csign.at1 <= 0 )
	{
		return false;
	}

	shell.$space.setCaret(
		{
			path :
				csign.path,

			at1 :
				0
		}
	);

	return true;
};


} )( );
