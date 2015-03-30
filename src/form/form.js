/*
| A form.
*/


var
	form_form,
	euclid_view,
	gruga_formFacet,
	jools,
	mark_caret,
	mark_widget,
	result_hover;


/*
| Capsule
*/
( function( ) {
'use strict';


form_form = { };


/*
| Constructor
*/
form_form.init =
	function(
		// inherit
	)
{
	var
		mark,
		name,
		path,
		ranks,
		twig,
		widgetProto;

	if( !this.path )
	{
		// this is an abstract
		// design mode form
		return;
	}

	this.frame = this.view.baseFrame;

	// all components of the form
	// FIXME do not copy if this.twig !== inherit.twig
	twig = jools.copy( this.twig );

	mark = this.mark;

	ranks = this.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		name = ranks[ a ];

		widgetProto = twig[ name ];

		// FIXME only when not having widgetProto
		path = this.path.append( 'twig' ).append( name );

		twig[ name ] =
			widgetProto.create(
				'path', path,
				'superFrame', this.frame,
				'hover', this.hover,
				'mark', this.mark
			);
	}

	this.twig = twig;
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
	var
		r,
		rZ,
		ranks,
		res;

	ranks = this.ranks;

	for(
		r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		res = this.atRank( r ).click( p, shift, ctrl );

		if( res )
		{
			return res;
		}
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
	if( !mark )
	{
		return mark;
	}

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
	var
		length,
		path,
		rank,
		ranks,
		rs,
		ve;

	length = this.length;

	path = this.mark.widgetPath;

	if( path.isEmpty )
	{
		return;
	}

	ranks = this.ranks,

	rank = this.rankOf( path.get( 4 ) );

	rs = rank;

	while( true )
	{
		rank = ( rank + dir + length ) % length;

		if( rank === rs )
		{
			break;
		}

		ve = this.atRank( rank );

		if( ve.focusable && ve.visible !== false )
		{
			root.create(
				'mark',
					ve.caretable
					? mark_caret.create( 'path', ve.path, 'at', 0 )
					: mark_widget.create( 'path', ve.path )
			);

			break;
		}
	}
};


/*
| Draws a form.
*/
form_form.draw =
	function(
		display
	)
{
	var
		r;

	display.fill(
		gruga_formFacet.fill,
		display.silhoutte,
		euclid_view.proper
	);

	for(
		r = this.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( display );
	}
};


/*
| Returns the attention center.
|
| To be used as lazyValue getter.
*/
form_form.getAttentionCenter =
	function( )
{
	var
		focus;

	focus = this.focusedWidget;

	return(
		focus
		? focus.attentionCenter
		: undefined
	);
};


/*
| Returns the focused widget.
|
| To be used as lazyValue getter.
*/
form_form.getFocusedWidget =
	function( )
{
	var
		mark,
		path;

	mark = this.mark;

	if( !mark )
	{
		return undefined;
	}

	path = mark.widgetPath;

	if( path.length === 0 ) // FIXME
	{
		return undefined;
	}

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.twig[ path.get( 4 ) ];
};


/*
| User is inputing text.
*/
form_form.input =
	function(
		text
	)
{
	var
		widget;

	widget = this.focusedWidget;

	if( widget )
	{
		widget.input( text );
	}
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
	var
		r,
		rZ,
		res;

	for(
		r = 0, rZ = this.length;
		r < rZ;
		r++
	)
	{
		res = this.atRank( r ).pointingHover( p, shift, ctrl );

		if( res )
		{
			return res;
		}
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
	var
		widget;

	widget = this.focusedWidget;

	if( !widget )
	{
		return;
	}

	if( key === 'tab' )
	{
		this.cycleFocus( shift ? -1 : 1 );

		return;
	}

	widget.specialKey( key, this, shift, ctrl );
};


} )( );
