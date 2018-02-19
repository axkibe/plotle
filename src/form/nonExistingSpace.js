/*
| The space space the user tried to port to does not exist.
*/
'use strict';


tim.define( module, 'form_nonExistingSpace', ( def, form_nonExistingSpace ) => {


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
		mark :
		{
			// the users mark
			type : tim.typemap( module, '../visual/mark/mark' ).concat( [ 'undefined' ] ),

			prepare : 'form_form.concernsMark( mark, path )'
		},

		// the non-existing-space
		nonSpaceRef : { type : [ 'undefined', 'ref_space' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : [ 'undefined', 'ref_space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', 'user_creds' ], assign : '' },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ], assign : '' },

		// current view size
		viewSize : { type : 'gleam_size' },
	};

	def.init = [ 'twigDup' ];

	def.twig = require( '../form/typemap-widget' );
}


/*
| Initializer.
*/
def.func._init =
	function(
		twigDup
	)
{
	if( !this.path ) return;

	const twig = twigDup ? this._twig : tim.copy( this._twig );

	twig.headline =
		twig.headline.create(
			'text',
				this.nonSpaceRef
				? this.nonSpaceRef.fullname + ' does not exist.'
				: ''
		);

	this._twig = twig;

	form_form.init.call( this, true );
};


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
def.func.dragStop =
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
| A button of the form has been pushed.
*/
def.func.pushButton =
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
def.func.showDisc = true;


/*
| User is pressing a special key.
*/
def.func.specialKey = form_form.specialKey;


} );
