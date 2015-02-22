/*
| Everything there is in a space.
|
| FIXME remove all prototye and superclass being.
*/


var
	action_createRelation,
	action_itemDrag,
	action_scrolly,
	euclid_compass,
	euclid_ellipse,
	euclid_point,
	euclid_view,
	fabric_item,
	fabric_relation,
	jion_path,
	jools,
	mark_item,
	result_hover,
	root,
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
	jools = require( '../jools/jools' );
}


fabric_item =
	function( )
{
	// this is an abstract class
	throw new Error( );
};


if( SERVER )
{
	module.exports = fabric_item;
}


/*
| Returns the mark if an item with 'path' concerns about
| the mark.
*/
fabric_item.concernsMark =
	function(
		mark,
		path
	)
{
	if( !path )
	{
		return undefined;
	}

	if( !mark || path.isEmpty )
	{
		return null;
	}

	return(
		mark.containsPath( path )
		? mark
		: null
	);
};


/*
| Handles a potential dragStart event for this item.
*/
fabric_item.dragStart =
	function(
		p,
		shift,
		ctrl,
		access
	)
{
	var
		action,
		sbary,
		view;

	action = root.action;

	sbary = this.scrollbarY;

	view = this.view;

	if(
		action === null
		&& sbary
		&& sbary.within( view, p )
	)
	{
		root.create(
			'action',
				action_scrolly.create(
					'itemPath', this.path,
					'start', p,
					'startPos', sbary.pos
				)
		);

		return true;
	}

	if( !this.silhoutte.within( view, p ) )
	{
		return false;
	}

	switch( action && action.reflect )
	{
		case 'action_createRelation' :

			root.create(
				'action',
					action.create(
						'fromItemPath', this.path,
						'relationState', 'hadSelect',
						'toPoint', p
					)
			);

			return true;
	}

	if( ctrl && access == 'rw' )
	{
		// relation binding

		root.create(
			'action',
				action_createRelation.create(
					'fromItemPath', this.path,
					'toItemPath', jion_path.empty,
					'relationState', 'hadSelect',
					'toPoint', p
				)
		);

		return true;
	}

	// scrolling or dragging
	if( access == 'rw' )
	{
		// take focus
		if( root.space.focusedItem( ) !== this )
		{
			root.create( 'mark', mark_item.create( 'path', this.path ) );
		}

		root.create(
			'action',
				action_itemDrag.create(
					'start', view.depoint( p ),
					'transItem', this,
					'origin', this
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
| User is hovering their pointing device over something.
*/
fabric_item.pointingHover =
	function(
		p
	)
{
	var
		sbary,
		view;

	sbary = this.scrollbarY;

	view = this.view;

	if(
		sbary
		&& sbary.within( view, p )
	)
	{
		return(
			result_hover.create(
				'path', this.path,
				'cursor', 'default'
			)
		);
	}

	if( !this.zone.within( view, p ) )
	{
		return null;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'default'
		)
	);
};


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// FIXME remove everything below
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


/*
| Returns the compass direction of the handle
| if p is on a resizer handle.
*/
fabric_item.prototype.checkHandles =
	function(
		p
	)
{
	var
		a,
		aZ,
		d,
		f,
		fixView,
		h,
		handles,
		d8cwcf,
		view;

	handles = this._handles;

	view = this.view;

	f = root.display;

	d8cwcf = euclid_compass.dir8CWCF;

	for(
		a = 0, aZ = d8cwcf.length;
		a < aZ;
		a++
	)
	{
		d = d8cwcf[ a ];

		h = handles[ d ];

		if( !h )
		{
			continue;
		}

		fixView = view.review( 0, view.point( h.pc ) );

		if( h.within( fixView, p ) )
		{
			return d;
		}
	}

	return null;
};


/*i
| The handle object to plan where to put the handles at
|
| FIXME use fixPoints
*/
jools.lazyValue(
	fabric_item.prototype,
	'_handles',
	function( )
	{
		var
			a,
			a2,
			asw,
			b,
			b2,
			dcx,
			dcy,
			dex,
			dey,
			ex,
			ha,
			ny,
			mx,
			my,
			sy,
			wx,
			zone;

		ha = this.handles;

		zone = this.zone;

		wx = zone.pnw.x;

		ny = zone.pnw.y;

		ex = zone.pse.x;

		sy = zone.pse.y;

		mx = jools.half( wx + ex );

		my = jools.half( ny + sy );

		dcx = theme.handle.cdistance;

		dcy = theme.handle.cdistance;

		dex = theme.handle.edistance;

		dey = theme.handle.edistance;

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

		a2 = 2 * a,

		b2 = 2 * b;

		if( dcx > a )
		{
			dex -= jools.half( dcx - a );

			dcx = a;
		}

		if( dcy > b )
		{
			dey -= jools.half( dcy - b );

			dcy = b;
		}

		asw =
			{
				nw :
					ha.nw
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dcx,
								'y', ny - dcy
							),
						'pse',
							euclid_point.create(
								'x', wx - dcx + a2,
								'y', ny - dcy + b2
							)
					),
				n :
					ha.n
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', mx - a,
								'y', ny - dey
							),
						'pse',
							euclid_point.create(
								'x', mx + a,
								'y', ny - dey + b2
							)
					),
				ne :
					ha.ne
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dcx - a2,
								'y', ny - dcy
							),
						'pse',
							euclid_point.create(
								'x', ex + dex,
								'y', ny - dcy + b2
							)
					),
				e :
					ha.e
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dex - a2,
								'y', my - b
							),
						'pse',
							euclid_point.create(
								'x', ex + dex,
								'y', my + b
							)
					),
				se :
					ha.se
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', ex + dcx - a2,
								'y', sy + dcy - b2
							),
						'pse',
							euclid_point.create(
								'x', ex + dcx,
								'y', sy + dcx
							)
					),
				s :
					ha.s
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', mx - a,
								'y', sy + dey -b2
							),
						'pse',
							euclid_point.create(
								'x', mx + a,
								'y', sy + dey
							)
					),
				sw :
					ha.sw
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dcx,
								'y', sy + dcy - b2
							),
						'pse',
							euclid_point.create(
								'x', wx - dcx + a2,
								'y', sy + dcy
							)
					),
				w :
					ha.w
					&&
					euclid_ellipse.create(
						'pnw',
							euclid_point.create(
								'x', wx - dex,
								'y', my - b
							),
						'pse',
							euclid_point.create(
								'x', wx - dex + a2,
								'y', my + b
							)
					)
			};

/**/	if( FREEZE )
/**/	{
/**/		Object.freeze( asw );
/**/	}

		return asw;
	}
);


/*
| Draws the handles of an item ( resize, itemmenu )
*/
fabric_item.prototype.drawHandles =
	function(
		display
	)
{
	var
		a,
		area,
		d,
		d8cwcf,
		fixView,
		h,
		handles,
		sbary,
		view;

	d8cwcf = euclid_compass.dir8CWCF;

	handles = this._handles;

	sbary = this.scrollbarY;

	view = this.view;

	if( sbary )
	{
		area = sbary.getArea( view );

		display.reverseClip( area, euclid_view.proper, -1 );
	}

	display.reverseClip( this.silhoutte, view, -1 );

	// draws the resize handles

	for(
		a = d8cwcf.length - 1;
		a >= 0;
		a--
	)
	{
		d = d8cwcf[ a ];

		h = handles[ d ];

		if( !h )
		{
			continue;
		}

		fixView = view.review( 0, view.point( h.pc ) );

		display.paint( theme.handle.style, h, fixView );
	}

	display.deClip( );
};



/*
| A move during an action.
*/
fabric_item.prototype.dragMove =
	function(
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
		start,
		view;

	action = root.action;

	view = this.view;

	switch( action.reflect )
	{
		case 'action_createRelation' :

			if( !this.zone.within( view, p ) )
			{
				return false;
			}

			root.create(
				'action', action.create( 'toItemPath', this.path )
			);

			return true;

		case 'action_scrolly' :

			start = action.start,

			dy = ( p.y - start.y ) / view.zoom,

			sbary = this.scrollbarY,

			spos = action.startPos + sbary.scale( dy );

			root.setPath(
				this.path.append( 'scrolly' ),
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
fabric_item.prototype.dragStop =
	function(
		p
	)
{
	var
		action;

	action = root.action;

	switch( action.reflect )
	{
		case 'action_createRelation' :

			if( !this.zone.within( this.view, p ) )
			{
				return false;
			}

			fabric_relation.spawn(
				root.space.getItem(
					action.fromItemPath.get( -1 )
				),
				this
			);

			return true;

		default :

			return false;
	}
};


} )( );
