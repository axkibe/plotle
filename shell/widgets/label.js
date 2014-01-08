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
	Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

if( CHECK && typeof( window ) === 'undefined' )
{
	throw new Error(
		'this code needs a browser!'
	);
}

var
	_tag =
		'WIDGET-52212713';


/*
| Constructor.
*/
var Label =
Widgets.Label =
	function(
		tag,
		inherit,
		tree,
		path,
		pos,
		visible,
		text
		// mark
	)
{
	if( CHECK )
	{
		if( path === null )
		{
			throw new Error(
				'path missing'
			);
		}

		if( tree === null )
		{
			throw new Error(
				'tree missing'
			);
		}
	}

	this.path =
		path;

	this.pos =
		pos;

	this.text =
		text !== null ?
			text :
			tree.twig.text;

	this.tree =
		tree;

	this.visible =
		visible;

	Widgets.Widget.call(
		this,
		tag
	);
};


Jools.subclass(
	Label,
	Widgets.Widget
);


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

		mark =
			null,

		path =
			null,

		pos =
			null,

		superFrame =
			null,

		text =
			null,

		traitSet =
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
			case 'focusAccent' :

				if( CHECK && arguments[ a + 1 ] !== null )
				{
					throw new Error(
						'Labels must not have a focusAccent'
					);
				}

				break;

			case 'hoverAccent' :

				if( CHECK && arguments[ a + 1 ] )
				{
					throw new Error(
						'Labels must not have a hoverAccent'
					);
				}

				break;

			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'pos' :

				pos =
					arguments[ a + 1 ];

				break;

			case 'superFrame' :

				superFrame =
					arguments[ a + 1 ];

				break;

			case 'text' :

				text =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				traitSet =
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

	if( traitSet )
	{
		if( CHECK )
		{
			if( !path )
			{
				throw new Error(
					'traitSet needs path'
				);
			}

			if( traitSet.reflect !== 'TraitSet' )
			{
				throw new Error(
					'invalid traitset'
				);
			}
		}

		for(
			a = 0, aZ = traitSet.length;
			a < aZ;
			a++
		)
		{
			var
				t =
					traitSet.get( a );

			if(
				t.path.equals( path )
			)
			{
				switch( t.key )
				{
					case 'text' :

						text =
							t.val;

						break;

					case 'visible' :

						visible =
							t.val;

						break;

					default :

						throw new Error(
							'unknown trait: ' + t.key
						);
				}
			}
		}
	}

	// TODO use concernsMark

	if( inherit )
	{
		if( path === null )
		{
			path =
				inherit.path;
		}

		if( pos === null && superFrame === null )
		{
			pos =
				inherit.pos;
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

	if( pos === null )
	{
		if( superFrame === null )
		{
			throw new Error(
				'superFrame and pos === null'
			);
		}

		pos =
			superFrame.computePoint(
				tree.twig.pos
			);
	}

	// FIXME inherit cache

	return new Label(
		_tag,
		inherit,
		tree,
		path,
		pos,
		visible,
		text,
		mark
	);
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
