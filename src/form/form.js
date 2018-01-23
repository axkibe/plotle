/*
| A form.
*/
'use strict';

var
	action_scrolly,
	form_form,
	gleam_glint_list,
	gleam_glint_paint,
	gleam_transform,
	gruga_formFacet,
	result_hover,
	visual_mark_caret,
	visual_mark_widget;


form_form = { };


/*
| Initializer.
*/
form_form.init =
	function(
		twigDup
	)
{
	// this is an abstract design form
	// FUTURE use abstract( )
	if( !this.path ) return;

	this.area = this.viewSize.zeroRect;

	// all components of the form
	const twig = twigDup ? this._twig :  tim.copy( this._twig );

	const ranks = this._ranks;

	const transform =
		gleam_transform.create(
			'zoom', 1,
			'offset', this.area.pc
		);

	for( let r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		const name = ranks[ r ];

		const widgetProto = twig[ name ];

		const path =
			widgetProto.path
			|| this.path.append( 'twig' ).append( name );

		twig[ name ] =
			widgetProto.create(
				'path', path,
				'hover', this.hover,
				'mark', this.mark,
				'transform',
					path.get( 2 ) !== 'moveTo'
					? transform
					: gleam_transform.normal
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*
| User clicked.
*/
form_form.click =
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
form_form.concernsMark =
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
form_form.cycleFocus =
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
					? visual_mark_caret.create( 'path', ve.path, 'at', 0 )
					: visual_mark_widget.create( 'path', ve.path )
			);

			break;
		}
	}
};


/*
| User clicked.
*/
form_form.click =
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
form_form.dragMove =
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
form_form.dragStart =
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
form_form.dragStop =
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
form_form.getAttentionCenter =
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
form_form.getFocusedWidget =
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
form_form.glint =
	function( )
{
	const arr =
		[
			gleam_glint_paint.create(
				'facet', gruga_formFacet.model,
				'shape', this.area
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
form_form.input =
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
form_form.mousewheel =
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
form_form.pointingHover =
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
form_form.specialKey =
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
form_form._moveScrollY =
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

