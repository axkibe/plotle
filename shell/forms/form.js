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


if( typeof( window ) === 'undefined')
{
	throw new Error( 'this code needs a browser!' );
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
	var inherit =
		null;

	this.screensize =
		null;

	var a =
		0;

	var aZ =
		arguments.length;

	while( a < aZ )
	{
		var arg =
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
		new Tree(
			this.layout,
			Pattern
		);

	// hinder direct access of the layout
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
				this.getWidgetPrototype( tree.type );

		this.$sub[ name ] =
			new Proto(
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
| Returns the widgets prototype matching type
*/
Form.prototype.getWidgetPrototype =
	function( type )
{
	switch( type )
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
				'Invalid component type: ' + type
			);
	}
};



/*
| Returns the focused item.
*/
Form.prototype.getFocus =
	function( )
{
	var caret =
		this.$caret;

	var sign =
		caret.sign;

	if( !sign )
	{
		return null;
	}

	var path =
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

	var ranks =
		this.tree.ranks;

	var focus =
		this.getFocus( );

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

		comp.draw(
			fabric,
			Accent.state(
				name === this.$hover,
				( this.$caret.$shown && focus ) ?
					name === focus.name :
					false
			)
		);
	}

	this.$caret.display( );
};


/*
| Positions the caret.
*/
Form.prototype.positionCaret =
	function( )
{
	var caret =
		this.$caret;

	var name =
		caret.sign.path.get( 1 );

	var ce =
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

	var a, aZ;

	var cursor =
		null;

	var layout =
		this.tree;

	var ranks =
		layout.ranks;

	for(
		a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var name =
			ranks[ a ];

		var comp =
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
	var layout =
		this.tree;

	var ranks =
		layout.ranks;

	for(
		var a = 0, aZ = ranks.length;
		a < aZ;
		a++
	)
	{
		var name =
			ranks[ a ];

		var ce =
			this.$sub[ name ];

		var r =
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
	var tree =
		this.tree;

	var focus =
		this.getFocus( );

	if( !focus )
	{
		return;
	}

	var rank =
		tree.rankOf( focus.name );

	var rs =
		rank;

	var name, ve;

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
	var focus =
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

	var entity;

	if(
		this.$caret.sign &&
		(
			!sign ||
			this.$caret.sign.path !== sign.path
		)
	)
	{
		entity =
			this._getCaretEntity(
				this.$caret.sign.path
			);

		if( entity )
		{
			entity.knock( );
		}

		this.redraw =
			true;
	}

	this.$caret =
		new Caret(
			sign,
			null,
			this.$caret.$shown
		);

	if( sign )
	{
		entity =
			this._getCaretEntity(
				sign.path
			);

		if( entity )
		{
			entity.knock( );
		}

		this.redraw =
			true;
	}

	return this.$caret;
};


/*
| Sets the hovered component.
*/
Form.prototype.setHover =
	function( name )
{
	if( this.$hover === name )
	{
		return;
	}

	this.poke();

	if( this.$hover )
	{
		this.$sub[ this.$hover ].knock( );
	}

	if( name )
	{
		this.$sub[ name ].knock( );
	}

	this.$hover =
		name;

	return;
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
	throw new Error( 'pushButton should be overloaded!' );
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
		throw new Error( 'path.length expected to be 1' );
	}

	if( path.get( 0 ) !== this.name )
	{
		throw new Error( 'caret path mismatch' );
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
