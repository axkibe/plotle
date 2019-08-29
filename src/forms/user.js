/*
| The user form.
*/
'use strict';


tim.define( module, ( def ) => {


/*
| Is a form.
*/
def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },
	};
}

const forms_base = tim.require( './base' );


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

	return forms_base.adjustGet.call( this, name, widget );
};


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
	function(
		trace,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceForm.key !== 'user' ) throw new Error( );
/**/}

	switch( trace.traceWidget.key )
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
