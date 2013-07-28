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
	Jools,
	Path,
	shell,
	system,
	theme;


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
		tree,
		path,
		doc
	)
{
	Visual.Item.call(
		this,
		tree,
		path
	);

	this.$sub =
		{
			doc :
				doc
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
| Returns the para at point. FIXME, honor scroll here.
*/
DocItem.prototype.getParaAtPoint =
	function(
		p
	)
{
	if( p.y < this.innerMargin.n )
	{
		return null;
	}

	return this.$sub.doc.getParaAtPoint(
		this,
		p
	);
};


/*
| Sets the focus to this item.
*/
DocItem.prototype.grepFocus =
	function(
		space
	)
{
	// already have focus?
	if( space.focusedItem() === this )
	{
		return;
	}

	var doc = this.$sub.doc;

	shell.setCaret(
		'space',
		doc.atRank( 0 ).textPath,
		0
	);

	shell.peer.moveToTop(
		this.path
	);
};


/*
| Sees if this item is being clicked.
*/
DocItem.prototype.click =
	function(
		space,
		view,
		p,
		shift,
		ctrl,
		access
	)
{
	if( access != 'rw' )
	{
		return false;
	}

	var
		vp =
			view.depoint( p );

	if(
		!this.zone.within(
			view,
			p
		)
	)
	{
		return false;
	}

	if( space.focusedItem( ) !== this )
	{
		this.grepFocus( space );

		shell.deselect( );
	}

	shell.redraw =
		true;

	var
		pnw =
			this.zone.pnw,

		pi =
			vp.sub(
				pnw.x,
				pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 )
			),

		para =
			this.getParaAtPoint(
				pi
			);

	// FIXME move into para
	if( para )
	{
		var
			ppnw =
				this.$sub.doc.getPNW(
					this,
					para.key
				),

			at1 =
				para.getPointOffset(
					this,
					pi.sub( ppnw )
				);

		shell.setCaret(
			'space',
			para.textPath,
			at1
		);

		shell.deselect( );
	}

	return true;
};


} )( );
