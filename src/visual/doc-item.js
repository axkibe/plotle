/*
| An item with a document.
*/


/*
| Export
*/
var
	visual,
	visual_docItem;

visual = visual || { };


/*
| Imports
*/
var
	jools,
	marks_caret,
	root;


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
	jools = require( '../jools/jools' );
}


/*
| Constructor
*/
var
	docItem;

docItem =
visual_docItem =
visual.docItem =
	function( )
{
	// initializing abstract.
	throw new Error( );
};


// FIXME this is ugly
if( !SERVER )
{
	jools.subclass( docItem, visual.item );
}


/*
| Sets the items position and size after an action.
*/
docItem.prototype.dragStop =
	function(
		view,
		p
	)
{
	return(
		visual.item.prototype.dragStop.call(
			this,
			view,
			p
		)
	);
};


/*
| The attention center.
*/
jools.lazyValue(
	docItem.prototype,
	'attentionCenter',
	function( )
	{
		return (
			this.zone.pnw.y
			+
			jools.limit(
				0,
				this.doc.attentionCenter
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
docItem.prototype.getParaAtPoint =
	function(
		p
	)
{
	if( p.y < this.doc.innerMargin.n )
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
docItem.prototype.click =
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

	vp = view.depoint( p );

	if(
		!this.zone.within(
			view,
			p
		)
	)
	{
		return false;
	}


	pnw = this.zone.pnw;

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

	doc = this.doc;

	para = this.getParaAtPoint( pi );

	// FIXME move into para
	if( para )
	{
		ppnw = doc.getPNW( para.key );

		at =
			para.getPointOffset(
				this,
				pi.sub( ppnw )
			);

		root.setMark(
			marks_caret.create(
				'path', para.textPath,
				'at', at
			)
		);
	}
	else
	{
		para = doc.atRank( doc.ranks.length - 1 );

		root.setMark(
			marks_caret.create(
				'path', para.textPath,
				'at', para.text.length
			)
		);
	}

	return true;
};


/*
| A text has been inputed.
*/
docItem.prototype.input =
	function(
		text
	)
{
	return this.doc.input( text, this );
};


/*
| Handles a special key.
*/
docItem.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	return (
		this.doc.specialKey(
			key,
			this,
			shift,
			ctrl
		)
	);
};


} )( );
