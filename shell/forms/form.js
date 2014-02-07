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
	shellverse,
	theme,
	Widgets;


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
		design,
		traitSet
	)
{
	this.frame =
		this.view.baseFrame;

	var
		tree =
		this.tree =
			// inherit
			shellverse.grow( design );

	// all components of the form
	var
		sub =
			{ },

		twig =
			tree.twig,

		ranks =
			tree.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			subtree =
				twig[ name ],

			widgetProto =
				inherit && inherit.sub[ name ],

			path,

			focusAccent =
				false;

		if( !widgetProto )
		{
			widgetProto =
				Form.getWidgetPrototype( subtree );
		}

		// FIXME only when not having widgetProto
		path =
			this.path.append( name );

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
					this.mark.widgetPath.get( 2 ) === name;
			}
		}

		// TODO
		if(
			( widgetProto.reflect && widgetProto.reflect === 'Button' )
		)
		{
		sub[ name ] =
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
		else
		{
		sub[ name ] =
			widgetProto.create(
				'path',
					path,
				'tree',
					subtree,
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
	}

	this.sub =
		Jools.immute( sub );
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
| Returns the widgets prototype matching type
*/
Form.getWidgetPrototype =
	function( tree )
{
	// TODO
	if( tree._$grown )
	{
		return tree;
	}

	switch( tree.twig.type )
	{
		case 'ButtonWidget' :

			return Widgets.Button;

		case 'CheckBoxWidget' :

			return Widgets.CheckBox;

		case 'InputWidget' :

			return Widgets.Input;

		case 'LabelWidget' :

			return Widgets.Label;

		default :

			throw new Error(
				CHECK &&
				( 'Invalid component type: ' + tree.twig.type )
			);
	}
};



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
/**/	if( path.get( 1 ) !== this.reflect )
/**/	{
/**/		throw new Error(
/**/			'the mark is not on this form!'
/**/		);
/**/	}
/**/}

	return this.sub[ path.get( 2 ) ];
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
			this.tree.ranks;

	for(
		var a = ranks.length - 1;
		a >= 0;
		a--
	)
	{
		var
			name =
				ranks[ a ],

			comp =
				this.sub[ name ];

		comp.draw( fabric );
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

		layout =
			this.tree,

		ranks =
			layout.ranks;

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			comp =
				this.sub[ name ],

			reply =
				comp.pointingHover(
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
		layout =
			this.tree,

		ranks =
			layout.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			ce =
				this.sub[ name ],

			r =
				ce.click(
					p,
					shift,
					ctrl
				);

		if( r !== null )
		{
			return r;
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
		tree =
			this.tree,

		path =
			this.mark.widgetPath;

	if( path.isEmpty )
	{
		return;
	}

	var
		rank =
			tree.rankOf( path.get( 2 ) ),

		rs =
			rank,

		name,

		ve;

	while( true )
	{
		rank =
			( rank + dir + tree.length ) % tree.length;

		if( rank === rs )
		{
			break;
		}

		name =
			tree.ranks[ rank ];

		ve =
			this.sub[ name ];

		if(
			ve.focusable &&
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
	throw new Error(
		CHECK
		&&
		'pushButton should be overloaded!'
	);
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
*/
Form.prototype._widgetPath =
	function(
		widgetName
	)
{
	if( this.sub )
	{
		return this.sub[ widgetName ].path;
	}
	else
	{
		// in form creation sub might not exist yet.
		return this.path.append( widgetName );
	}
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
