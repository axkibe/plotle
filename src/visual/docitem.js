/*
| An item with a document.
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
	Jools,
	Mark,
	shell;


/*
| Capsule
*/
( function() {
'use strict';


/*
| Constructor
*/
var DocItem =
Visual.DocItem =
	function( )
{
	throw new Error(
		CHECK && 'initializing abstract'
	);
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
| The attention center.
*/
Jools.lazyValue(
	DocItem.prototype,
	'attentionCenter',
	function( )
	{
		return (
			this.zone.pnw.y
			+
			Jools.limit(
				0,
				this.sub.doc.attentionCenter( this )
				-
				(
					this.scrollbarY
						?
						this.scrollbarY.pos
						:
						0
				),
				this.zone.height
			)
		);
	}
);


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

	return this.sub.doc.getParaAtPoint(
		this,
		p
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


	var
		pnw =
			this.zone.pnw,

		pi =
			vp.sub(
				pnw.x,
				pnw.y -
					(
						this.scrollbarY
							?
							this.scrollbarY.pos
							:
							0
					)
			),

		doc =
			this.sub.doc,

		para =
			this.getParaAtPoint(
				pi
			);

	// FIXME move into para
	if( para )
	{
		var
			ppnw =
				doc.getPNW(
					this,
					para.key
				),

			at =
				para.getPointOffset(
					this,
					pi.sub( ppnw )
				);

		shell.setMark(
			Mark.Caret.create(
				'path',
					para.textPath,
				'at',
					at
			)
		);
	}
	else
	{
		para =
			doc.atRank( doc.tree.ranks.length - 1 );

		shell.setMark(
			Mark.Caret.create(
				'path',
					para.textPath,
				'at',
					para.text.length
			)
		);
	}

	return true;
};


/*
| A text has been inputed.
*/
DocItem.prototype.input =
	function(
		text
	)
{
	return (
		this.sub.doc.input(
			text,
			this
		)
	);
};


/*
| Handles a special key.
*/
DocItem.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	return this.sub.doc.specialKey(
		key,
		this,
		shift,
		ctrl
	);
};


} )( );
