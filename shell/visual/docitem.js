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
		overload,
		inherit,
		a1,   // twig  |  phrase
		a2    // path  |  fontsize
	)
{
	switch( overload )
	{
		case 'twig' :

			var
				twig =
					a1,

				path =
					a2;

			console.log(
				'X3',
				inherit
			);

			Visual.Item.call(
				this,
				twig,
				path
			);

			this.$sub =
				{
					doc :
						Visual.Doc.create(
							'twig',
							inherit && inherit.$sub.doc,
							twig.doc,
							path,
							twig.fontsize
						)
				};

			break;

		case 'phrase' :

			var
				phrase =
					a1,

				fontsize =
					a2;

			Visual.Item.call(
				this,
				null,
				null
			);

			this.$sub =
				{
					doc :
						Visual.Doc.create(
							'phrase',
							inherit,
							phrase,
							fontsize
						)
				};

			break;

		default :

			throw new Error(
				'invalid overload'
			);
	}
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

	var caret =
		space.setCaret(
			{
				path :
					doc.atRank( 0 ).textPath,

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
	var vp =
		view.depoint( p );

	if( access != 'rw' )
	{
		return false;
	}

	if( !this.getZone( ).within( view, p ) )
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

	var pnw =
		this.getZone( ).pnw;

	var pi =
		vp.sub(
			pnw.x,
			pnw.y - (this.scrollbarY ? this.scrollbarY.getPos() : 0 )
		);

	var para =
		this.getParaAtPoint(
			pi
		);

	// FIXME move into para
	if( para )
	{
		var ppnw =
			this.$sub.doc.getPNW(
				para.key
			);

		var at1 =
			para.getPointOffset(
				this,
				pi.sub( ppnw )
			);

		var caret =
			space.setCaret(
				{
					path :
						para.textPath,

					at1 :
						at1
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
