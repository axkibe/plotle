/*
| An item with a document.
*/


var
	action_scrolly,
	jion$pathRay,
	math_limit,
	result_hover,
	root,
	visual_item,
	visual_docItem,
	visual_mark_caret,
	visual_mark_range,
	visual_mark_text;


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
		this.zone.pos.y
		+ math_limit(
			0,
			this.doc.attentionCenter
			- ( this.scrollPos ?  this.scrollPos.y : 0 ),
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
		access
	)
{
	var
		mark;

	if( !this.tShape.within( p ) ) return;

	if( access != 'rw' ) return false;

	mark = this.markForPoint( p, shift );

	root.create( 'mark', mark );

	return true;
};


/*
| Handles a potential dragStart event for this item.
*/
visual_docItem.dragStart =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl,    // true if ctrl or meta key was held down
		access,  // current space access rights
		action   // current space action
	)
{
	var
		aType,
		mark,
		sbary;

	sbary = this.scrollbarY;

	aType = action && action.reflect;

	if(
		!this.action
		&& sbary
		&& sbary.within( p )
	)
	{
		root.create(
			'action',
				action_scrolly.create(
					'itemPaths',
						jion$pathRay.create( 'ray:append', this.path ),
					'startPoint', p,
					'startPos', sbary.scrollpos
				)
		);

		return true;
	}

	if( aType === 'action_select' )
	{
		if( !this.tShape.within( p ) ) return false;

		mark = this.markForPoint( p, false );

		action = action.create( 'itemPath', this.path );

		root.create( 'action', action, 'mark', mark );

		return true;
	}

	return visual_item.dragStart.call( this, p, shift, ctrl, access, action );
};



/*
| Returns the mark for a point
*/
visual_docItem.markForPoint =
	function(
		p,       // the point to mark to
		doRange  // if true possible make a range
)
{
	var
		at,
		doc,
		mark,
		para,
		pos,
		pi,
		tp;

	tp = p.detransform( this.transform );

	pos = this.zone.pos;

	pi = tp.sub( pos );

	doc = this.doc;

	para = doc.getParaAtPoint( pi );

	if( para )
	{
		at = para.getPointOffset( pi.sub( para.pos ) );
	}
	else
	{
		para = doc.atRank( doc.length - 1 );

		at = para.text.length;
	}

	mark = this.mark;

	if( doRange && mark && mark.reflect === 'visual_mark_caret' )
	{
		return(
			visual_mark_range.create(
				'doc', this.doc.fabric,
				'beginMark', mark.textMark,
				'endMark',
					visual_mark_text.create(
						'path', para.textPath,
						'at', at
					)
			)
		);
	}
	else if( doRange && mark && mark.reflect === 'visual_mark_range' )
	{
		return(
			mark.create(
				'endMark',
					visual_mark_text.create(
						'path', para.textPath,
						'at', at
					)
			)
		);
	}
	else
	{
		return(
			visual_mark_caret.create(
				'path', para.textPath,
				'at', at
			)
		);
	}
};


/*
| A move during a text select on this item.
*/
visual_docItem.moveSelect =
	function(
		p
	)
{
	var
		mark;

	mark = this.markForPoint( p, true );

	root.create( 'mark', mark );

	this.scrollMarkIntoView( );
};


/*
| User is hovering their pointing device over something.
*/
visual_docItem.pointingHover =
	function(
		p,     // point hovered upon
		action // space action
	)
{
	var
		cursor,
		sbary;

	sbary = this.scrollbarY;

	if( sbary && sbary.within( p ) )
	{
		return(
			result_hover.create(
				'path', this.path,
				'cursor', 'ns-resize'
			)
		);
	}

	if( !this.tShape.within( p ) ) return;

	cursor = 'default';

	switch( action && action.reflect )
	{
		case 'action_select' : cursor = 'text'; break;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', cursor
		)
	);
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
