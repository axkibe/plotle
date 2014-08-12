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
	jools,
	Mark,
	shell;


/*
| Capsule
*/
( function() {
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
var DocItem =
Visual.DocItem =
	function( )
{
	// initializing abstract.
	throw new Error( );
};


// FIXME this is ugly
if( !SERVER )
{
	jools.subclass(
		DocItem,
		Visual.Item
	);
}


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
jools.lazyValue(
	DocItem.prototype,
	'attentionCenter',
	function( )
	{
		return (
			this.zone.pnw.y
			+
			jools.limit(
				0,
				this.doc.attentionCenter( this )
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

	return this.doc.getParaAtPoint(
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
	var
		at,
		doc,
		para,
		ppnw,
		pnw,
		pi,
		vp;

	if( access != 'rw' )
	{
		return false;
	}

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


	pnw =
		this.zone.pnw;

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
		);

	doc =
		this.doc;

	para =
		this.getParaAtPoint( pi );

	// FIXME move into para
	if( para )
	{
		ppnw =
			doc.getPNW(
				this,
				para.key
			);

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
			doc.atRank( doc.ranks.length - 1 );

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
		this.doc.input(
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
	return this.doc.specialKey(
		key,
		this,
		shift,
		ctrl
	);
};


} )( );
