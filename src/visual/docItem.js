/*
| An item with a document.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './item';


const action_none = require( '../action/none' );

const action_select = require( '../action/select' );

const limit = require( '../math/root' ).limit;

const result_hover = require( '../result/hover' );

const visual_item = require( '../visual/item' );

const visual_mark_caret = require( './mark/caret' );

const visual_mark_range = require( './mark/range' );

const visual_mark_text = require( './mark/text' );


/*
| The attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	return(
		this.zone( ).pos.y
		+ limit(
			0,
			this.doc.attentionCenter - ( this.scrollPos ?  this.scrollPos.y : 0 ),
			this.zone( ).height
		)
	);
};


/*
| Checks if the item is being clicked and reacts.
*/
def.proto.click =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl,    // true if ctrl or meta key was held down
		mark     // mark of the visual space
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/}

	if( !this.pointWithin( p ) ) return;

	if( ctrl ) return this._ctrlClick( p, shift, mark );

	if( this.access != 'rw' ) return false;

	root.setUserMark( this.markForPoint( p, shift, mark ) );

	return true;
};


/*
| Handles a potential dragStart event.
*/
def.proto.dragStart =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl     // true if ctrl or meta key was held down
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	const sbary = this.scrollbarY;

	const action = this.action;

	if( action.timtype === action_none && sbary )
	{
		const bubble = sbary.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	if( action.timtype === action_select )
	{
		if( !this.pointWithin( p ) ) return false;

		const mark = this.markForPoint( p, false );

		root.create( 'action', action.create( 'itemPath', this.path ) );

		root.setUserMark( mark );

		return true;
	}

	return visual_item.dragStart.call( this, p, shift, ctrl );
};



/*
| Returns the mark for a point
*/
def.proto.markForPoint =
	function(
		p,       // the point to mark to
		doRange  // if true possible make a range
	)
{
	const tp = p.detransform( this.transform );

	const pos = this.zone( ).pos;

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
		return visual_mark_caret.pathAt( para.textPath, at );
	}
};


/*
| A move during a text select on this item.
*/
def.proto.moveSelect =
	function(
		p
	)
{
	root.setUserMark( this.markForPoint( p, true ) );

	this.scrollMarkIntoView( );
};


/*
| User is hovering their pointing device over something.
*/
def.proto.pointingHover =
	function(
		p,     // point hovered upon
		action // space action
	)
{
	const sbary = this.scrollbarY;

	if( sbary )
	{
		const bubble = sbary.pointingHover( p );

		if( bubble ) return bubble;
	}

	if( !this.pointWithin( p ) ) return;

	let cursor = 'default';

	switch( action.timtype )
	{
		case action_select : cursor = 'text'; break;
	}

	return result_hover.create( 'path', this.path, 'cursor', cursor );
};


/*
| A text has been inputed.
*/
def.proto.input =
	function(
		text
	)
{
	return this.doc.input( text );
};


/*
| Handles a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	return this.doc.specialKey( key, shift, ctrl );
};


} );
