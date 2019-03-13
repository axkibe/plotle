/*
| The user form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './form';


if( TIM )
{
	def.attributes =
	{
		// current action
		action : { type : [ '< ../action/types' ] },

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
		user : { type : [ 'undefined', '../user/creds' ] },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const form_form = require( './form' );


/*
| Does care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( user ) => user;


/*
| Transforms widgets.
*/
def.adjust.get =
	function(
		name,
		widget
	)
{
	// FIXME make lazy
	const isVisitor = this.user ? this.user.isVisitor : true;

	switch( name )
	{
		case 'headline' :

			widget = widget.create( 'text', 'hello ' + ( this.user ? this.user.name : '' ) );

			break;

		case 'visitor1' :
		case 'visitor2' :
		case 'visitor3' :
		case 'visitor4' :

			widget = widget.create( 'visible', isVisitor );

			break;

		case 'greeting1' :
		case 'greeting2' :
		case 'greeting3' :

			widget = widget.create( 'visible', !isVisitor );

			break;
	}

	return form_form.adjustGet.call( this, name, widget );
};


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
def.proto.showDisc = true;


} );
