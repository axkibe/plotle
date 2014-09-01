/*
| A checkbox
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	widgets;

widgets = widgets || { };


/*
| Imports
*/
var
	Accent,
	euclid,
	icons,
	jools,
	root;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'widgets.checkbox',
		attributes :
			{
				checked :
					{
						comment :
							'true if the checkbox is checked',
						type :
							'Boolean',
						defaultValue :
							false
					},
				designFrame :
					{
						comment :
							'designed frame (using anchors',
						type :
							'design.anchorRect'
					},
				// FIXME deduce from mark
				focusAccent :
					{
						comment :
							'true if the widget got focus',
						type :
							'Boolean',
						defaultValue :
							false
					},
				hover :
					{
						comment :
							'component hovered upon',
						type :
							'jion.path',
						defaultValue :
							null,
						concerns :
							{
								type :
									'widgets.widget',
								func :
									'concernsHover',
								args :
									[
										'hover',
										'path'
									]
							}
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
						defaultValue :
							null,
						assign :
							null
					},
				path :
					{
						comment :
							'the path of the widget',
						type :
							'jion.path',
						defaultValue :
							null
					},
				superFrame :
					{
						comment :
							'the frame the widget resides in',
						type :
							'euclid.rect',
						defaultValue :
							null
					},
				style :
					{
						// FIXME put in a real object instead
						comment :
							'name of the style used',
						type :
							'String'
					},
				visible :
					{
						comment :
							'if false the button is hidden',
						type :
							'Boolean',
						defaultValue :
							true
					}
			},
		init :
			[ ]
	};
}


var
	checkbox;

checkbox = widgets.checkbox;


/*
| Initializes the widget.
*/
checkbox.prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.frame =
			this.designFrame.compute(
				this.superFrame
			);
	}
	else
	{
		this.frame =
			null;
	}

};


/*
| The check icon of the check box
*/
jools.lazyValue(
	checkbox.prototype,
	'checkIcon',
	function( )
	{
		return(
			icons.check.create(
				'pc',
					this.frame.pc
			)
		);
	}
);


/*
| CheckBoxes are focusable.
*/
checkbox.prototype.focusable = true;


/*
| Mouse hover.
*/
checkbox.prototype.pointingHover =
	function(
		// p
	)
{
	return null;
};


/*
| checkbox is being changed.
*/
checkbox.prototype.change =
	function(
		// shift,
		// ctrl
	)
{
	// no default
};


/*
| User clicked.
*/
checkbox.prototype.click =
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
			euclid.view.proper,
			p
		)
	)
	{
		root.setPath(
			this.path.append( 'checked' ),
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
checkbox.prototype.specialKey =
	function(
		key,
		owner
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'down' :

			owner.cycleFocus( +1 );

			return;

		case 'up' :

			owner.cycleFocus( -1 );

			return;

		case 'enter' :

			root.setPath(
				this.path.append( 'checked' ),
				!this.checked
			);

			return;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
checkbox.prototype.input =
	function(
		// text
	)
{
	root.setPath(
		this.path.append( 'checked' ),
		!this.checked
	);

	return true;
};


/*
| Draws the checkbox.
| FIXME _fabric caching
*/
checkbox.prototype.draw =
	function(
		fabric
	)
{
	var
		style;

	if( !this.visible )
	{
		return;
	}

	style =
		widgets.getStyle(
			this.style,
			Accent.state(
				this.hover
					&&
					this.hover.equals( this.path ),
				this.focusAccent
			)
		);

	fabric.paint(
		style,
		this.frame,
		euclid.view.proper
	);

	if( this.checked )
	{
		fabric.paint(
			widgets.getStyle(
				'checkboxCheck',
				Accent.NORMA
			),
			this.checkIcon,
			euclid.view.proper
		);
	}
};


} )( );
