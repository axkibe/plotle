/*
| The loading form.
|
| Shown when loading a space.
*/
'use strict';


tim.define( module, ( def ) => {


const form_form = require( './form' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// current action
		action :
		{
			type :
				tim.typemap( module, '../action/action' )
				.concat( [ 'undefined' ] )
		},

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark :
		{
			type : tim.typemap( module, '../visual/mark/mark' ).concat( [ 'undefined' ] ),

			prepare : 'self.concernsMark( mark, path )'
		},

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : [ 'undefined', '../ref/space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ], assign : '' },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ], assign : '' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.init = [ 'twigDup' ];

	def.twig = tim.typemap( module, '../widget/widget' );
}


/*
| Initializer.
*/
def.func._init = form_form.init;


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


def.static.concernsMark = form_form.concernsMark;


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The attention center.
*/
def.lazy.attentionCenter = form_form.getAttentionCenter;


/*
| The form's glint.
*/
def.lazy.glint = form_form.glint;


/*
| The focused widget.
*/
def.lazy.focusedWidget = form_form.getFocusedWidget;


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| User clicked.
*/
def.func.click = form_form.click;


/*
| Cycles the focus.
*/
def.func.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
def.func.dragMove =
	function(
		p,
		shift,
		ctrl
	)
{
	return;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	return false;
};


/*
| Stops an operation with the mouse button held down.
*/
def.func.dragStop =
	function(
		//p,
		//shift,
		//ctrl
	)
{
	return true;
};


/*
| User is inputing text.
*/
def.func.input = form_form.input;


/*
| Mouse wheel.
*/
def.func.mousewheel =
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
def.func.pointingHover = form_form.pointingHover;


/*
| The disc is shown while a form is shown.
*/
def.func.showDisc = true;


/*
| User is pressing a special key.
*/
def.func.specialKey = form_form.specialKey;


} );
