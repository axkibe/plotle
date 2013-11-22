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
		doc,
		mark
	)
{
	Visual.Item.call(
		this,
		tree,
		path
	);

	this.sub =
		{
			doc :
				doc
		};

	this.mark =
		mark;
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


	shell.redraw =
		true;

//	shell.d_eselect( ); TODO

	var
		pnw =
			this.zone.pnw,

		pi =
			vp.sub(
				pnw.x,
				pnw.y -
					(
						this.scrollbarY ?
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

			at1 =
				para.getPointOffset(
					this,
					pi.sub( ppnw )
				);

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				para.textPath,
			'at1',
				at1
		);
	}
	else
	{
		para =
			doc.atRank( doc.ranks.length - 1 );

		shell.userMark(
			'set',
			'type',
				'caret',
			'section',
				'space',
			'path',
				para.textPath,
			'at1',
				para.text.length
		);
	}

	return true;
};


} )( );
