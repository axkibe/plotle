/*
| The welcome form.
|
| Shown only after successfully signing up.
*/
'use strict';


tim.define( module, 'form_welcome', ( def, form_welcome ) => {


const form_form = require( './form' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		action :
		{
			// current action
			type :
				tim.typemap( module, '../action/action' )
				.concat( [ 'undefined' ] )
		},
		hover :
		{
			// the widget hovered upon
			type : [ 'undefined', 'tim.js/path' ]
		},
		mark :
		{
			// the users mark
			type : tim.typemap( module, '../visual/mark/mark' ).concat( [ 'undefined' ] ),

			prepare : 'form_form.concernsMark( mark, path )'
		},
		path :
		{
			// the path of the form
			type : [ 'undefined', 'tim.js/path' ]
		},
		spaceRef :
		{
			// the reference to the current space
			type : [ 'undefined', 'ref_space' ],
			assign : ''
		},
		user :
		{
			// currently logged in user
			type : [ 'undefined', 'user_creds' ]
		},
		userSpaceList :
		{
			// list of spaces belonging to user
			type : [ 'undefined', 'ref_spaceList' ],
			assign : ''
		},
		viewSize :
		{
			// current view size
			type : 'gleam_size'
		}
	};

	def.init = [ 'twigDup' ];

	def.twig = require( '../form/typemap-widget' );
}


/*
| Initialize.
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
			'text', 'welcome ' + ( this.user ? this.user.name : '' ) + '!'
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
		path
		// shift,
		// ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== 'welcome' ) throw new Error( );
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
def.func.showDisc = true;


/*
| User is pressing a special key.
*/
def.func.specialKey = form_form.specialKey;


} );
