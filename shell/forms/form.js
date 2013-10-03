/*
| A form
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
	Accent,
	config,
	Curve,
	Design,
	Euclid,
	Jools,
	Mark,
	shellverse,
	Sign,
	shell,
	system,
	theme,
	Tree,
	Widgets;


/*
| Capsule
*/
( function( ) {
'use strict';


if( CHECK && typeof( window ) === 'undefined')
{
	throw new Error(
		'this code needs a browser!'
	);
}


/*
| Constructor
*/
var Form =
Forms.Form =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		inherit =
			null,

		userMark =
			null,

		screensize =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{
			case 'inherit' :

				inherit =
					arguments[ a++ ];

				continue;

			case 'screensize' :

				screensize =
					arguments[ a++ ];

				continue;

			case 'userMark' :

				userMark =
					arguments[ a++ ];

				continue;

			default :

				throw new Error( 'unknown argument: ' + arg );
		}
	}

	this.screensize =
		screensize;

	this.frame =
		Euclid.Rect.create(
			'pse',
			screensize
		);

	this.userMark =
		userMark
		||
		// TODO
		new Mark(
			null,
			null
		);

	// all components of the form
	this.$sub =
		{ };

	// the component the pointer is hovering above
	this.$hover =
		inherit ? inherit.$hover : null;

	var
		twig =
			this.tree.twig,

		ranks =
			this.tree.ranks;

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				ranks[ a ],

			tree =
				twig[ name ],

			Proto =
				this.getWidgetPrototype( tree ),

			focusAccent = null;

		if( Proto.prototype.focusable )
		{
			if( !this.userMark.sign )
			{
				focusAccent =
					false;
			}
			else
			{
				focusAccent =
					this.userMark.sign.path.get( 1 ) === name;
			}
		}

		this.$sub[ name ] =
			Proto.create(
				'name',
					name,
				'tree',
					tree,
				'parent',
					this,
				'inherit',
					inherit && inherit.$sub[ name ],
				'focusAccent',
					focusAccent
			);
	}

	Jools.immute( this );
};

/*
| The disc is shown while a form is shown.
*/
Form.prototype.showDisc =
	true;


/*
| Returns the widgets prototype matching type
*/
Form.prototype.getWidgetPrototype =
	function( tree )
{

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
				'Invalid component type: ' +
				tree.twig.type
			);
	}
};



/*
| Returns the focused item.
*/
Form.prototype.getFocus =
	function( )
{
	var
		mark =
			this.userMark,

		sign =
			mark.sign;

	if( !sign )
	{
		return null;
	}

	var
		path =
			sign.path;

	if( CHECK && path.get( 0 ) !== this.name )
	{
		throw new Error( 'the mark is not on this form!' );
	}

	return this.$sub[ path.get( 1 ) ] || null;
};


/*
| Draws the form.
*/
Form.prototype.draw =
	function(  )
{
	var fabric =
		shell.fabric;

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
				this.$sub[ name ];

		comp.draw( fabric );
	}

	this.userMark.display( );
};


/*
| Positions the caret.
*/
Form.prototype.positionCaret =
	function( )
{
	var
		caret =
			this.userMark,

		name =
			caret.sign.path.get( 1 ),

		ce =
			this.$sub[ name ];

	if( !ce )
	{
		throw new Error('Caret component does not exist!');
	}

	if( ce.positionCaret )
	{
		ce.positionCaret(
			Euclid.View.proper
		);
	}
	else
	{
		caret.$screenPos =
		caret.$height =
			null;
	}
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
	if( p === null )
	{
		this.setHover( null );

		return;
	}

	var
		a,
		aZ,

		cursor =
			null,

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
				this.$sub[ name ];

		if( cursor )
		{
			comp.pointingHover(
				null,
				shift,
				ctrl
			);
		}
		else
		{
			cursor =
				comp.pointingHover(
					p,
					shift,
					ctrl
				);
		}
	}

	if ( cursor === null )
	{
		this.setHover( null );
	}

	return cursor || 'default';
};


/*
| User clicked
*/
Form.prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	// nada
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
| Pointing device starts pointing
| ( mouse down, touch start )
|
| Returns the pointing state code,
| wheter this is a click/drag or yet undecided.
*/
Form.prototype.pointingStart =
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
				this.$sub[ name ],

			r =
				ce.pointingStart(
					p,
					shift,
					ctrl
				);

		if( r !== null )
		{
			return r;
		}
	}

	// otherwise ...

	this.setHover( null );

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
	var focus =
		this.getFocus( );

	if( !focus )
	{
		return;
	}

	focus.input( text );
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

		focus =
			this.getFocus( );

	if( !focus )
	{
		return;
	}

	var
		rank =
			tree.rankOf( focus.name ),

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
			shell.dropFocus( );
		}

		name =
			tree.ranks[ rank ];

		ve =
			this.$sub[ name ];

		if(
			ve.focusable &&
			ve.visible !== false
		)
		{
			if( ve.caretable )
			{
				shell.userMark(
					'set',
					'type',
						'caret',
					'section',
						'forms',
					'path',
						ve.path,
					'at1',
						0
				);
			}
			else
			{
				shell.userMark(
					'set',
					'type',
						'item',
					'section',
						'forms',
					'path',
						ve.path
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
		focus =
			this.getFocus( );

	if( !focus )
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

	focus.specialKey(
		key,
		shift,
		ctrl
	);
};


/*
| Sets the value of a widget.
*/
Form.prototype.setValue =
	function(
		widgetName,
		value
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'value',
				value
		);

	shell.redraw =
		true;
};


/*
| Sets the focus accent of a widget.
*/
Form.prototype.setFocusAccent =
	function(
		widgetName,
		value
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'focusAccent',
				value
		);

	shell.redraw =
		true;
};


/*
| Sets the hover accent of a widget.
*/
Form.prototype.setHoverAccent =
	function(
		widgetName,
		value
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'hoverAccent',
				value
		);

	shell.redraw =
		true;
};

/*
| Sets the hovered component.
*/
Form.prototype.setHover =
	function(
		name
	)
{
	if( this.$hover === name )
	{
		return;
	}

	if( this.$hover )
	{
		this.setHoverAccent(
			this.$hover,
			false
		);
	}

	this.$hover =
		name;

	if( name )
	{
		this.setHoverAccent(
			name,
			true
		);
	}

	return;
};


/*
| Sets a text.
*/
Form.prototype.setText =
	function(
		widgetName,
		text
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'text',
				text
		);

	shell.redraw =
		true;
};


/*
| Sets a visible attribute.
*/
Form.prototype.setVisible =
	function(
		widgetName,
		visible
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'visible',
				visible
		);

	shell.redraw =
		true;
};



/*
| Sets the hovered component.
*/
Form.prototype.setChecked =
	function(
		widgetName,
		value
	)
{
	var
		Proto =
			this.getWidgetPrototype(
				this.tree.twig[ widgetName ]
			);

	this.$sub[ widgetName ] =
		Proto.create(
			'inherit',
				this.$sub[ widgetName ],
			'checked',
				value
		);

	shell.redraw =
		true;
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
		'pushButton should be overloaded!'
	);
};


/*
| Returns the first entity a caret can be in
*/
Form.prototype._getCaretEntity =
	function(
		path
	)
{
	if( path.length !== 2 )
	{
		throw new Error(
			'path.length expected to be 1'
		);
	}

	if( path.get( 0 ) !== this.name )
	{
		throw new Error(
			'caret path mismatch'
		);
	}

	return this.$sub[ path.get( 1 ) ];
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


})( );
