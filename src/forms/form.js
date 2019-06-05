/*
| Abstract parent of forms.
*/
'use strict';


tim.define( module, ( def, forms_form ) => {


def.abstract = true;


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types' ] },

		// space has grid
		// FIXME rename spaceHasGrid
		hasGrid : { type : 'undefined' },

		// space has snapping
		// FIXME rename spaceHasSnapping
		hasSnapping : { type : 'undefined' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types'] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : 'undefined' },

		// trace of the form
		// FIXME remove undefined
		trace : { type : [ 'undefined', '../trace/form' ] },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const action_none = tim.require( '../action/none' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_transform = tim.require( '../gleam/transform' );

const gruga_formFacet = tim.require( '../gruga/formFacet' );

const result_hover = tim.require( '../result/hover' );

const mark_caret = tim.require( '../mark/caret' );

const mark_pat = tim.require( '../mark/pat' );

const mark_widget = tim.require( '../mark/widget' );

const widget_scrollbox = tim.require( '../widget/scrollbox' );


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
		path,
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

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
			root.alter(
				'mark',
					ve.caretable
					? mark_caret.create(
						'pat', mark_pat.createPathAt( ve.path, 0 ),
						'offset', ve.trace.appendOffset( 0 )
					)
					: mark_widget.create( 'path', ve.path, 'trace', ve.trace )
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
	for( let widget of this )
	{
		const bubble = widget.click( p, shift, ctrl );

		if( bubble ) return bubble;
	}

	return false;
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
	for( let widget of this )
	{
		const bubble = widget.dragStart( p, shift, ctrl );

		if( bubble ) return bubble;
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
	root.alter( 'action', action_none.singleton );
};


/*
| Transforms widgets.
| FUTURE proper inherit
*/
def.adjust.get =
def.static.adjustGet =
	function(
		name,
		widget
	)
{
	const transform =
		gleam_transform.create(
			'zoom', 1,
			'offset', this.viewSize.zeroRect.pc
		);

	const path = widget.path || this.path.append( 'twig' ).append( name );

	const trace = this.trace.appendWidget( name );

	const mark = widget.concernsMark( this.mark, path, trace );

	const hover = widget.concernsHover( this.hover, path );

	widget =
		widget.create(
			'hover', hover,
			'mark', mark,
			'path', path,
			'trace', trace,
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

	if( focus ) return focus.attentionCenter;
};


/*
| Returns the focused widget.
*/
def.lazy.focusedWidget =
	function( )
{
	const mark = this.mark;

	if( !mark ) return;

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
	const arr =
		[ gleam_glint_paint.createFacetShape( gruga_formFacet.model, this.viewSize.zeroRect ) ];

	for( let s of this.reverse( ) )
	{
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
	for( let widget of this )
	{
		const bubble = widget.mousewheel( p, dir, shift, ctrl );

		if( bubble ) return bubble;
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
	for( let widget of this )
	{
		const bubble = widget.pointingHover( p, shift, ctrl );

		if( bubble ) return bubble;
	}

	return result_hover.cursorDefault;
};


/*
| User is pressing a special key.
*/
def.static.specialKey =
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


} );
