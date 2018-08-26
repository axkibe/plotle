/*
| A form.
*/
'use strict';


tim.define( module, ( def, form_form ) => {


const action_scrolly = require( '../action/scrolly' );

const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_transform = require( '../gleam/transform' );

const gruga_formFacet = require( '../gruga/formFacet' );

const result_hover = require( '../result/hover' );

const visual_mark_caret = require( '../visual/mark/caret' );

const visual_mark_widget = require( '../visual/mark/widget' );


/*
| Initializer.
*/
def.static.init =
	function( )
{
	// FIXME XXX remove
};


/*
| Transforms widgets.
*/
def.static.transform =
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

	return(
		widget.create(
			'path', path,
			'hover', this.hover,
			'mark', this.mark,
			'transform', this.path.get( 2 ) !== 'moveTo' ? transform : gleam_transform.normal
		)
	);
};


/*
| User clicked.
*/
def.static.click =
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
| Returns the mark if a form with 'path' concerns about
| 'mark'.
*/
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark ) return mark;

	return(
		mark.containsPath( path )
		? mark
		: undefined
	);
};


/*
| Cycles the focus
*/
def.static.cycleFocus =
	function(
		dir
	)
{
	const length = this.length;

	const path = this.mark.widgetPath;

	if( path.isEmpty ) return;

	let rank = this.rankOf( path.get( 4 ) );

	const rs = rank;

	while( true )
	{
		rank = ( rank + dir + length ) % length;

		if( rank === rs ) break;

		const ve = this.atRank( rank );

		if( ve.focusable && ve.visible !== false )
		{
			root.create(
				'mark',
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
def.static.click =
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
def.static.dragMove =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	const action = this.action;

	if( !action ) return 'pointer';

	switch( action.timtype )
	{
		case action_scrolly :

			form_form._moveScrollY.call( this, p, shift, ctrl );

			return;

		default : throw new Error( );
	}
};


/*
| Starts an operation with the pointing device held down.
*/
def.static.dragStart =
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
def.static.dragStop =
	function(
		//p,     // cursor point
		//shift, // true if shift key was pressed
		//ctrl   // true if ctrl key was pressed
	)
{
	root.create( 'action', undefined );
};


/*
| Returns the attention center.
|
| To be used as lazyValue getter.
*/
def.static.getAttentionCenter =
	function( )
{
	const focus = this.focusedWidget;

	return(
		focus
		? focus.attentionCenter
		: undefined
	);
};


/*
| Returns the focused widget.
*/
def.static.getFocusedWidget =
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
def.static.glint =
	function( )
{
	const arr =
		[
			gleam_glint_paint.create(
				'facet', gruga_formFacet.model,
				'shape', this.viewSize.zeroRect
			)
		];

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
def.static.input =
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
def.static.mousewheel =
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
def.static.pointingHover =
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

	return result_hover.create( 'cursor', 'default' );
};


/*
| User is pressing a special key.
*/
def.static.specialKey =
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

