/*
| The welcome form.
|
| Shown only after successfully signing up.
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
		// currently logged in user
		user : { type : [ 'undefined', '../user/creds' ] },
	};
}


const forms_form = tim.require( './form' );


/*
| Does care about user.
*/
def.static.concernsUser =
def.proto.concernsUser =
	( user ) => undefined;


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
					'text', 'welcome ' + ( this.user ? this.user.name : '' ) + '!'
				);

			break;
	}

	return forms_form.adjustGet.call( this, name, widget );
};


/*
| A button of the form has been pushed.
*/
def.proto.pushButton =
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
def.proto.showDisc = true;


} );
