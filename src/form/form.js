/*
| A form.
*/


var
	form_form,
	gleam_glint_paint,
	gleam_glint_ray,
	gruga_formFacet,
	jion,
	result_hover,
	visual_mark_caret,
	visual_mark_widget;


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
		twigDup
	)
{
	var
		a,
		aZ,
		mark,
		name,
		path,
		ranks,
		twig,
		widgetProto;

	// this is an abstract design form
	// FUTURE use abstract( )
	if( !this.path ) return;

	this.area = this.viewSize.zeroPnwRect;

	// all components of the form
	twig = twigDup ? this._twig :  jion.copy( this._twig );

	mark = this.mark;

	ranks = this._ranks;

	for( a = 0, aZ = ranks.length; a < aZ; a++ )
	{
		name = ranks[ a ];

		widgetProto = twig[ name ];

		path =
			widgetProto.path
			|| this.path.append( 'twig' ).append( name );

		twig[ name ] =
			widgetProto.create(
				'path', path,
				'superArea', this.area,
				'hover', this.hover,
				'mark', this.mark,
				'transform', this.transform
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
	var
		r,
		rZ,
		res;

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).click( p, shift, ctrl );

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
		rs,
		ve;

	length = this.length;

	path = this.mark.widgetPath;

	if( path.isEmpty ) return;

	rank = this.rankOf( path.get( 4 ) );

	rs = rank;

	while( true )
	{
		rank = ( rank + dir + length ) % length;

		if( rank === rs ) break;

		ve = this.atRank( rank );

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

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 ) throw new Error( );
/**/
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.get( path.get( 4 ) );
};


/*
| Return the space glint.
*/
form_form.glint =
	function( )
{
	var
		gLen,
		gRay,
		r,
		s,
		sg;

	gRay =
		[
			gleam_glint_paint.create(
				'facet', gruga_formFacet,
				'shape', this.area
			)
		];

	gLen = 1;

	for( r = this.length - 1; r >= 0; r-- )
	{
		s = this.atRank( r );

		sg = s.glint;

		if( sg ) gRay[ gLen++ ] = sg;
	}

	return gleam_glint_ray.create( 'ray:init', gRay );
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

	if( widget ) widget.input( text );
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

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).pointingHover( p, shift, ctrl );

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

	widget.specialKey( key, shift, ctrl );
};


} )( );
