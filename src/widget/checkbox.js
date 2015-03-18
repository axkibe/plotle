/*
| A checkbox.
*/


/*
| Imports
*/
var
	euclid_view,
	icon_check,
	jools,
	root,
	shell_accent,
	widget_checkbox,
	widget_style;


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
			'widget_checkbox',
		attributes :
			{
				checked :
					{
						comment : 'true if the checkbox is checked',
						type : 'boolean',
						defaultValue : 'false'
					},
				designFrame :
					{
						comment : 'designed frame (using anchors)',
						type : 'design_anchorRect'
					},
				// FIXME deduce from mark
				focusAccent :
					{
						comment : 'true if the widget got focus',
						type : 'boolean',
						defaultValue : 'false'
					},
				hover :
					{
						comment : 'component hovered upon',
						type : 'jion_path',
						defaultValue : 'null',
						prepare : 'widget_widget.concernsHover( hover, path )'
					},
				mark :
					{
						comment : 'the users mark',
						type : '->mark',
						defaultValue : 'null',
						assign : null
					},
				path :
					{
						comment : 'the path of the widget',
						type : 'jion_path',
						defaultValue : 'null'
					},
				superFrame :
					{
						comment : 'the frame the widget resides in',
						type : 'euclid_rect',
						defaultValue : 'null'
					},
				style :
					{
						// FIXME put in a real object instead
						comment : 'name of the style used',
						type : 'string'
					},
				visible :
					{
						comment : 'if false the button is hidden',
						type : 'boolean',
						defaultValue : 'true'
					}
			},
		init :
			[ ]
	};
}


/*
| Initializes the widget.
*/
widget_checkbox.prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.frame = this.designFrame.compute( this.superFrame );
	}
	else
	{
		this.frame = null;
	}

};


/*
| The check icon of the check box
*/
jools.lazyValue(
	widget_checkbox.prototype,
	'checkIcon',
	function( )
	{
		return icon_check.create( 'pc', this.frame.pc );
	}
);


/*
| CheckBoxes are focusable.
*/
widget_checkbox.prototype.focusable = true;


/*
| Mouse hover.
*/
widget_checkbox.prototype.pointingHover =
	function(
		// p
	)
{
	return null;
};


/*
| checkbox is being changed.
*/
widget_checkbox.prototype.change =
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
widget_checkbox.prototype.click =
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

	if( this.frame.within( euclid_view.proper, p ) )
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
widget_checkbox.prototype.specialKey =
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
widget_checkbox.prototype.input =
	function(
		// text
	)
{
	root.setPath( this.path.append( 'checked' ), !this.checked );

	return true;
};


/*
| Draws the checkbox.
*/
widget_checkbox.prototype.draw =
	function(
		display
	)
{
	var
		style;

	if( !this.visible )
	{
		return;
	}

	style =
		widget_style.get(
			this.style,
			shell_accent.state(
				this.hover && this.hover.equals( this.path ),
				this.focusAccent
			)
		);

	display.oldPaint( style, this.frame, euclid_view.proper );

	if( this.checked )
	{
		this.checkIcon.draw(
			display,
			widget_style.get( 'checkboxCheck', shell_accent.NORMA ),
			euclid_view.proper
		);
	}
};


} )( );
