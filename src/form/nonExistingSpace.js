/*
| The space space the user tried to port to does not exist.
*/
'use strict';


tim.define( module, ( def ) => {


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
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the non-existing-space
		nonSpaceRef : { type : [ 'undefined', '../ref/space' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

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


const form_form = require( './form' );


/*
| Doesn't care about hasGrid.
*/
def.static.concernsHasGrid =
def.proto.concernsHasGrid =
	( ) => undefined;


/*
| Doesn't care about hasSnapping.
*/
def.static.concernsHasSnapping =
def.proto.concernsHasSnapping =
	( ) => undefined;


/*
| Doesn't care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( ) => undefined;


/*
| Doesn't care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( ) => undefined;


/*
| Doesn't care about userSpaceList.
*/
def.static.concernsUserSpaceList =
def.proto.concernsUserSpaceList =
	( ) => undefined;


/*
| Transforms widgets.
*/
def.transform.get =
	function(
		name,
		widget
	)
{
	switch( name )
	{
		case 'headline' :

			widget =
				widget.create(
					'text',
						this.nonSpaceRef
						? this.nonSpaceRef.fullname + ' does not exist.'
						: ''
				);

			break;
	}

	return form_form.transformGet.call( this, name, widget );
};


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
def.proto.click = form_form.click;


/*
| Cycles the focus.
*/
def.proto.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
def.proto.dragMove =
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
def.proto.dragStart =
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
def.proto.dragStop =
	function(
		p,
		shift,
		ctrl
	)
{
	return true;
};


/*
| User is inputing text.
*/
def.proto.input = form_form.input;


/*
| Mouse wheel.
*/
def.proto.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	return true;
};


/*
| If point is on the form returns its hovering state.
*/
def.proto.pointingHover = form_form.pointingHover;


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
	function(
		path,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'nonExistingSpace' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'noButton' : root.showHome( ); break;

		case 'yesButton' : root.moveToSpace( this.nonSpaceRef, true ); break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


/*
| User is pressing a special key.
*/
def.proto.specialKey = form_form.specialKey;


} );
