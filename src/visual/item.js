/*
| Common base of Note, Label and Relation.
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
	Euclid,
	jion,
	jools,
	Mark,
	reply,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Node includes.
*/
if( SERVER )
{
	jools =
		require( '../jools/jools' );
}


/*
| Constructor
*/
var Item =
Visual.Item =
	function( )
{
	// this is an abstract class
	throw new Error( );
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
Item.concernsMark =
	function(
		mark,
		path
	)
{
	if( !path )
	{
		return undefined;
	}

	if( path.isEmpty )
	{
		return Mark.Vacant.create( );
	}

	if(
		mark.containsPath( path )
	)
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| Shortcut to the item's key.
| It is the last path entry.
*/
jools.lazyValue(
	Item.prototype,
	'key',
	function( )
	{
		return this.path.get( -1 );
	}
);


/*
| Returns the compass direction of the handle
| if p is on a resizer handle.
*/
Item.prototype.checkHandles =
	function(
		view,
		p
	)
{
	var
		h =
			this._handles,

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
| The handle object to plan where to sketch the handles to
| FIXME vars
*/
jools.lazyValue(
	Item.prototype,
	'_handles',
	function( )
	{
		var
			ha =
				this.handles,

			zone =
				this.zone,

			wx =
				zone.pnw.x,

			ny =
				zone.pnw.y,

			ex =
				zone.pse.x,

			sy =
				zone.pse.y,

			mx =
				jools.half( wx + ex ),

			my =
				jools.half( ny + sy ),

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
				jools.half( dcx - a );

			dcx =
				a;
		}

		if( dcy > b )
		{
			dey -=
				jools.half( dcy - b );

			dcy =
				b;
		}

		return jools.immute(
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
						ny - dcy + b2
					),

				n :
					ha.n &&
					Euclid.Rect.renew(
						mx - a,
						ny - dey,

						mx + a,
						ny - dey + b2
					),

				ne :
					ha.ne &&
					Euclid.Rect.renew(
						ex + dcx - a2,
						ny - dcy,

						ex + dex,
						ny - dcy + b2
					),

				e :
					ha.e &&
					Euclid.Rect.renew(
						ex + dex - a2,
						my - b,

						ex + dex,
						my + b
					),

				se :
					ha.se &&
					Euclid.Rect.renew(
						ex + dcx - a2,
						sy + dcy - b2,

						ex + dcx,
						sy + dcx
					),

				s :
					ha.s &&
					Euclid.Rect.renew(
						mx - a,
						sy + dey -b2,

						mx + a,
						sy + dey
					),

				sw :
					ha.sw &&
					Euclid.Rect.renew(
						wx - dcx,
						sy + dcy - b2,

						wx - dcx + a2,
						sy + dcy
					),

				w :
					ha.w &&
					Euclid.Rect.renew(
						wx - dex,
						my - b,

						wx - dex + a2,
						my + b
					)
			}
		);
	}
);


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
			this._handles,

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
			view.scale(
				this._handles.bb
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
| Draws the handles of an item ( resize, itemmenu )
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
		this.silhoutte,
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
			shell.action,

		sbary =
			this.scrollbarY;

	if(
		action.reflex === 'action.none'
		&&
		sbary
		&&
		sbary.within(
			view,
			p
		)
	)
	{
		shell.setAction(
			Action.ScrollY.create(
				'itemPath',
					this.path,
				'start',
					p,
				'startPos',
					sbary.pos
			)
		);

		return true;
	}

	if(
		!this.silhoutte.within(
			view,
			p
		)
	)
	{
		return false;
	}

	switch( action && action.reflex )
	{
		case 'action.createRelation' :

			shell.setAction(
				action.create(
					'fromItemPath',
						this.path,
					'relationState',
						'hadSelect',
					'toPoint',
						p
				)
			);

			return true;
	}

	if( ctrl && access == 'rw' )
	{
		// relation binding

		shell.setAction(
			Action.CreateRelation.create(
				'fromItemPath',
					this.path,
				'toItemPath',
					jion.path.empty,
				'relationState',
					'hadSelect',
				'toPoint',
					p
			)
		);

		return true;
	}

	// scrolling or dragging
	if( access == 'rw' )
	{
		// take focus
		if( shell.space.focusedItem( ) !== this )
		{
			shell.setMark(
				Mark.Item.create(
					'path',
						this.path
				)
			);
		}

		shell.setAction(
			Action.ItemDrag.create(
				'start',
					view.depoint( p ),
				'transItem',
					this,
				'origin',
					this
			)
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
	var
		action,
		dy,
		sbary,
		spos,
		start;

	action = shell.action;

	switch( action.reflex )
	{
		case 'action.createRelation' :

			if(
				!this.zone.within(
					view,
					p
				)
			)
			{
				return false;
			}

			shell.setAction(
				action.create(
					'toItemPath',
						this.path
				)
			);

			return true;

		case 'action.scrollY' :

			start = action.start,

			dy = ( p.y - start.y ) / view.zoom,

			sbary = this.scrollbarY,

			spos = action.startPos + sbary.scale( dy );

			shell.setPath(
				this.path.Append( 'scrolly' ),
				spos
			);

			return true;

		default :

			throw new Error(
				'invalid action in dragMove'
			);
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
	var
		action =
			shell.action;

	switch( action.reflex )
	{
		case 'action.createRelation' :

			if(
				!this.zone.within(
					view,
					p
				)
			)
			{
				return false;
			}

			var
				space =
					shell.space;

			Visual.Relation.spawn(
				space.getItem(
					action.fromItemPath.get( -1 )
				),
				this
			);

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
	var
		sbary =
			this.scrollbarY;

	if(
		sbary
		&&
		sbary.within( view, p )
	)
	{
		return (
			reply.hover.create(
				'path',
					this.path,
				'cursor',
					'default'
			)
		);
	}

	if(
		!this.zone.within(
			view,
			p
		)
	)
	{
		return null;
	}

	return (
		reply.hover.create(
			'path',
				this.path,
			'cursor',
				'default'
		)
	);
};


/*
| Returns true if the item equals another
|
| FIXME, make this correct.
*/
Item.prototype.equals =
	function(
		obj
	)
{
	return this === obj;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Item;
}

} )( );
