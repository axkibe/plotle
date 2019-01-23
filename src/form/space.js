/*
| The space form.
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
		hasGrid : { type : [ 'undefined', 'boolean' ] },

		// space has snapping
		hasSnapping : { type : [ 'undefined', 'boolean' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/src/path' ] },

		// the reference of current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const change_set = require( '../change/set' );

const form_form = require( './form' );

const tim_path = require( 'tim.js/src/path' );


/*
| Does(!) care about hasGrid.
*/
def.static.concernsHasGrid =
def.proto.concernsHasGrid =
	( hasGrid ) => hasGrid;


/*
| Does(!) care about hasSnapping.
*/
def.static.concernsHasSnapping =
def.proto.concernsHasSnapping =
	( hasSnapping ) => hasSnapping;


/*
| Does(!) care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( spaceRef ) => spaceRef;


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
		case 'headline' : widget = widget.create( 'text', this.spaceRef.fullname ); break;

		case 'gridCheckBox' : widget = widget.create( 'checked', this.hasGrid ); break;

		case 'snappingCheckBox' : widget = widget.create( 'checked', this.hasSnapping ); break;
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
/**/	if( path.get( 2 ) !== 'space' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'closeButton' : root.showHome( ); break;

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


/*
| A checkbox has been toggled.
*/
def.proto.toggleCheckbox =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if(
/**/		path.length < 5
/**/		|| path.get( 0 ) !== 'form'
/**/		|| path.get( 1 ) !== 'twig'
/**/		|| path.get( 2 ) !== 'space'
/**/		|| path.get( 3 ) !== 'twig'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	switch( path.get( 4 ) )
	{
		case 'gridCheckBox' :
		{
			const prev = root.spaceFabric.hasGrid;

			const change =
				change_set.create(
					'path', tim_path.empty.append( 'hasGrid' ),
					'val', !prev,
					'prev', prev
				);

			root.alter( change );

			return;
		}

		case 'snappingCheckBox' :
		{
			const prev = root.spaceFabric.hasSnapping;

			const change =
				change_set.create(
					'path', tim_path.empty.append( 'hasSnapping' ),
					'val', !prev,
					'prev', prev
				);

			root.alter( change );

			return;
		}

		default : throw new Error( );
	}
};

} );
