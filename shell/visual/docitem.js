/*
| An item with a doc.
|
| Common base of Note, Label and Relation.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Visual;
Visual = Visual || { };


/*
| Imports
*/
var Action;
var Euclid;
var Jools;
var Path;
var shell;
var system;
var theme;


/*
| Capsule
*/
( function() {
'use strict';

if( typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor
*/
var DocItem =
Visual.DocItem =
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

	this.$sub =
		{
			doc : new Visual.Doc(
				spacename,
				twig.doc,
				new Path( path, '++', 'doc' )
			)
		};
};

Jools.subclass(
	DocItem,
	Visual.Item
);


/*
| Sets the items position and size after an action.
*/
DocItem.prototype.dragStop =
	function(
		view,
		p
	)
{
	return Visual.Item.prototype.dragStop.call(
		this,
		view,
		p
	);
};


/*
| Updates the $sub to match a new twig.
*/
DocItem.prototype.update =
	function( twig )
{
	Visual.Item.prototype.update.call(
		this,
		twig
	);

	var doc =
		this.$sub.doc;

	if (doc.twig !== twig.doc)
	{
		doc.update( twig.doc );
	}

};


/*
| Returns the para at point. FIXME, honor scroll here.
*/
DocItem.prototype.getParaAtPoint =
	function( p )
{
	if( p.y < this.innerMargin.n )
	{
		return null;
	}

	return this.$sub.doc.getParaAtPoint(p);
};


/*
| Sets the focus to this item.
*/
DocItem.prototype.grepFocus =
	function( )
{
	// TODO hand this down.
	var space =
		shell.$space;

	// already have focus?
	if( space.focusedItem() === this )
	{
		return;
	}

	var doc = this.$sub.doc;

	var caret =
		space.setCaret(
			{
				path : doc.atRank(0).textPath,
				at1  : 0
			}
		);

	caret.show( );

	shell.peer.moveToTop(
		this.path
	);
};


/*
| Sees if this item is being clicked.
*/
DocItem.prototype.click =
	function(
		view,
		p
	)
{
	var vp = view.depoint( p );

	if( !this.getZone( ).within( view, p ) )
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

		shell.deselect( );
	}

	shell.redraw = true;

	var pnw =
		this.getZone( ).pnw;

	var pi =
		vp.sub(
			pnw.x,
			pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 )
		);

	var para =
		this.getParaAtPoint( pi );

	// FIXME move into para
	if( para )
	{
		var ppnw =
			this.$sub.doc.getPNW( para.key );

		var at1 =
			para.getPointOffset(
				pi.sub( ppnw )
			);

		var caret = space.setCaret(
			{
				path : para.textPath,
				at1  : at1
			}
		);

		caret.show( );

		shell.deselect( );
	}

	return true;
};

/*
| force-clears all caches.
*/
DocItem.prototype.knock =
	function( )
{
	Visual.Item.prototype.knock.call( this );

	this.$sub.doc.knock( );
};


} )( );
