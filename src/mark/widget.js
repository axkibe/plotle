/*
| A single widget marked ( without caret or range )
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// path of the item
		path : { type : 'tim.js/path' },

		// trace to the widget
		trace : { type : '../trace/widget' },
	};
}


/*
| Returns true if this mark encompasses the trace.
*/
def.proto.encompasses = function( trace ) { return this.trace.hasTrace( trace ); };


/*
| The widget's path.
*/
def.lazy.widgetTrace = function( ) { return this.trace; };


/*
| Widget marks have no carets.
*/
def.proto.hasCaret = false;


/*
| The content the mark puts into the clipboard.
*/
def.proto.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 ) throw new Error( );
/**/}

	return path.subPathOf( this.path );
};


} );
