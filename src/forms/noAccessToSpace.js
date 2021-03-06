/*
| User has no access to a space s/he tried to port to.
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
		// the denied space
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
						? 'No access to ' + this.nonSpaceRef.fullname
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
		trace,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceForm.key !== 'noAccessToSpace' ) throw new Error( );
/**/}

	switch( trace.traceWidget.key )
	{
		case 'okButton' : root.showHome( ); break;

		default : throw new Error( );
	}
};


/*
| The disc is shown while a form is shown.
*/
def.proto.showDisc = true;


} );
