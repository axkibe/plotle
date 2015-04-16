/*
| An item with a document.
*/


var
	fabric_docItem,
	mark_caret,
	math_limit,
	root;


/*
| Capsule
*/
( function() {
'use strict';


/*
| Node includes.
*/
if( NODE )
{
	fabric_docItem = module.exports;
}
else
{
	fabric_docItem = { };
}


/*
| The attention center.
*/
fabric_docItem.attentionCenter =
	function( )
{
	return(
		this.zone.pnw.y
		+ math_limit(
			0,
			this.doc.attentionCenter
			- ( this.scrollbarY ?  this.scrollbarY.pos : 0 ),
			this.zone.height
		)
	);
};


/*
| Checks if the item is being clicked and reacts.
*/
fabric_docItem.click =
	function(
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
		vp,
		view;

	view = this.view;

	if( access != 'rw' )
	{
		return false;
	}

	vp = view.depoint( p );

	// FUTURE rework views
	if( !this.zone.within( view, p ) )
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
					? this.scrollbarY.pos
					: 0
				)
		);

	doc = this.doc;

	para = doc.getParaAtPoint( pi );

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
fabric_docItem.input =
	function(
		text
	)
{
	return this.doc.input( text );
};


/*
| Handles a special key.
*/
fabric_docItem.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	return this.doc.specialKey( key, this, shift, ctrl );
};


} )( );
