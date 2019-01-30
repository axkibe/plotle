/*
| Abstract parent of forms.
*/
'use strict';


tim.define( module, ( def, form_form ) => {


def.abstract = true;


const action_none = require( '../action/none' );

const action_scrolly = require( '../action/scrolly' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_transform = require( '../gleam/transform' );

const gruga_formFacet = require( '../gruga/formFacet' );

const result_hover = require( '../result/hover' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_widget = require( '../visual/mark/widget' );

const widget_scrollbox = require( '../widget/scrollbox' );


/*
| By default forms don't care about 'hasGrid'.
*/
def.static.concernsHasGrid =
def.proto.concernsHasGrid =
	( ) => undefined;


/*
| By default forms don't care about 'hasSnapping'.
*/
def.static.concernsHasSnapping =
def.proto.concernsHasSnapping =
	( ) => undefined;



/*
| Returns the mark if a form with 'path' concerns about
| 'mark'. This is the same for all forms.
*/
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark ) return mark;

	return mark.containsPath( path ) ? mark : undefined;
};


/*
| By default forms don't care about 'spaceRef'.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( ) => undefined;


/*
| By default forms don't care about 'user'.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( ) => undefined;


/*
| By default forms don't care about 'userSpaceList'.
*/
def.static.concernsUserSpaceList =
def.proto.concernsUserSpaceList =
	( ) => undefined;


/*
| Cycles the focus.
*/
def.proto.cycleFocus =
	function(
		dir
	)
{
	const length = this.length;

	const path = this.mark.widgetPath;

	if( path.isEmpty ) return;

	let rank = this.rankOf( path.get( 4 ) );

	const rs = rank;

	for(;;)
	{
		rank = ( rank + dir + length ) % length;

		if( rank === rs ) break;

		const ve = this.atRank( rank );

		if( ve.focusable && ve.visible !== false )
		{
			root.setUserMark(
				ve.caretable
				? visual_mark_caret.pathAt( ve.path, 0 )
				: visual_mark_widget.create( 'path', ve.path )
			);

			break;
		}
	}
};


/*
| User clicked.
*/
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).click( p, shift, ctrl );

		if( res ) return res;
	}

	return false;
};


/*
| Moving during an operation with the pointing device button held down.
*/
def.proto.dragMove =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	switch( this.action.timtype )
	{
		case action_none : return 'pointer';

		case action_scrolly :

			form_form._moveScrollY.call( this, p, shift, ctrl );

			return;

		default : throw new Error( );
	}
};


/*
| Starts an operation with the pointing device held down.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).dragStart( p, shift, ctrl );

		if( res ) return res;
	}

	return false;
};


/*
| Stops an operation with the poiting device button held down.
*/
def.proto.dragStop =
	function(
		//p,     // cursor point
		//shift, // true if shift key was pressed
		//ctrl   // true if ctrl key was pressed
	)
{
	root.create( 'action', action_none.create( ) );
};


/*
| Transforms widgets.
| FIXME proper inherit
*/
def.adjust.get =
def.static.adjustGet =
	function(
		name,
		widget
	)
{
	// FIXME make this some lazy value
	const transform =
		gleam_transform.create(
			'zoom', 1,
			'offset', this.viewSize.zeroRect.pc
		);

	const path = widget.path || this.path.append( 'twig' ).append( name );

	const mark = widget.concernsMark( this.mark, path );

	const hover = widget.concernsHover( this.hover, path );

	widget =
		widget.create(
			'path', path,
			'hover', hover,
			'mark', mark,
			'transform', this.path.get( 2 ) !== 'moveTo' ? transform : gleam_transform.normal
		);

	if( widget.timtype !== widget_scrollbox ) return widget;

	const sp = widget.fixScrollPos;

	if( sp !== pass ) widget = widget.create( 'scrollPos', sp );

	return widget;
};


/*
| Returns the attention center.
*/
def.lazy.attentionCenter =
	function( )
{
	const focus = this.focusedWidget;

	return focus ? focus.attentionCenter : undefined;
};


/*
| Returns the focused widget.
*/
def.lazy.focusedWidget =
	function( )
{
	const mark = this.mark;

	if( !mark ) return undefined;

	const path = mark.widgetPath;

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 ) throw new Error( );
/**/}

	return this.get( path.get( 4 ) );
};


/*
| Return the space glint.
*/
def.lazy.glint =
	function( )
{
	const arr = [ gleam_glint_paint.createFS( gruga_formFacet.model, this.viewSize.zeroRect ) ];

	for( let r = this.length - 1; r >= 0; r-- )
	{
		const s = this.atRank( r );

		const sg = s.glint;

		if( sg ) arr.push( sg );
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| User is inputing text.
*/
def.proto.input =
	function(
		text
	)
{
	const widget = this.focusedWidget;

	if( widget ) widget.input( text );
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).mousewheel( p, dir, shift, ctrl );

		if( res ) return res;
	}

	return false;
};


/*
| If point is on the form returns its hovering state.
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	for( let r = 0, rZ = this.length; r < rZ; r++ )
	{
		const res = this.atRank( r ).pointingHover( p, shift, ctrl );

		if( res ) return res;
	}

	return result_hover.cursorDefault;
};


/*
| User is pressing a special key.
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	const widget = this.focusedWidget;

	if( !widget ) return;

	if( key === 'tab' )
	{
		this.cycleFocus( shift ? -1 : 1 );

		return;
	}

	widget.specialKey( key, shift, ctrl );
};


/*
| Moves during scrolling.
*/
def.static._moveScrollY =
	function(
		p         // point of stop
		// shift, // true if shift key was pressed
		// ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	const wPath = action.scrollPath;

	const widget = root.getPath( wPath );

	const dy = p.y - action.startPoint.y;

	const sbary = widget.scrollbarY;

	const spos = action.startPos + sbary.scale( dy );

	root.setPath(
		wPath.append( 'scrollPos' ),
		widget.scrollPos.create( 'y', spos )
	);
};


} );
