/*
| A checkbox
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Widgets;

Widgets =
	Widgets || { };


/*
| Imports
*/
var
	Accent,
	Action,
	config,
	Curve,
	Euclid,
	Jools,
	Path,
	shell,
	system,
	theme;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error( 'this code needs a browser!' );
}


/*
| Constructor.
*/
var CheckBox =
Widgets.CheckBox =
	function(
		tag,
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		visible,
		checked
	)
{
	if( CHECK )
	{
		if( tag !== 'XOXO' )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( parent === null )
		{
			throw new Error(
				'parent missing'
			);
		}

		if( tree === null )
		{
			throw new Error(
				'tree missing'
			);
		}

		if( typeof( focusAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid focusAccent.'
			);
		}

		if( typeof( hoverAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid hoverAccent.'
			);
		}
	}

	// TODO inherit
	this.path =
		new Path(
			[
				parent.name,
				name
			]
		);

	this.tree =
		tree;

	this.parent =
		parent;

	this.name =
		name;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	this.visible =
		visible;

	// TODO computeRect
	this.box =
		Euclid.Rect.create(
			'pnw/pse',
			parent.iframe.computePoint(
				tree.twig.box.twig.pnw
			),
			parent.iframe.computePoint(
				tree.twig.box.twig.pse
			)
		);

	this.checked =
		checked;

	Jools.immute( this );
};


/*
| Creates an input.
*/
CheckBox.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		focusAccent =
			null,

		hoverAccent =
			null,

		parent =
			null,

		name =
			null,

		tree =
			null,

		checked =
			null,

		visible =
			null;


	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'focusAccent' :

				focusAccent =
					arguments[ a + 1 ];

				break;

			case 'hoverAccent' :

				hoverAccent =
					arguments[ a + 1 ];

				break;

			case 'name' :

				name =
					arguments[ a + 1 ];

				break;

			case 'parent' :

				parent =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
					arguments[ a + 1 ];

				break;

			case 'checked' :

				checked =
					arguments[ a + 1 ];

				break;

			case 'visible' :

				visible =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument: ' + arguments[ a ]
				);
		}
	}

	if( inherit )
	{
		if( focusAccent === null )
		{
			focusAccent =
				inherit.focusAccent;
		}

		if( hoverAccent === null )
		{
			hoverAccent =
				inherit.hoverAccent;
		}

		if( name === null )
		{
			name =
				inherit.name;
		}

		if( parent === null )
		{
			parent =
				inherit.parent;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
		}

		if( checked === null )
		{
			checked =
				inherit.checked;
		}

		if( visible === null )
		{
			visible =
				inherit.visible;
		}
	}

	if( focusAccent === null )
	{
		focusAccent =
			false;
	}

	if( hoverAccent === null )
	{
		hoverAccent =
			false;
	}

	if( visible === null )
	{
		visible =
			true;
	}

	if( checked === null )
	{
		checked =
			Jools.is( tree.twig.checked ) ?
				tree.twig.checked :
				false;
	}

	return new CheckBox(
		'XOXO',
		inherit,
		tree,
		parent,
		name,
		focusAccent,
		hoverAccent,
		visible,
		checked
	);
};


/*
| CheckBoxes are focusable.
*/
CheckBox.prototype.focusable =
	true;


/*
| True when checked.
*/
CheckBox.prototype.isChecked =
	function( )
{
	throw new Error(
		'TODO'
	);
};


/*
| Sets the current checked state
*/
CheckBox.prototype.setChecked =
	function(
		checked
	)
{
	throw new Error(
		'TODO'
	);
};


/*
| Mouse hover.
*/
CheckBox.prototype.pointingHover =
	function(
		// p
	)
{
	return null;
};


/*
| Sketches the check
*/
CheckBox.prototype.sketchCheck =
	function(
		fabric
		// border,
		// twist
	)
{
	var pc =
		this.box.pc;

	var pcx =
		pc.x;

	var pcy =
		pc.y;

	fabric.moveTo(
		pcx -  5,
		pcy -  3
	);

	fabric.lineTo(
		pcx +  2,
		pcy +  5
	);

	fabric.lineTo(
		pcx + 14,
		pcy - 12
	);

	fabric.lineTo(
		pcx +  2,
		pcy -  1
	);

	fabric.lineTo(
		pcx -  5,
		pcy -  3
	);
};


/*
| CheckBox is being changed.
*/
CheckBox.prototype.change =
	function(
		// shift,
		// ctrl
	)
{
	// no default
};


/*
| User is starting to point something ( mouse down, touch start )
*/
CheckBox.prototype.pointingStart =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( !this.visible )
	{
		return null;
	}

	if(
		this.box.within(
			Euclid.View.proper,
			p
		)
	)
	{
		this.parent.setChecked(
			this.name,
			!this.checked
		);

		return false;
	}
	else
	{
		return null;
	}
};


/*
| Special keys for buttons having focus
*/
CheckBox.prototype.specialKey =
	function(
		key
	)
{
	switch( key )
	{
		case 'down' :

			this.parent.cycleFocus( +1 );

			return;

		case 'up' :

			this.parent.cycleFocus( -1 );

			return;

		case 'enter' :

			this.parent.setChecked(
				this.name,
				!this.checked
			);

			return;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
CheckBox.prototype.input =
	function(
		// text
	)
{
	this.parent.setChecked(
		this.name,
		!this.checked
	);

	return true;
};


/*
| Draws the checkbox.
| TODO _weave caching
*/
CheckBox.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	var style =
		Widgets.getStyle(
			this.tree.twig.style,
			Accent.state(
				this.hoverAccent,
				this.focusAccent
			)
		);

	// TODO why doesnt getStyle throw the Error?

	if( !Jools.isnon( style ) )
	{
		throw new Error(
			'Invalid style: ' + this.tree.twig.style
		);
	}

	fabric.paint(
		style,
		this.box,
		'sketch',
		Euclid.View.proper
	);

	if( this.checked )
	{
		fabric.paint(
			Widgets.getStyle(
				'checkboxCheck',
				Accent.NORMA
			),
			this,
			'sketchCheck',
			Euclid.View.proper
		);
	}
};


/*
| Control takes focus.
| TODO remove
*/
CheckBox.prototype.grepFocus =
	function( )
{
	if(
		!this.focusable ||
		!this.visible ||
		this.parent.getFocus( ) === this
	)
	{
		return false;
	}

	this.parent.setCaret(
		{
			path :
				this.path,

			at1 :
				0
		}
	);

	return true;
};



/*
| Clears all caches.
| TODO remove
*/
CheckBox.prototype.poke = function( )
{
};


/*
| Force clears all caches.
| TODO remove
*/
CheckBox.prototype.knock = function( )
{
};


} )( );
