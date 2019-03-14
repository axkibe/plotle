/*
| The space form.
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
		hasGrid : { type : [ 'undefined', 'boolean' ] },

		// space has snapping
		hasSnapping : { type : [ 'undefined', 'boolean' ] },

		// the widget hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the form
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the reference of current space
		spaceRef : { type : [ 'undefined', '../ref/space' ] },

		// currently logged in user
		user : { type : 'undefined' },

		// list of spaces belonging to user
		userSpaceList : { type : 'undefined' },

		// current view size
		viewSize : { type : '../gleam/size' },
	};

	def.twig = [ '< ../widget/types' ];
}


const change_set = tim.require( '../change/set' );

const form_form = tim.require( './form' );

const tim_path = tim.require( 'tim.js/path' );


/*
| Does care about hasGrid.
*/
def.static.concernsHasGrid =
def.proto.concernsHasGrid =
	( hasGrid ) => hasGrid;


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

		case 'snappingCheckBox' : widget = widget.create( 'checked', this.hasSnapping ); break;
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
/**/	if( path.get( 2 ) !== 'space' ) throw new Error( );
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


/*
| A checkbox has been toggled.
*/
def.proto.toggleCheckbox =
	function(
		path
	)
{
/**/if( CHECK )
/**/{
/**/	if(
/**/		path.length < 5
/**/		|| path.get( 0 ) !== 'form'
/**/		|| path.get( 1 ) !== 'twig'
/**/		|| path.get( 2 ) !== 'space'
/**/		|| path.get( 3 ) !== 'twig'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	switch( path.get( 4 ) )
	{
		case 'gridCheckBox' :
		{
			const prev = root.spaceFabric.hasGrid;

			const change =
				change_set.create(
					'path', tim_path.empty.append( 'hasGrid' ),
					'val', !prev,
					'prev', prev
				);

			root.alter( change );

			return;
		}

		case 'snappingCheckBox' :
		{
			const prev = root.spaceFabric.hasSnapping;

			const change =
				change_set.create(
					'path', tim_path.empty.append( 'hasSnapping' ),
					'val', !prev,
					'prev', prev
				);

			root.alter( change );

			return;
		}

		default : throw new Error( );
	}
};


} );
