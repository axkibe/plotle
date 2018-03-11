/*
| The user form.
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
		action : { type : [ '< ../action/types', 'undefined' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark :
		{
			type : [ '< ../visual/mark/types', 'undefined' ],
			prepare : 'self.concernsMark( mark, path )'
		},

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference to the current space
		spaceRef : { type : [ 'undefined', '../ref/space' ], assign : '' },

		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : [ 'undefined', '../ref/spaceList' ], assign : '' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.init = [ 'twigDup' ];

	def.twig = [ '< ../widget/types' ];
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

	const isVisitor = this.user ? this.user.isVisitor : true;

	const twig = twigDup ?  this._twig : tim.copy( this._twig );

	twig.headline =
		twig.headline.create(
			'text', 'hello ' + ( this.user ? this.user.name : '' )
		);

	twig.visitor1 = twig.visitor1.create( 'visible', isVisitor );

	twig.visitor2 = twig.visitor2.create( 'visible', isVisitor );

	twig.visitor3 = twig.visitor3.create( 'visible', isVisitor );

	twig.visitor4 = twig.visitor4.create( 'visible', isVisitor );

	twig.greeting1 = twig.greeting1.create( 'visible', !isVisitor );

	twig.greeting2 = twig.greeting2.create( 'visible', !isVisitor );

	twig.greeting3 = twig.greeting3.create( 'visible', !isVisitor );

	this._twig = twig;

	form_form.init.call( this, true );
};


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
| The focused widget.
*/
def.lazy.focusedWidget = form_form.getFocusedWidget;


/*
| The form's glint.
*/
def.lazy.glint = form_form.glint;


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
	return true;
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
/**/	if( path.get( 2 ) !== 'user' ) throw new Error( );
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

