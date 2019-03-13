/*
| User has no access to a space s/he tried to port to.
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
		action : { type : [ '< ../action/types', 'undefined' ] },

		// space has grid
		hasGrid : { type : 'undefined' },

		// space has snapping
		hasSnapping : { type : 'undefined' },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the denied space
		nonSpaceRef : { type : [ 'undefined', '../ref/space' ] },

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


const form_form = require( './form' );


/*
| Adjusts widgets.
*/
def.adjust.get =
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
						? 'No access to ' + this.nonSpaceRef.fullname
						: ''
				);

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
/**/	if( path.get( 2 ) !== 'noAccessToSpace' ) throw new Error( );
/**/}

	const buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'okButton' :

			root.showHome( );

			break;

		default :

			throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


} );
