/*
| The loading form.
|
| Shown when loading a space.
*/
'use strict';


tim.define( module, ( def ) => {


const form_form = require( './form' );


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types', 'undefined' ] },

		// space has grid
		hasGrid : { type : 'undefined' },

		// space has snapping
		hasSnapping : { type : 'undefined' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : 'undefined' },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


def.transform.get = form_form.transformGet;


/*
| Doesn't care about hasGrid.
*/
def.static.concernsHasGrid =
def.func.concernsHasGrid =
	( ) => undefined;


/*
| Doesn't care about hasSnapping.
*/
def.static.concernsHasSnapping =
def.func.concernsHasSnapping =
	( ) => undefined;


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.func.concernsSpaceRef =
	( ) => undefined;


/*
| Doesn't care about user.
*/
def.static.concernsUser =
def.func.concernsUser =
	( ) => undefined;


/*
| Doesn't care about userSpaceList.
*/
def.static.concernsUserSpaceList =
def.func.concernsUserSpaceList =
	( ) => undefined;


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
