/*
| An item with a document.
*/


var
	action_select,
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
	if( !this.tShape.within( p ) ) return;

	if( access != 'rw' ) return false;

	root.create( 'mark', this.markForPoint( p, shift ) );

	return true;
};


/*
| Handles a potential dragStart event.
|
| FIXME access and action should be needed to handed...
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
	const sbary = this.scrollbarY;

	if( !this.action && sbary )
	{
		const bubble = sbary.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	if( action && action.timtype === action_select )
	{
		if( !this.tShape.within( p ) ) return false;

		const mark = this.markForPoint( p, false );

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
	const tp = p.detransform( this.transform );

	const pos = this.zone.pos;

	const pi = tp.sub( pos );

	const doc = this.doc;

	let para = doc.getParaAtPoint( pi );

	let at;

	if( para )
	{
		at = para.getPointOffset( pi.sub( para.pos ) );
	}
	else
	{
		para = doc.atRank( doc.length - 1 );

		at = para.text.length;
	}

	const mark = this.mark;

	if( doRange && mark && mark.timtype === visual_mark_caret )
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
	else if( doRange && mark && mark.timtype === visual_mark_range )
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
	root.create( 'mark', this.markForPoint( p, true ) );

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
		bubble,
		cursor,
		sbary;

	sbary = this.scrollbarY;

	if( sbary )
	{
		bubble = sbary.pointingHover( p );

		if( bubble ) return bubble;
	}

	if( !this.tShape.within( p ) ) return;

	cursor = 'default';

	switch( action && action.timtype )
	{
		case action_select : cursor = 'text'; break;
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
