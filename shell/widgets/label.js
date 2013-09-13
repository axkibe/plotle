/*
| A label.
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
	Curve,
	Euclid,
	Jools,
	Path;


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
var Label =
Widgets.Label =
	function(
		tag,
		inherit,
		tree,
		parent,
		name,
		visible,
		text
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
	}

	// TODO inherit
	this.path =
		new Path(
			[
				parent.name,
				name
			]
		);

	this.name =
		name;

	this.parent =
		parent;

	this.pos =
		parent.frame.zeropnw.computePoint(
			tree.twig.pos
		),

	this.text =
		text !== null ?
			text :
			tree.twig.text;

	this.tree =
		tree;

	this.visible =
		visible;

	Jools.immute( this );
};


/*
| Creates a label.
*/
Label.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		parent =
			null,

		name =
			null,

		text =
			null,

		tree =
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

			case 'name' :

				name =
					arguments[ a + 1 ];

				break;

			case 'parent' :

				parent =
					arguments[ a + 1 ];

				break;

			case 'text' :

				text =
					arguments[ a + 1 ];

				break;

			case 'tree' :

				tree =
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

		if( text === null )
		{
			text =
				inherit.text;
		}

		if( visible === null )
		{
			visible =
				inherit.visible;
		}
	}

	if( visible === null )
	{
		visible =
			true;
	}

	return new Label(
		'XOXO',
		inherit,
		tree,
		parent,
		name,
		visible,
		text
	);
};


/*
| Labels cannot focus.
*/
Label.prototype.grepFocus =
	function( )
{
	return false;
};


/*
| Draws the label on the fabric.
*/
Label.prototype.draw =
	function(
		fabric
	)
{
	if( !this.visible )
	{
		return;
	}

	fabric.paintText(
		'text',
			this.text,
		'p',
			this.pos,
		'font',
			this.tree.twig.font
	);
};


/*
| User is hovering his/her pointer ( mouse move )
*/
Label.prototype.pointingHover =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};


/*
| User is starting to point at something ( mouse down, touch start )
*/
Label.prototype.pointingStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return null;
};

} ) ( );
