/*
| The space space the user tried to port to does not exist.
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
		// the non-existing-space
		nonSpaceRef : { type : [ 'undefined', '../ref/space' ] },
	};
}


const forms_base = tim.require( './base' );


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
						? this.nonSpaceRef.fullname + ' does not exist.'
						: ''
				);

			break;
	}

	return forms_base.adjustGet.call( this, name, widget );
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


} );
