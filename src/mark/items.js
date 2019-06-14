/*
| One or several items marked ( without caret or range )
*/
'use strict';


tim.define( module, ( def, mark_items ) => {


if( TIM )
{
	def.set = [ '../trace/item' ];
}


const trace_item = tim.require( '../trace/item' );


/*
| The content the mark puts into the clipboard.
|
| FUTURE write something
*/
def.proto.clipboard = '';


/*
| Combines the items mark (set) with another one.
*/
def.proto.combine =
	function(
		imark
	)
{
/**/if( CHECK )
/**/{
/**/	if( imark.timtype !== mark_items ) throw new Error( );
/**/}

	const set = this.clone( );

	for( let t of imark )
	{
		if( !this.contains( t ) ) set.add( t );
	}

	return mark_items.create( 'set:init', set );
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsPath =
	function(
		path
	)
{
	throw new Error( 'XXX' );
};


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
def.proto.containsItemTrace =
	function(
		itrace
	)
{
	for( let t of this ) if( t.equals( itrace ) ) return true;

	return false;
};


/*
| Creates the list with one item.
*/
def.static.createWithOne =
	function(
		path,   // XXX
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	const traces = new Set( );

	traces.add( trace );

	return mark_items.create( 'set:init', traces );
};


/*
| Returns true if this mark encompasses the trace.
*/
def.proto.encompasses =
	function(
		trace
	)
{
	for( let t of this ) if( t.hasTrace( trace ) ) return true;

	return false;
};


/*
| Item marks do not have a caret.
*/
def.proto.hasCaret = false;



/*
| The items mark of an items mark is itself.
*/
def.lazy.itemsMark = function( ) { return this; };


/*
| The widget's path.
*/
def.proto.widgetPath = undefined;



/*
| Returns a items-mark with the path added
| when it isn't part of this mark, or the
| path removed when it is.
*/
def.proto.toggle =
	function(
		path,    // XXXX
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( path.empty ) throw new Error( );
/**/
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/
/**/	if( trace.timtype !== trace_item ) throw new Error( );
/**/}

	for( let t of this )
	{
		if( trace.equals( t ) ) return this.create( 'set:remove', trace );
	}

	return this.create( 'set:add', trace );
};


/*
| Exta checking
*/
def.proto._check =
	function( )
{
/**/if( CHECK )
/**/{
/**/	for( let path of this.itemPaths )
/**/	{
/**/		if( path.isEmpty ) throw new Error( );
/**/
/**/		if( path.get( 0 ) !== 'space' ) throw new Error( );
/**/	}
/**/}
};


} );
