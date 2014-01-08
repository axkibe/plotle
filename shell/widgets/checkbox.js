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
	Euclid,
	Jools,
	shell,
	TraitSet;


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
var CheckBox =
Widgets.CheckBox =
	function(
		tag,
		inherit,
		tree,
		path,
		frame,
		focusAccent,
		hoverAccent,
		visible,
		checked
		// mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}

		if( !frame )
		{
			throw new Error(
				'frame missing'
			);
		}

		if( !path )
		{
			throw new Error(
				'path missing'
			);
		}

		if( typeof( focusAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid focusAccent'
			);
		}

		if( typeof( hoverAccent ) !== 'boolean' )
		{
			throw new Error(
				'invalid hoverAccent'
			);
		}
	}

	this.path =
		path;

	this.tree =
		tree;

	this.focusAccent =
		focusAccent;

	this.hoverAccent =
		hoverAccent;

	this.visible =
		visible;

	this.frame =
		frame;

	this.checked =
		checked;

	Widgets.Widget.call(
		this,
		tag
	);
};


Jools.subclass(
	CheckBox,
	Widgets.Widget
);


/*
| Creates an input.
*/
CheckBox.create =
	function(
		// free strings
	)
{
	var
		checked =
			null,

		focusAccent =
			null,

		frame =
			null,

		hoverAccent =
			null,

		inherit =
			null,

		mark =
			null,

		path =
			null,

		superFrame =
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

			case 'mark' :

				mark =
					arguments[ a + 1 ];

				break;

			case 'path' :

				path =
					arguments[ a + 1 ];

				break;

			case 'superFrame' :

				superFrame =
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

	if( mark && mark.reflect !== 'Vacant' )
	{

/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'mark needs path'
/**/			);
/**/		}
/**/	}

		mark =
			Widgets.Widget.concernsMark(
				mark,
				path
			);
	}

	if( traitSet )
	{
/**/	if( CHECK )
/**/	{
/**/		if( !path )
/**/		{
/**/			throw new Error(
/**/				'traitSet needs path'
/**/			);
/**/		}
/**/	}

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
					case 'checked' :

						checked =
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


	if( inherit )
	{
		if( checked === null )
		{
			checked =
				inherit.checked;
		}

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

		if( frame === null && superFrame === null )
		{
			frame =
				inherit.frame;
		}

		if( path === null )
		{
			path =
				inherit.path;
		}

		if( tree === null )
		{
			tree =
				inherit.tree;
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

	if( frame === null )
	{
		if( superFrame === null )
		{
			throw new Error(
				'superFrame and frame === null'
			);
		}

		frame =
			superFrame.computeRect(
				tree.twig.frame.twig
			);
	}

	// FIXME inherit cache

	return new CheckBox(
		_tag,
		inherit,
		tree,
		path,
		frame,
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
	var
		pc =
			this.frame.pc,

		pcx =
			pc.x,

		pcy =
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
		this.frame.within(
			Euclid.View.proper,
			p
		)
	)
	{
		shell.setTraits(
			TraitSet.create(
				'trait',
					this.path,
					'checked',
					!this.checked
			)
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

			shell.setTraits(
				TraitSet.create(
					'trait',
						this.path,
						'checked',
						!this.checked
				)
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
	shell.setTraits(
		TraitSet.create(
			'trait',
				this.path,
				'checked',
				!this.checked
		)
	);

	return true;
};


/*
| Draws the checkbox.
| FIXME _weave caching
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

	var
		style =
			Widgets.getStyle(
				this.tree.twig.style,
				Accent.state(
					this.hoverAccent,
					this.focusAccent
				)
			);

	fabric.paint(
		style,
		this.frame,
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


} )( );
