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
	Caret,
	Curve,
	Design,
	Euclid,
	Jools,
	Pattern,
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
		inherit =
			null,

		a =
			0,

		aZ =
			arguments.length;

	this.screensize =
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

				this.screensize =
					arguments[ a++ ];

				continue;

			default :

				throw new Error( 'unknown argument: ' + arg );

		}
	}

	this.iframe =
		new Euclid.Rect(
			'pse',
			this.screensize
		);

	this.tree =
		Tree.grow(
			this.layout,
			Pattern
		);

	// hinders direct access of the layout
	this.layout =
		null;

	// the caret or a caret less component
	// having the focus (for example a button)
	this.$caret =
		new Caret(
			null,
			null,
			false
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
				this.getWidgetPrototype( tree );

		this.$sub[ name ] =
			Proto.create(
				'name',
					name,
				'tree',
					tree,
				'parent',
					this,
				'inherit',
					inherit && inherit.$sub[ name ]
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
		case 'Button' :

			return Widgets.Button;

		case 'CheckBox' :

			return Widgets.CheckBox;

		case 'Input' :

			return Widgets.Input;

		case 'Label' :

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
		caret =
			this.$caret,

		sign =
			caret.sign;

	if( !sign )
	{
		return null;
	}

	var
		path =
			sign.path;

	if( path.get( 0 ) !== this.name )
	{
		throw new Error( 'this caret not on this form!' );
	}

	return this.$sub[ path.get( 1 ) ] || null;
};


/*
| Force clears all caches.
*/
Form.prototype.knock =
	function( )
{
	for( var c in this.$sub )
	{
		this.$sub[ c ].knock( );
	}
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
		var name =
			ranks[ a ];

		var comp =
			this.$sub[ name ];

		comp.draw( fabric );
	}

	this.$caret.display( );
};


/*
| Positions the caret.
*/
Form.prototype.positionCaret =
	function( )
{
	var
		caret =
			this.$caret,

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

		if( ve.grepFocus( ) )
		{
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
| Clears caches.
*/
Form.prototype.poke =
	function( )
{
//	this.$fabric =
//		null;

	shell.redraw =
		true;
};


/*
| Sets the caret position.
*/
Form.prototype.setCaret =
	function(
		sign
	)
{
	switch( sign && sign.constructor )
	{
		case null :
		case Sign :

			break;

		case Object :

			sign =
				new Sign( sign );

			break;

		default :

			throw new Error(
				'Space.setCaret: invalid sign'
			);
	}

	var
		entity;

	if(
		this.$caret.sign &&
		(
			!sign ||
			this.$caret.sign.path !== sign.path
		)
	)
	{
		this.setFocusAccent(
			this.$caret.sign.path.get( 1 ),
			false
		);
	}

	this.$caret =
		new Caret(
			sign,
			null,
			this.$caret.$shown
		);

	if( sign )
	{
		this.setFocusAccent(
			this.$caret.sign.path.get( 1 ),
			true
		);
	}

	shell.redraw =
		true;

	return this.$caret;
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
| The shell got the systems focus.
*/
Form.prototype.systemFocus =
	function( )
{
	var caret =
		this.$caret;

	caret.show( );

	caret.display( );

	shell.redraw =
		true;
};


/*
| The shell lost the systems focus.
*/
Form.prototype.systemBlur =
	function( )
{
	var caret =
		this.$caret;

	caret.hide( );

	caret.display( );

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
| Blinks the caret (if shown)
*/
Form.prototype.blink =
	function( )
{
	this.$caret.blink( );
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
