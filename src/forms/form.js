/*
| A form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Euclid,
	HoverReply,
	Jools,
	Mark,
	Path,
	shell,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';


var Form =
Forms.Form =
	function( )
{
	throw new Error(
		CHECK && 'initializing abstract'
	);
};

/*
| Constructor
*/
Form.init =
	function(
		inherit,
		traitSet
	)
{
	if( !this.path )
	{
		// this is an abstract
		// design mode form
		return;
	}

	this.frame =
		this.view.baseFrame;

	// all components of the form
	var
		twig =
			// FIXME do not copy if this.twig !== inherit.twig
			Jools.copy( this.twig ),
		ranks =
			this.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],
			widgetProto =
				twig[ name ],
			path,
			focusAccent =
				false;

		// FIXME only when not having widgetProto
		path =
			this.path.append( 'twig' ).append( name );

		if( widgetProto.focusable )
		{
			if( this.mark.widgetPath.isEmpty )
			{
				focusAccent =
					false;
			}
			else
			{
				focusAccent =
					this.mark.widgetPath.get( 4 ) === name;
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
				'hoverAccent',
					path.equals( this.hover ),
				'traitSet',
					traitSet,
				'mark',
					this.mark
			);
	}

	this.twig =
		twig;
};


/*
| Returns the mark if a form with 'path' concerns about
| 'mark'.
*/
Form.concernsMark =
	function(
		mark,
		path
	)
{
	if( !mark )
	{
		return mark;
	}

	if( mark.containsPath( path ) )
	{
		return mark;
	}
	else
	{
		return Mark.Vacant.create( );
	}
};


/*
| The disc is shown while a form is shown.
*/
Form.prototype.showDisc =
	true;


/*
| Returns the focused item.
*/
Form.prototype._focusedWidget =
	function( )
{
	var
		path =
			this.mark.widgetPath;

	if( path.length === 0 )
	{
		return null;
	}

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.twig[ path.get( 4 ) ];
};


/*
| Draws the form.
*/
Form.prototype.draw =
	function(
		fabric
	)
{
	fabric.paint(
		theme.forms.style,
		fabric,
		'sketch',
		Euclid.View.proper
	);

	var
		ranks =
			this.ranks;

	for(
		var a = ranks.length - 1;
		a >= 0;
		a--
	)
	{
		var
			name =
				ranks[ a ];

		// FIXME just create a atRank
		this.twig[ name ].draw( fabric );
	}
};


/*
| Moving during an operation with the mouse button held down.
*/
Form.prototype.dragMove =
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
Form.prototype.dragStop =
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
Form.prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		a,
		aZ,

		ranks =
			this.ranks;

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			// FIXME atRank
			reply =
				this.twig[ name ].pointingHover(
					p,
					shift,
					ctrl
				);

		if( reply )
		{
			return reply;
		}
	}

	return (
		HoverReply.create(
			'path',
				Path.empty,
			'cursor',
				'default'
		)
	);
};


/*
| User clicked
*/
Form.prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		ranks =
			this.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			// TODO atRank
			result =
				this.twig[ name ].click(
					p,
					shift,
					ctrl
				);

		if( result !== null )
		{
			return result;
		}
	}

	return false;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
Form.prototype.dragStart =
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
Form.prototype.input =
	function(
		text
	)
{
	var
		widget =
			this._focusedWidget( );

	if( !widget )
	{
		return;
	}

	widget.input( text );
};


/*
| Cycles the focus
*/
Form.prototype.cycleFocus =
	function(
		dir
	)
{
	var
		path =
			this.mark.widgetPath;

	if( path.isEmpty )
	{
		return;
	}

	var
		ranks =
			this.ranks,

		rank =
			// tree.rankOf( path.get( 3 ) ), TODO
			ranks.indexOf( path.get( 4 ) ),

		length =
			ranks.length, // TODO

		rs =
			rank,

		name,

		ve;

	while( true )
	{
		rank =
			( rank + dir + length ) % length;

		if( rank === rs )
		{
			break;
		}

		name =
			ranks[ rank ];

		ve =
			this.twig[ name ];

		if(
			ve.focusable
			&&
			ve.visible !== false
		)
		{
			if( ve.caretable )
			{
				shell.setMark(
					Mark.Caret.create(
						'path',
							ve.path,
						'at',
							0
					)
				);
			}
			else
			{
				shell.setMark(
					Mark.Widget.create(
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
Form.prototype.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	var
		item =
			this._focusedWidget( );

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
Form.prototype.pushButton =
	function(
		// buttonName
	)
{
	throw new Error( );
};


/*
| Mouse wheel
*/
Form.prototype.mousewheel =
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
Form.prototype._widgetPath =
	function(
		widgetName
	)
{
	var
		path =
			this.twig[ widgetName ].path;

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
Jools.lazyValue(
	Form.prototype,
	'attentionCenter',
	function( )
	{
		var
			focus =
				this._focusedWidget( );

		if( !focus )
		{
			return null;
		}

		return (
			focus.attentionCenter
		);
	}
);


})( );
