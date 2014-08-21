/*
| Common base of Note, Label and Relation.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	visual;

visual =
	visual || { };


/*
| Imports
*/
var
	actions,
	euclid,
	jion,
	jools,
	marks,
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
var
	item;

item =
visual.item =
	function( )
{
	// this is an abstract class
	throw new Error( );
};


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
item.concernsMark =
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
		return marks.vacant.create( );
	}

	if(
		mark.containsPath( path )
	)
	{
		return mark;
	}
	else
	{
		return marks.vacant.create( );
	}
};


/*
| Shortcut to the item's key.
| It is the last path entry.
*/
jools.lazyValue(
	item.prototype,
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
item.prototype.checkHandles =
	function(
		view,
		p
	)
{
	var
		f,
		h,
		d8cwcf;

	h = this._handles;

	f = shell.fabric;

	d8cwcf = euclid.compass.dir8CWCF;

	for(
		var a = 0, aZ = d8cwcf.length;
		a < aZ;
		a++
	)
	{
		var
			d = d8cwcf[ a ],

			z = h[ d ];

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
	item.prototype,
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
					euclid.rect.renew(
						wx - dcx,
						ny - dcy,

						wx - dcx + a2,
						ny - dcy + b2
					),

				n :
					ha.n &&
					euclid.rect.renew(
						mx - a,
						ny - dey,

						mx + a,
						ny - dey + b2
					),

				ne :
					ha.ne &&
					euclid.rect.renew(
						ex + dcx - a2,
						ny - dcy,

						ex + dex,
						ny - dcy + b2
					),

				e :
					ha.e &&
					euclid.rect.renew(
						ex + dex - a2,
						my - b,

						ex + dex,
						my + b
					),

				se :
					ha.se &&
					euclid.rect.renew(
						ex + dcx - a2,
						sy + dcy - b2,

						ex + dcx,
						sy + dcx
					),

				s :
					ha.s &&
					euclid.rect.renew(
						mx - a,
						sy + dey -b2,

						mx + a,
						sy + dey
					),

				sw :
					ha.sw &&
					euclid.rect.renew(
						wx - dcx,
						sy + dcy - b2,

						wx - dcx + a2,
						sy + dcy
					),

				w :
					ha.w &&
					euclid.rect.renew(
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
item.prototype.sketchAllHandles =
	function(
		fabric,
		border,
		twist,
		view
	)
{
	var
		d,
		d8cwcf,
		fixView,
		h,
		z;

	if( border !== 0 )
	{
		throw new Error( 'borders unsupported for handles' );
	}

	h = this._handles;

	d8cwcf = euclid.compass.dir8CWCF;

	for(
		var a = d8cwcf.length - 1;
		a >= 0;
		a--
	)
	{
		d = d8cwcf[ a ];

		z = h[ d ];

		if( !z )
		{
			continue;
		}

		fixView =
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
item.prototype.sketchHandle =
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
item.prototype.drawHandles =
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
			euclid.view.proper,
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
item.prototype.dragStart =
	function(
		view,
		p,
		shift,
		ctrl,
		access
	)
{
	var
		action,
		sbary;

	action = shell.action,

	sbary = this.scrollbarY;

	if(
		action.reflex === 'actions.none'
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
			actions.scrollY.create(
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
		case 'actions.createRelation' :

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
			actions.createRelation.create(
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
				marks.item.create(
					'path',
						this.path
				)
			);
		}

		shell.setAction(
			actions.itemDrag.create(
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
item.prototype.dragMove =
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
		case 'actions.createRelation' :

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

		case 'actions.scrollY' :

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
item.prototype.dragStop =
	function(
		view,
		p
	)
{
	var
		action;

	action = shell.action;

	switch( action.reflex )
	{
		case 'actions.createRelation' :

			if(
				!this.zone.within(
					view,
					p
				)
			)
			{
				return false;
			}

			visual.Relation.spawn(
				shell.space.getItem(
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
item.prototype.pointingHover =
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
item.prototype.equals =
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
	module.exports = item;
}

} )( );
