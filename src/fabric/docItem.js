/*
| An item with a document.
*/


/*
| Export
*/
var
	fabric_docItem,
	fabric_item;


/*
| Imports
*/
var
	jools,
	mark_caret,
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
fabric_docItem =
	function( )
{
	// initializing abstract.
	throw new Error( );
};


// FIXME this is ugly
if( !SERVER )
{
	jools.subclass( fabric_docItem, fabric_item );
}


/*
| Sets the items position and size after an action.
*/
fabric_docItem.prototype.dragStop =
	function(
		view,
		p
	)
{
	return(
		fabric_item.prototype.dragStop.call(
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
	fabric_docItem.prototype,
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
fabric_docItem.prototype.getParaAtPoint =
	function(
		p
	)
{
	if( p.y < this.doc.innerMargin.n )
	{
		return null;
	}

	return this.doc.getParaAtPoint( p );
};


/*
| Sees if this item is being clicked.
*/
fabric_docItem.prototype.click =
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

		at = para.getPointOffset( this, pi.sub( ppnw ) );

		root.create(
			'mark',
				mark_caret.create(
					'path', para.textPath,
					'at', at
				)
		);
	}
	else
	{
		para = doc.atRank( doc.ranks.length - 1 );

		root.create(
			'mark',
				mark_caret.create(
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
fabric_docItem.prototype.input =
	function(
		text
	)
{
	return this.doc.input( text, this );
};


/*
| Handles a special key.
*/
fabric_docItem.prototype.specialKey =
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
