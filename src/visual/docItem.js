/*
| An item with a document.
*/


var
	math_limit,
	root,
	visual_docItem,
	visual_mark_caret;


/*
| Capsule
*/
( function() {
'use strict';


visual_docItem = NODE ? module.exports : { };


/*
| The attention center.
*/
visual_docItem.attentionCenter =
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
visual_docItem.click =
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

	vp = p.fromView( view );

	if( !this.vZone.within( p ) ) return false;

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

		at = para.getPointOffset( pi.sub( ppnw ) );

		root.create(
			'mark',
				visual_mark_caret.create(
					'path', para.textPath,
					'at', at
				)
		);
	}
	else
	{
		para = doc.atRank( doc.length - 1 );

		root.create(
			'mark',
				visual_mark_caret.create(
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
visual_docItem.input =
	function(
		text
	)
{
	return this.doc.input( text );
};


/*
| Handles a special key.
*/
visual_docItem.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	return this.doc.specialKey( key, shift, ctrl );
};


} )( );
