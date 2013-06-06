/*
| Common base of Note, Label and Relation.
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
	Action,
	EllipseMenu,
	Euclid,
	Jools,
	Path,
	shell,
	Style,
	system,
	theme;


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
| Constructor
*/
var Item =
Visual.Item =
	function(
		twig,
		path
	)
{
	Visual.Base.call(
		this,
		twig,
		path
	);

	this.$fabric =
		null;

	this.$handles =
		{ };
};

Jools.subclass(
	Item,
	Visual.Base
);


/*
| Used for lookups
*/
Item.prototype.Item =
	true;


/*
| Updates the $sub to match a new twig.
*/
Item.prototype.update =
	function(
		twig
	)
{
	this.twig    = twig;
	this.$fabric = null;

	this.poke( );
};


/*
| An entry of the item menu has been selected
*/
Item.prototype.menuSelect =
	function(
		entry
		// p
	)
{
	switch( entry )
	{
		case 'n': // remove

			shell.dropFocus();

			shell.peer.removeItem( this.path );

			break;

	}
};


/*
| Returns the compass direction of the handle if p is on a resizer handle.
*/
Item.prototype.checkHandles =
	function(
		view,
		p
	)
{
	var
		h =
			this.planHandles(),
		f =
			shell.fabric,
		d8cwcf =
			Euclid.Compass.dir8CWCF;

	for(
		var a = 0, aZ = d8cwcf.length;
		a < aZ;
		a++
	)
	{
		var
			d =
				d8cwcf[ a ],
			z =
				h[ d ];

		if( !z )
		{
			continue;
		}

		var fixView =
			view.review(
				0,
				view.point( z.pc )
			);

		if(
			f.withinSketch(
				this,
				'sketchHandle',
				fixView,
				p,
				z
			)
		)
		{
			return d;
		}
	}

	return null;
};


/*
| Creates the handle object to plan where to sketch the handles to
*/
Item.prototype.planHandles =
	function( )
{
	var
		ha =
			this.handles,
		zone =
			this.getZone( ),
		h =
			this.$handles;

	if( h.zone && zone.eq( h.zone ) )
	{
		return h;
	}

	var
		wx =
			zone.pnw.x,
		ny =
			zone.pnw.y,
		ex =
			zone.pse.x,
		sy =
			zone.pse.y,

		mx =
			Jools.half( wx + ex ),
		my =
			Jools.half( ny + sy ),

		dcx =
			theme.handle.cdistance,
		dcy =
			theme.handle.cdistance,

		dex =
			theme.handle.edistance,
		dey =
			theme.handle.edistance,

		a =
			Math.min(
				Math.round( ( zone.width  + 2 * dcx ) / 6 ),
				theme.handle.maxSize
			),

		b =
			Math.min(
				Math.round( ( zone.height + 2 * dcy ) / 6 ),
				theme.handle.maxSize
			),

		a2 =
			2 * a,

		b2 =
			2 * b;

	if( dcx > a )
	{
		dex -=
			Jools.half( dcx - a );

		dcx =
			a;
	}

	if( dcy > b )
	{
		dey -=
			Jools.half( dcy - b );

		dcy =
			b;
	}

	return this.$handles =
		{
			// ellipse bezier height
			bb :
				Math.round( b / 0.75 ),

			zone :
				zone,

			nw :
				ha.nw &&
				Euclid.Rect.renew(
					wx - dcx,
					ny - dcy,

					wx - dcx + a2,
					ny - dcy + b2,

					h.nw
				),

			n :
				ha.n &&
				Euclid.Rect.renew(
					mx - a,
					ny - dey,

					mx + a,
					ny - dey + b2,

					h.n
				),

			ne :
				ha.ne &&
				Euclid.Rect.renew(
					ex + dcx - a2,
					ny - dcy,

					ex + dex,
					ny - dcy + b2,

					h.ne
				),

			e :
				ha.e &&
				Euclid.Rect.renew(
					ex + dex - a2,
					my - b,

					ex + dex,
					my + b,

					h.e
				),

			se :
				ha.se &&
				Euclid.Rect.renew(
					ex + dcx - a2,
					sy + dcy - b2,

					ex + dcx,
					sy + dcx,

					h.se
				),

			s :
				ha.s &&
				Euclid.Rect.renew(
					mx - a,
					sy + dey -b2,

					mx + a,
					sy + dey,

					h.s
				),

			sw :
				ha.sw &&
				Euclid.Rect.renew(
					wx - dcx,
					sy + dcy - b2,

					wx - dcx + a2,
					sy + dcy,

					h.sw
				),

			w :
				ha.w &&
				Euclid.Rect.renew(
					wx - dex,
					my - b,

					wx - dex + a2,
					my + b,

					h.w
				)
		};
};


/*
| Sketches all resize handles.
*/
Item.prototype.sketchAllHandles =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	if( border !== 0 )
	{
		throw new Error( 'borders unsupported for handles' );
	}

	var
		h =
			this.planHandles( ),
		d8cwcf =
			Euclid.Compass.dir8CWCF;

	for(
		var a = d8cwcf.length - 1;
		a >= 0;
		a--
	)
	{
		var
			d =
				d8cwcf[ a ],
			z =
				h[ d ];

		if( !z )
		{
			continue;
		}

		var fixView =
			view.review(
				0,
				view.point( z.pc )
			);

		this.sketchHandle(
			fabric,
			border,
			twist,
			fixView,
			z
		);
	}
};


/*
| Sketches one or all resize handles.
*/
Item.prototype.sketchHandle =
	function(
		fabric,
		border,
		twist,
		view,
		zone
	)
{
	var
		bb =
			view.distance(
				this.$handles.bb
			),
		w =
			view.point( zone.w ),
		e =
			view.point( zone.e );

	fabric.moveTo( w );

	fabric.beziTo(
		0,
		-bb,

		0,
		-bb,

		e
	);

	fabric.beziTo(
		0,
		+bb,

		0,
		+bb,

		w
	);
};


/*
| Draws the handles of an item (resize, itemmenu)
*/
Item.prototype.drawHandles =
	function(
		fabric,
		view
	)
{
	var sbary =
		this.scrollbarY;

	if( sbary && sbary.visible )
	{
		var area =
			sbary.getArea( view );

		fabric.reverseClip(
			area,
			'sketch',
			Euclid.View.proper,
			-1
		);
	}

	fabric.reverseClip(
		this.getSilhoutte(
			this.getZone( )
		),
		'sketch',
		view,
		-1
	);

	// draws the resize handles
	fabric.paint(
		theme.handle.style,
		this,
		'sketchAllHandles',
		view
	);

	fabric.deClip( );
};



/*
| Checks if a dragStart targets this item.
*/
Item.prototype.dragStart =
	function(
		view,
		p,
		shift,
		ctrl,
		access
	)
{
	var
		action =
			shell.bridge.action( ),

		sbary =
			this.scrollbarY;

	if(
		!action &&
		sbary &&
		sbary.within(
			view,
			p
		)
	)
	{
		shell.bridge.startAction(
			'ScrollY',
			'space',
			'itemPath',
				this.path,
			'start',
				p,
			'startPos',
				sbary.getPos( )
		);

		return true;
	}

	var
		zone =
			this.getZone( ),

		silhoutte =
			this.getSilhoutte( zone );

	if(
		!silhoutte.within(
			view,
			p
		)
	)
	{
		return false;
	}
	
	switch( action && action.type )
	{
		case 'Remove' :
            if(
                !this.path.equals( action.removeItemPath )
            )
            {
                action.removeItemPath =
                    this.path;

                action.removeItemFade =
                    true;

                shell.redraw =
                    true;
            }

			return true;
	}

	if( ctrl && access == 'rw' )
	{
		// relation binding
		shell.redraw =
			true;

		shell.bridge.startAction(
			'RelBind',
			'space',
			'itemPath',
				this.path,
			'start',
				p,
			'move',
				p
		);

		return true;
	}

	// scrolling or dragging
	if( access == 'rw' )
	{
		this.grepFocus( );

		var
			vp =
				view.depoint( p );

		shell.redraw =
			true;

		shell.bridge.startAction(
			'ItemDrag',
			'space',
			'itemPath',
				this.path,
			'start',
				vp,
			'move',
				vp
		);

		return true;
	}
	else
	{
		return false;
	}
};


/*
| A move during an action.
*/
Item.prototype.dragMove =
	function(
		view,
		p
		// shift,
		// ctrl
	)
{
	var action =
		shell.bridge.action( );

	switch( action.type )
	{
		case 'CreateRelation' :

			if(
				!this.getZone( ).within(
					view,
					p
				)
			)
			{
				return false;
			}

			action.move =
				p;

			action.toItemPath =
				this.path;

			shell.redraw =
				true;

			return true;

		case 'RelBind' :

			if(
				!this.getZone( ).within(
					view,
					p
				)
			)
			{
				return false;
			}

			action.move =
				p;

			action.item2Path =
				this.path;

			shell.redraw =
				true;

			return true;

		case 'ItemDrag' :
		case 'ItemResize' :

			action.move =
				view.depoint( p );

			shell.redraw =
				true;

			return true;

		case 'ScrollY' :

			var
				start =
					action.start,
				dy =
					p.y - start.y,
				item =
					shell.$space.getSub(
						action.itemPath,
						'Item'
					),
				sbary =
					item.scrollbarY,
				spos =
					action.startPos + sbary.scale( dy );

			item.setScrollbar( spos );

			item.poke( );

			shell.redraw =
				true;

			return true;

		default :

			throw new Error( 'invalid action.type in dragMove' );
	}

	return true;
};


/*
| Sets the items position and size after an action.
*/
Item.prototype.dragStop =
	function(
		view,
		p
	)
{
	var action =
		shell.bridge.action();

	switch( action.type )
	{
		case 'CreateRelation' :

			if(
				!this.getZone().within(
					view,
					p
				)
			)
			{
				return false;
			}

			var space =
				shell.$space;

			Visual.Relation.create(
				space,
				space.getSub( action.fromItemPath ),
				this
			);

			shell.redraw = true;

			return true;

		default :

			return false;
	}
};


/*
| User is hovering his/her pointing device over something.
|
| Checks if this item reacts on this.
*/
Item.prototype.pointingHover =
	function(
		view,
		p
	)
{
	if( p === null )
	{
		return null;
	}

	var sbary =
		this.scrollbarY;

	if(
		sbary &&
		sbary.within( view, p )
	)
	{
		return 'default';
	}

	if(
		!this.getZone().within( view, p )
	)
	{
		return null;
	}

	return 'default';
};


/*
| Sets the focus to this item.
*/
Item.prototype.grepFocus =
	function( )
{
	// already have focus?
	if(
		shell.$space.focusedItem( ) === this
	)
	{
		return;
	}

	var
		doc =
			this.$sub.doc,
		caret =
			shell.setCaret(
				'space',
				{
					path :
						doc.atRank( 0 ).textPath,
					at1 :
						0
				}
			);

	caret.show( );

	shell.peer.moveToTop( this.path );
};


/*
| Highlights the item.
*/
Item.prototype.highlight =
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
		// TODO XXX note not applicatable here!
		Style.getStyle(
			theme.note.style,
			'highlight'
		),
		silhoutte,
		'sketch',
		view
	);
};


/*
| Called by subvisuals when they got changed.
*/
Item.prototype.poke =
	function( )
{
	this.$fabric =
		null;

	shell.redraw =
		true;
};


/*
| Force-clears all caches.
*/
Item.prototype.knock =
	function( )
{
	this.$fabric =
		null;
};


} )( );
