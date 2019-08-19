/*
| The space form.
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
		// space has grid
		hasGrid : { type : [ 'undefined', 'boolean' ] },

		// space has guides
		hasGuides : { type : [ 'undefined', 'boolean' ] },

		// space has snapping
		hasSnapping : { type : [ 'undefined', 'boolean' ] },

		// the reference of current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },
	};
}


const change_set = tim.require( '../change/set' );

const forms_base = tim.require( './base' );

const trace_space = tim.require( '../trace/space' );


/*
| Does care about hasGrid.
*/
def.static.concernsHasGrid =
def.proto.concernsHasGrid =
	( hasGrid ) => hasGrid;


/*
| Does care about hasGuides.
*/
def.static.concernsHasGuides =
def.proto.concernsHasGuides =
	( hasGuides ) => hasGuides;

/*
| Does care about hasSnapping.
*/
def.static.concernsHasSnapping =
def.proto.concernsHasSnapping =
	( hasSnapping ) => hasSnapping;


/*
| Does care about spaceRef.
*/
def.static.concernsSpaceRef =
def.proto.concernsSpaceRef =
	( spaceRef ) => spaceRef;


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
		case 'headline' : widget = widget.create( 'text', this.spaceRef.fullname ); break;

		case 'gridCheckBox' : widget = widget.create( 'checked', this.hasGrid ); break;

		case 'guidesCheckBox' : widget = widget.create( 'checked', this.hasGuides ); break;

		case 'snappingCheckBox' : widget = widget.create( 'checked', this.hasSnapping ); break;
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
/**/	if( trace.traceForm.key !== 'space' ) throw new Error( );
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


/*
| A checkbox has been toggled.
*/
def.proto.toggleCheckbox =
	function(
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( trace.traceForm.key !== 'space' ) throw new Error( );
/**/}

	switch( trace.traceWidget.key )
	{
		case 'gridCheckBox' :
		{
			const prev = root.space.hasGrid;

			const change =
				change_set.create(
					'trace', trace_space.fakeRoot.appendHasGrid,
					'val', !prev,
					'prev', prev
				);

			root.alter( 'change', change );

			return;
		}

		case 'guidesCheckBox' :
		{
			const prev = root.space.hasGuides;

			const change =
				change_set.create(
					'trace', trace_space.fakeRoot.appendHasGuides,
					'val', !prev,
					'prev', prev
				);

			root.alter( 'change', change );

			return;
		}

		case 'snappingCheckBox' :
		{
			const prev = root.space.hasSnapping;

			const change =
				change_set.create(
					'trace', trace_space.fakeRoot.appendHasSnapping,
					'val', !prev,
					'prev', prev
				);

			root.alter( 'change', change );

			return;
		}

		default : throw new Error( );
	}
};


} );
