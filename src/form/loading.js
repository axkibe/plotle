/*
| The loading form.
|
| Shown when loading a space.
*/


var
	form_form,
	form_loading,
	jools;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'form_loading',
		attributes :
			{
				hover :
					{
						comment : 'the widget hovered upon',
						type : 'jion_path',
						defaultValue : 'undefined'
					},
				mark :
					{
						comment : 'the users mark',
						type : '->mark',
						prepare : 'form_form.concernsMark( mark, path )',
						defaultValue : 'undefined'
					},
				path :
					{
						comment : 'the path of the form',
						type : 'jion_path',
						defaultValue : 'undefined'
					},
				spaceRef :
					{
						comment : 'the reference to the current space',
						type : 'fabric_spaceRef',
						defaultValue : 'null',
						assign : ''
					},
				username :
					{
						comment : 'currently logged in user',
						type : 'string',
						defaultValue : 'null'
					},
				view :
					{
						comment : 'the current view',
						type : 'euclid_view',
						prepare : 'view ? view.sizeOnly : view',
						defaultValue : 'undefined'
					}
			},
		init :
			[ 'inherit' ],
		twig :
			'->formWidgets'
	};
}


var
	prototype;

prototype = form_loading.prototype;


/*
| The welcome form.
*/
prototype._init =
	function(
		inherit
	)
{
	form_form.init.call( this, inherit );
};


/*
| The attention center.
*/
jools.lazyValue(
	prototype,
	'attentionCenter',
	form_form.getAttentionCenter
);


/*
| User clicked.
*/
prototype.click = form_form.click;


/*
| Cycles the focus.
*/
prototype.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
prototype.dragMove =
	function(
		// p
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| Stops an operation with the mouse button held down.
*/
prototype.dragStop =
	function(
		//p,
		//shift,
		//ctrl
	)
{
	return true;
};


/*
| Draws a form.
*/
prototype.draw = form_form.draw;


/*
| The focused widget.
*/
jools.lazyValue(
	prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| User is inputing text.
*/
prototype.input = form_form.input;


/*
| Mouse wheel.
*/
prototype.mousewheel =
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
| If point is on the form returns its hovering state.
*/
prototype.pointingHover = form_form.pointingHover;


/*
| The disc is shown while a form is shown.
*/
prototype.showDisc = true;


/*
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


} )( );
