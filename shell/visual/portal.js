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
	Visual || { };


/*
| Imports
*/
var
	Accent,
	Action,
	config,
	fontPool,
	Euclid,
	Jools,
	Path,
	Portal,
	shell,
	Style,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


if( typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor.
*/
var Portal =
Visual.Portal =
	function(
		twig,
		path
	)
{
	Visual.Item.call(
		this,
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

	// the prepared space fields
	this._$spaceFields =
		{
			spaceUser :
				null,

			spaceTag :
				null
		};

	this._$hover =
		null;
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
			n :
				true,

			ne :
				true,

			e :
				true,

			se :
				true,

			s :
				true,

			sw :
				true,

			w :
				true,

			nw :
				true
		}
	);


/*
| List of all space fields of the portal
*/
Portal.spaceFields =
	Jools.immute(
		{
			spaceUser :
				true,

			spaceTag :
				true
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
	var
		silhoutte =
			Portal.s_getSilhoutte( zone );

	fabric.paint(
		theme.portal.style,
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
	var s =
		this._$silhoutte;

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
	var s =
		this._$zeroSilhoutte;

	if(
		s &&
		s.width === zone.width &&
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
		p,
		shift,
		ctrl,
		access
	)
{
	var
		zone =
			this.getZone( ),

		silhoutte =
			this.getSilhoutte( zone );

	// not clicked on the portal?
	if(
		!silhoutte
			.within(
				view,
				p
			)
		)
	{
		return false;
	}

	var
		space =
			shell.$space,

		focus =
			space.focusedItem( ),

		moveToButton =
			this._$moveToButton;

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	if(
		moveToButton.shape
			.within(
				Euclid.View.proper,
				pp
			)
	)
	{
		this._moveTo( );

		return true;
	}

	if( access != 'rw' )
	{
		return false;
	}

	if( focus !== this )
	{
		this.grepFocus( );

		// TODO double deselect below?
		shell.deselect( );
	}

	shell.redraw =
		true;

	var
		caret =
			null,

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	for( var field in Portal.spaceFields )
	{
		var sf =
			this._$spaceFields[ field ];

		if(
			sf.silhoutte
				.within(
					Euclid.View.proper,
					pp
				)
		)
		{
			caret =
				shell.$space.setCaret(
					{
						path :
							this._spacePath[ field ],

						at1  :
							this._getOffsetAt(
								field,
								pp.x
							)
					}
				);

			break;
		}
	}

	if( caret )
	{
		caret.show( );
	}

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
	var
		zone =
			this.getZone( ),

		vzone =
			view.rect( zone ),

		f =
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
	var
		zone =
			this.getZone( ),

		silhoutte =
			this.getSilhoutte( zone );

	return silhoutte.within(
		view,
		p
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
			caret.sign.path.get( -1 );

	if(
		!this._isSection( section ) ||
		section === 'moveToButton'
	)
	{
		caret.$screenPos =
		caret.$height =
			null;

		return;
	}

	var
		cpos =
			caret.$pos =
			this.getCaretPos( ),

		pnw =
			this.getZone( ).pnw,

		fieldPNW =
			this._$spaceFields[ section ].pnw;

	caret.$screenPos =
		view.point(
			cpos.x + pnw.x + fieldPNW.x,
			cpos.n + pnw.y + fieldPNW.y
		);

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

	var
		zone =
			this.getZone( ),

		silhoutte =
			this.getSilhoutte( zone );

	// not clicked on the portal?
	if(
		!silhoutte
			.within(
				view,
				p
			)
		)
	{
		this._setHover( null );

		return false;
	}

	var
		moveToButton =
			this._$moveToButton,

		pp =
			view
				.depoint( p )
				.sub( zone.pnw );

	if(
		moveToButton.shape
			.within(
				Euclid.View.proper,
				pp
			)
	)
	{
		this._setHover( 'moveToButton' );
	}
	else
	{
		this._setHover( null );
	}

	return 'default';
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
	var
		twig =
			this.twig,

		action =
			shell.bridge.action( );

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

			var
				spnw =
					szone.pnw,

				spse =
					szone.pse,

				dx =
					action.move.x - action.start.x,

				dy =
					action.move.y - action.start.y,

				minw =
					theme.portal.minWidth,

				minh =
					theme.portal.minHeight,

				pnw,
				pse;

			switch( action.align )
			{

				case 'n'  :

					pnw =
						Euclid.Point.renew(
							spnw.x,
							Math.min(
								spnw.y + dy,
								spse.y - minh
							),
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
							Math.min( spnw.y + dy, spse.y - minh ),
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							Math.max( spse.x + dx, spnw.x + minw ),
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
							Math.max( spse.x + dx, spnw.x + minw ),
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
							Math.max( spse.x + dx, spnw.x + minw ),
							Math.max( spse.y + dy, spnw.y + minh ),
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
							Math.max( spse.y + dy, spnw.y + minh ),
							spnw,
							spse
						);

					break;

				case 'sw'  :

					pnw =
						Euclid.Point.renew(
							Math.min( spnw.x + dx, spse.x - minw ),
							spnw.y,
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							spse.x,
							Math.max( spse.y + dy, spnw.y + minh ),
							spnw,
							spse
						);

					break;

				case 'w'   :
					pnw =
						Euclid.Point.renew(
							Math.min( spnw.x + dx, spse.x - minw ),
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
							Math.min( spnw.x + dx, spse.x - minw ),
							Math.min( spnw.y + dy, spse.y - minh ),
							spnw,
							spse
						);

					pse =
						spse;

					break;

				//case 'c' :
				default  :
					throw new Error(
						'unknown align'
					);
			}

			return (
				new Euclid.Rect(
					'pnw/pse',
					pnw,
					pse
				)
			);

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
	var
		f =
		this.$fabric =
			new Euclid.Fabric(
				vzone.width + 1,
				vzone.height + 1
			),

		silhoutte =
			this.getZeroSilhoutte( vzone ),

		caret =
			shell.$space.$caret,

		section =
			caret.sign && caret.sign.path.get( -1 );

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
	this._$spaceFields.spaceUser =
		this._prepareField(
			'spaceUser',
			zone,
			null
		);

	var spaceTag =
	this._$spaceFields.spaceTag =
		this._prepareField(
			'spaceTag',
			zone,
			spaceUser.pnw
		);

	var moveToButton =
	this._$moveToButton =
		this._prepareMoveToButton(
			zone
		);

	f.paint(
		Style.getStyle(
			theme.portal.moveTo.style,
			Accent.state(
				this._$hover === 'moveToButton',
				section === 'moveToButton'
			)
		),
		moveToButton.shape,
		'sketch',
		view
	);

	f.paint(
		Style.getStyle(
			theme.portal.input.style,
			'normal'
		),
		spaceUser.silhoutte,
		'sketch',
		view
	);

	f.paint(
		Style.getStyle(
			theme.portal.input.style,
			'normal'
		),
		spaceTag.silhoutte,
		'sketch',
		view
	);

	f.scale( view.zoom );

	f.paintText(
		'text',
			spaceUser.text,
		'p',
			spaceUser.pnw,
		'font',
			this._fonts.spaceUser
	);

	f.paintText(
		'text',
			spaceTag.text,
		'p',
			spaceTag.pnw,
		'font',
			this._fonts.spaceTag
	);

	f.paintText(
		'text',
			'move to',
		'p',
			moveToButton.textCenter,
		'font',
			this._fonts.moveTo
	);

	f.scale( 1 / view.zoom );

	// redraws the edge on the end to top
	// everything else

	f.edge(
		theme.portal.style,
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
Portal.prototype._fonts =
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
			),

		moveTo :
			fontPool.get(
				13,
				'cm'
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
			this._fonts[ section ].size,

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
*/
Portal.prototype._locateOffset =
	function(
		section,   // 'spaceUser' or 'spaceTag'
		offset    // the offset to get the point from.
	)
{
	// FIXME cache position
	var
		font =
			this._fonts[ section ],

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
	var show =
		false;

	switch( key )
	{
		case 'backspace' :

			show =
				this.keyBackspace( )
				||
				show;

			break;

		case 'del' :

			show =
				this.keyDel( )
				||
				show;

			break;

		case 'down' :

			show =
				this.keyDown( )
				||
				show;

			break;

		case 'end' :

			show =
				this.keyEnd( )
				||
				show;

			break;

/*
		case 'enter' :

			poke =
				this.keyEnter( )
				||
				show;

			break;
*/

		case 'left' :

			show =
				this.keyLeft( )
				||
				show;

			break;

		case 'pos1' :

			show =
				this.keyPos1( )
				||
				show;

			break;

		case 'right' :

			show =
				this.keyRight( )
				||
				show;

			break;

		case 'tab' :

			show =
				this.keyTab( )
				||
				show;

			break;

		case 'up' :

			show =
				this.keyUp( )
				||
				show;


			break;
	}

	if( show )
	{
		this.poke( );

		shell.$space.$caret.show( );

		shell.redraw =
			true;
	}
};

/*
| User pressed right key.
*/
Portal.prototype.keyLeft =
	function( )
{
	var
		csign =
			shell.$space.$caret.sign,

		section =
			csign.path.get( -1 );

	if( !this._isSection( section ) )
	{
		return false;
	}


	if( csign.at1 === 0 )
	{
		if( section === 'spaceTag' )
		{
			shell.$space.setCaret(
				{
					path :
						new Path(
							csign.path,
							csign.path.length - 1,
								'spaceUser'
							),
					at1 :
						this.twig.spaceUser.length
				}
			);

			return true;
		}

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

	var
		cpos =
			this.getCaretPos();

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
						this._getOffsetAt(
							'spaceTag',
							cpos.x +
								this._$spaceFields.spaceUser.pnw.x
						)
				}
			);

			break;
	}


	return true;
};


/*
| User pressed down key.
*/
Portal.prototype.keyTab =
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

	var
		cycle =
			null;

	switch( section )
	{
		case 'spaceUser' :

			cycle =
				'spaceTag';

			break;

		case 'spaceTag' :

			cycle =
				'moveToButton';

			break;

		case 'moveToButton' :

			cycle =
				'spaceUser';

			break;
	}

	shell.$space.setCaret(
		{
			path :
				new Path(
					csign.path,
					csign.path.length - 1,
						cycle
				),

			at1 :
				0
		}
	);

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

	var
		cpos =
			this.getCaretPos();

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
						this._getOffsetAt(
							'spaceUser',
							cpos.x +
								this._$spaceFields.spaceTag.pnw.x
						)
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
		if( section === 'spaceUser' )
		{
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

			return true;
		}

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
		this._spacePath[ section ],
		at1 - 1,
		1
	);

	return true;
};


/*
| User pressed del.
*/
Portal.prototype.keyDel =
	function( )
{
	var csign =
		shell.$space.$caret.sign;

	var section =
		csign.path.get( -1 );

	var value =
		this.twig[ section ];

	if( !this._isSection( section ) )
	{
		return false;
	}

	var at1 =
		csign.at1;

	if( at1 >= value.length )
	{
		return false;
	}

	shell.peer.removeText(
		this._spacePath[ section ],
		at1,
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

	var at1 =
		csign.at1;

	var value =
		this.twig[ section ];

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
		case 'moveToButton' :

			return true;

		default :

			return false;

	}
};


/*
| Prepares the moveto button
*/
Portal.prototype._prepareMoveToButton =
	function(
		zone
	)
{
	var
		width =
			theme.portal.moveTo.width,

		height =
			theme.portal.moveTo.height,

		rounding =
			theme.portal.moveTo.rounding,

		pnw =
			new Euclid.Point(
				Jools.half( zone.width - width ),
				Jools.half( zone.height ) + 10
			),

		pse =
			pnw.add(
				width,
				height
			);

	return {
		shape :
			new Euclid.RoundRect(
				pnw,
				pse,
				rounding,
				rounding
			),

		textCenter :
			new Euclid.Point(
				Jools.half(pnw.x + pse.x),
				Jools.half(pnw.y + pse.y)
			)
	};
};

/*
| Prepares an input field ( user / tag )
*/
Portal.prototype._prepareField =
	function(
		section,
		zone,
		basePNW
	)
{
	var
		pitch =
			theme.portal.input.pitch,

		rounding =
			theme.portal.input.rounding,

		text =
			this.twig[ section ],

		width =
			Euclid.Measure.width(
				this._fonts[ section ],
				text
			),

		height =
			this._fonts[ section ].size + 2,

		pnw =
			basePNW === null
			?
			(
				new Euclid.Point(
					Jools.half(
						zone.width - width
					),
					Math.round(
						Jools.half( zone.height ) - 30
					)
				)
			)
			:
			(
				new Euclid.Point(
					Jools.half(
						zone.width - width
					),
					basePNW.y + 23
				)
			),

		silhoutte =
			new Euclid.RoundRect(
				pnw.sub(
					pitch,
					height
				),
				pnw.add(
					Math.round( width ) + pitch,
					pitch
				),
				rounding,
				rounding
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

		silhoutte :
			silhoutte
	};
};


/*
| User pressed pos1 key,
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


/*
| Sets the hovered element.
*/
Portal.prototype._setHover =
	function(
		hover
	)
{
	if( this._$hover === hover )
	{
		return;
	}

	this._$hover =
		hover;

	this.poke( );
};



/*
| Returns the offset nearest to point p.
*/
Portal.prototype._getOffsetAt =
	function(
		section,
		x
	)
{
	var
		dx =
			x - this._$spaceFields[ section ].pnw.x,

		value =
			this.twig[ section ],

		x1 =
			0,

		x2 =
			0,

		a,

		aZ,

		font =
			this._fonts[ section ];

	for(
		a = 0, aZ = value.length;
		a < aZ;
		a++
	)
	{
		x1 =
			x2;

		x2 =
			Euclid.Measure.width(
				font,
				value.substr( 0, a )
			);

		if( x2 >= dx )
		{
			break;
		}
	}

	if(
		dx - x1 < x2 - dx &&
		a > 0
	)
	{
		a--;
	}

	return a;
};


/*
| Issues the moveTo action.
*/
Portal.prototype._moveTo =
	function( )
{
	shell.moveToSpace(
		this.twig.spaceUser,
		this.twig.spaceTag,
		false
	);
};

} )( );
