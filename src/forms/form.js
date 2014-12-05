/*
| A form.
*/


var
	forms_form,
	euclid_view,
	jion,
	jools,
	marks,
	result,
	root,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


forms_form =
	function( )
{
	// initializing abstract
	throw new Error( );
};


/*
| Constructor
*/
forms_form.init =
	function(
		// inherit
	)
{
	var
		focusAccent,
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

	this.frame =
		this.view.baseFrame;

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

		focusAccent = false;

		// FIXME only when not having widgetProto
		path = this.path.append( 'twig' ).append( name );

		if( widgetProto.focusable )
		{
			if( !mark || mark.widgetPath.isEmpty )
			{
				focusAccent = false;
			}
			else
			{
				focusAccent =
					mark.widgetPath.get( 4 ) === name;
			}
		}

		twig[ name ] =
			widgetProto.create(
				'path',
					path,
				'superFrame',
					this.frame,
				'focusAccent',
					focusAccent,
				'hover',
					this.hover,
				'mark',
					this.mark
			);
	}

	this.twig = twig;
};


/*
| Returns the mark if a form with 'path' concerns about
| 'mark'.
*/
forms_form.concernsMark =
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
		: null
	);
};


/*
| The disc is shown while a form is shown.
*/
forms_form.prototype.showDisc = true;


/*
| Returns the focused item.
*/
forms_form.prototype._focusedWidget =
	function( )
{
	var
		mark,
		path;

	mark = this.mark;

	if( !mark )
	{
		return null;
	}

	path = mark.widgetPath;

	if( path.length === 0 )
	{
		return null;
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
| Draws the form.
*/
forms_form.prototype.draw =
	function(
		display
	)
{
	var
		r,
		ranks;

	display.paint(
		theme.forms.style,
		display.silhoutte,
		euclid_view.proper
	);

	ranks = this.ranks;

	for(
		r = ranks.length - 1;
		r >= 0;
		r--
	)
	{
		this.atRank( r ).draw( display );
	}
};


/*
| Moving during an operation with the mouse button held down.
*/
forms_form.prototype.dragMove =
	function(
		// p
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| Stops an operation with the mouse button held down.
*/
forms_form.prototype.dragStop =
	function(
		//p,
		//shift,
		//ctrl
	)
{
	return true;
};


/*
| Returns true if point is on this panel.
*/
forms_form.prototype.pointingHover =
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
		res =
			this.atRank( r ).pointingHover(
				p,
				shift,
				ctrl
			);

		if( res )
		{
			return res;
		}
	}

	return(
		result.hover.create(
			'path',
				jion.path.empty,
			'cursor',
				'default'
		)
	);
};


/*
| User clicked
*/
forms_form.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		ranks,
		res;

	ranks = this.ranks;

	for(
		var r = 0, rZ = ranks.length;
		r < rZ;
		r++
	)
	{
		res =
			this.atRank( r ).click(
				p,
				shift,
				ctrl
			);

		if( res !== null )
		{
			return res;
		}
	}

	return false;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
forms_form.prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| User is inputing text.
*/
forms_form.prototype.input =
	function(
		text
	)
{
	var
		widget;

	widget = this._focusedWidget( );

	if( !widget )
	{
		return;
	}

	widget.input( text );
};


/*
| Cycles the focus
*/
forms_form.prototype.cycleFocus =
	function(
		dir
	)
{
	var
		len,
		name,
		path,
		rank,
		ranks,
		rs,
		ve;
		
	path = this.mark.widgetPath;

	if( path.isEmpty )
	{
		return;
	}

	ranks = this.ranks,

	rank = this.rankOf( path.get( 4 ) );

	len = ranks.length;

	rs = rank;

	while( true )
	{
		rank = ( rank + dir + len ) % len;

		if( rank === rs )
		{
			break;
		}

		name = ranks[ rank ];

		ve = this.twig[ name ];

		if(
			ve.focusable
			&&
			ve.visible !== false
		)
		{
			if( ve.caretable )
			{
				root.setMark(
					marks.caret.create(
						'path',
							ve.path,
						'at',
							0
					)
				);
			}
			else
			{
				root.setMark(
					marks.widget.create(
						'path',
							ve.path
					)
				);
			}

			break;
		}
	}
};


/*
| User is pressing a special key.
*/
forms_form.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		item;

	item = this._focusedWidget( );

	if( !item )
	{
		return;
	}

	if( key === 'tab' )
	{
		this.cycleFocus(
			shift ? -1 : 1
		);

		return;
	}

	item.specialKey(
		key,
		this,
		shift,
		ctrl
	);
};


/*
| A button of the form has been pushed.
*/
forms_form.prototype.pushButton =
	function(
		// buttonName
	)
{
	// should be overloaded
	throw new Error( );
};


/*
| Mouse wheel
*/
forms_form.prototype.mousewheel =
	function(
		// p,
		// dir,
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| Returns the path of a widget
|
| FIXME make this go away.
*/
forms_form.prototype._widgetPath =
	function(
		widgetName
	)
{
	var
		path;

	path = this.twig[ widgetName ].path;

	if( !path )
	{
		// at startup the path might still be null
		return this.path.append( 'twig' ).append( widgetName );
	}

	return path;
};


/*
| The attention center.
*/
jools.lazyValue(
	forms_form.prototype,
	'attentionCenter',
	function( )
	{
		var
			focus;

		focus = this._focusedWidget( );

		if( !focus )
		{
			return null;
		}

		return focus.attentionCenter;
	}
);


} )( );
