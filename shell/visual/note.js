/*
| A fix sized text item.
| Possibly has a scrollbar.
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
	Jools,
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
	throw new Error('this code needs a browser!');
}


/*
| Constructor.
*/
var Note =
Visual.Note =
	function(
		twig,
		path
	)
{
	Visual.DocItem.call(
		this,
		twig,
		path
	);

	this.scrollbarY =
		new Visual.Scrollbar( );
};


Jools.subclass(
	Note,
	Visual.DocItem
);


/*
| Gets the zone for a transient note
*/
Note.s_getZone =
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
		theme.note.minWidth;

	var minHeight =
		theme.note.minHeight;

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
| Draws a transitory note
| ( A note in the making )
*/
Note.s_drawTrans =
	function(
		fabric,
		view,
		zone
	)
{
	var silhoutte =
		Note.s_getSilhoutte( zone );

	var style =
		Style.getStyle(
			theme.note.style,
			'normal'
		);

	fabric.paint(
		style,
		silhoutte,
		'sketch',
		view
	);
};


/*
| Returns a silhoutte matching the zone.
*/
Note.s_getSilhoutte =
	function( zone )
{
	var cr =
		theme.note.cornerRadius;

	return (
		new Euclid.RoundRect(
			zone.pnw,
			zone.pse,
			cr,
			cr
		)
	);
};


/*
| Returns the notes silhoutte anchored at zero.
*/
Note.s_getZeroSilhoutte =
	function( zone )
{
	var cr =
		theme.note.cornerRadius;

	return (
		new Euclid.RoundRect(
			Euclid.Point.zero,
			new Euclid.Point(
				zone.width,
				zone.height
			),
			cr,
			cr
		)
	);
};


/*
| Resize handles to show on notes.
*/
Note.s_handles =
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
| Default margin for all notes.
*/
Note.s_innerMargin =
	new Euclid.Margin(
		theme.note.innerMargin
	);


/*
| Sets the items position and size after an action.
*/
Note.prototype.dragStop =
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
				zone.width  < theme.note.minWidth ||
				zone.height < theme.note.minHeight
			)
			{
				throw new Error( 'Note under minimum size!' );
			}

			if( this.twig.zone.eq( zone ) )
			{
				return;
			}

			shell.peer.setZone(
				this.path,
				zone
			);

			shell.redraw = true;

			return true;

		default :

			return Visual.DocItem.prototype.dragStop.call(
				this,
				view,
				p
			);
	}
};


/*
| Draws the note.
*/
Note.prototype.draw =
	function(
		fabric,
		caret,
		view
	)
{
	var zone =
		this.getZone( );

	var vzone =
		view.rect( zone );

	var f =
		this.$fabric;

	var sbary =
		this.scrollbarY;

	// no buffer hit?
	if(
		config.debug.noCache ||
		!f ||
		vzone.width !== f.width ||
		vzone.height !== f.height
	)
	{
		f =
		this.$fabric =
			new Euclid.Fabric(
				vzone.width  + 2,
				vzone.height + 2
			);

		var doc =
			this.$sub.doc;

		var imargin =
			this.innerMargin;

		// calculates if a scrollbar is needed
		var height =
			doc.getHeight();

		sbary.visible =
			height > zone.height - imargin.y;

		var silhoutte =
			this.getZeroSilhoutte( zone );

		var style =
			Style.getStyle(
				theme.note.style,
				'normal'
			);

		f.fill(
			style,
			silhoutte,
			'sketch',
			view.home( )
		);

		// draws selection and text
		sbary.point = Euclid.Point.renew(
			0,
			sbary.getPos( ),
			sbary.point
		);

		doc.draw(
			f,
			view.home( ),
			zone.width,
			imargin,
			sbary.point
		);

		// draws the border
		f.edge(
			style,
			silhoutte,
			'sketch',
			view.home( )
		);
	}

	var action =
		shell.bridge.action( );

	// TODO move this logic into the callee
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

	if( sbary.visible )
	{
		this.setScrollbar( );

		sbary.draw(
			fabric,
			view
		);
	}
};



/*
| Default margin for all notes.
*/
Note.prototype.innerMargin =
	Note.s_innerMargin;


/*
| Resize handles to show on notes.
*/
Note.prototype.handles =
	Note.s_handles;


/*
| Returns the notes silhoutte.
|
*/
Note.prototype.getSilhoutte =
	function(
		zone //  the cache for the items zone
	)
{
	var s =
		this._$silhoutte;

	if( s && s.eq( zone ) )
	{
		return s;
	}

	s =
	this._$silhoutte =
		Note.s_getSilhoutte( zone );

	return s;
};


/*
| Returns the notes silhoutte anchored at zero.
*/
Note.prototype.getZeroSilhoutte =
	function( zone )
{
	var s  = this._$zeroSilhoutte;

	if(
		s &&
		s.width  === zone.width &&
		s.height === zone.height
	)
	{
		return s;
	}

	return Note.s_getZeroSilhoutte( zone );
};


/*
| Highlights the note.
*/
Note.prototype.highlight =
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
			theme.note.style,
			'highlight'
		),
		silhoutte,
		'sketch',
		view
	);
};


/*
| Actualizes the scrollbar.
*/
Note.prototype.setScrollbar =
	function( pos )
{
	var sbary =
		this.scrollbarY;

	if( !sbary.visible )
	{
		return;
	}

	var zone =
		this.getZone( );

	if( !Jools.is( pos ) )
	{
		pos =
			sbary.getPos( );
	}

	sbary.setPos(
		pos,
		zone.height - this.innerMargin.y,
		this.$sub.doc.getHeight( ),
		Euclid.Point.renew(
			zone.pse.x, zone.pnw.y + theme.scrollbar.vdis, sbary.pnw
		),
		zone.height - theme.scrollbar.vdis * 2
	);
};


/*
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollCaretIntoView =
	function( )
{
	// TODO hand down
	var
		caret =
			shell.$space.$caret,

		scrolly =
			this.scrollbarY,

		sy =
			scrolly.getPos( ),

		para =
			shell.$space.getSub(
				caret.sign.path,
				'Para'
			);

	if( para.constructor !== Visual.Para )
	{
		throw new Error( 'para not a para.' );
	}

	var
		cp =
			para.getCaretPos( ),

		pnw =
			this.$sub.doc.getPNW( para.key ),

		zone =
			this.getZone( ),

		imargin =
			this.innerMargin;

	if( cp.n + pnw.y - imargin.n < sy )
	{
		this.setScrollbar(
			cp.n + pnw.y - imargin.n
		);

		this.poke( );
	}
	else if( cp.s + pnw.y + imargin.s > sy + zone.height )
	{
		this.setScrollbar(
			cp.s + pnw.y - zone.height + imargin.s
		);

		this.poke( );
	}
};


/*
| Scrolls the note so the caret comes into view.
*/
Note.prototype.scrollPage =
	function(
		up
	)
{
	var zone =
		this.getZone( );

	var dir =
		up ? -1 : 1;

	var fs =
		this.$sub.doc.getFont( ).size;

	this.setScrollbar(
		this.scrollbarY.getPos( ) + dir * zone.height - fs * 2
	);

	this.poke( );
};


/*
| Mouse wheel turned.
*/
Note.prototype.mousewheel =
	function(
		view,
		p,
		dir
		// shift,
		// ctrl
	)
{
	if( !this.getZone().within( view, p) )
	{
		return false;
	}

	this.setScrollbar(
		this.scrollbarY.getPos( ) - dir * system.settings.textWheelSpeed
	);

	this.poke( );

	shell.redraw =
		true;

	return true;
};


/*
| Returns the width for the contents flow.
*/
Note.prototype.getFlowWidth =
	function( )
{
	var zone =
		this.getZone( );

	var flowWidth =
		zone.width - this.innerMargin.x;

	return flowWidth;
};


/*
| Returns the para seperation height.
*/
Note.prototype.getParaSep =
	function( fontsize )
{
	return Jools.half( fontsize );
};


/*
| Returns the zone of the item.
|
| An ongoing action can modify this
| to something different than meshmashine data.
*/
Note.prototype.getZone =
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

			var spnw =
				szone.pnw;

			var spse =
				szone.pse;

			var dx =
				action.move.x - action.start.x;

			var dy =
				action.move.y - action.start.y;

			var minw =
				theme.note.minWidth;

			var minh =
				theme.note.minHeight;

			var pnw, pse;

			switch( action.align )
			{
				case 'n'  :

					pnw =
						Euclid.Point.renew(
							spnw.x,
							min(
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
							min(
								spnw.y + dy,
								spse.y - minh
							),
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							max(
								spse.x + dx,
								spnw.x + minw
							),
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
							max(
								spse.x + dx,
								spnw.x + minw
							),
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
							max(
								spse.x + dx,
								spnw.x + minw
							),
							max(
								spse.y + dy,
								spnw.y + minh
							),
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
							max(
								spse.y + dy,
								spnw.y + minh
							),
							spnw,
							spse
						);

					break;

				case 'sw'  :

					pnw =
						Euclid.Point.renew(
							min(
								spnw.x + dx,
								spse.x - minw
							),
							spnw.y,
							spnw,
							spse
						);

					pse =
						Euclid.Point.renew(
							spse.x,
							max(
								spse.y + dy,
								spnw.y + minh
							),
							spnw,
							spse
						);

					break;

				case 'w'   :

					pnw =
						Euclid.Point.renew(
							min(
								spnw.x + dx,
								spse.x - minw
							),
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
							min(
								spnw.x + dx,
								spse.x - minw
							),
							min(
								spnw.y + dy,
								spse.y - minh
							),
							spnw,
							spse
						);

					pse =
						spse;

					break;

				//case 'c' :
				default  :
					throw new Error( 'unknown align' );
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


} )( );
