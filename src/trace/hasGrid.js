/*
| A trace into a 'hasGrid' setting
*/
'use strict';


tim.define( module, ( def, trace_hasGrid ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space' ];

	def.json = './base';
}


const trace_base = tim.require( './base' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return( {
		type : 'trace',
		trace : [ '(o)hasGrid' ].concat(this.last.asJSON.trace )
	});
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'hasGrid';


/*
| Creates one step from the a JSON.
*/
def.static.createFromJSONStep =
	function(
		trace, // the json trace
		pos    // the position in the trace
	)
{
	if( CHECK )
/**/{
/**/	if( trace[ pos ] !== '(o)hasGrid' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendHasGrid;
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		val
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( val ) !== 'boolean' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'hasGrid', val );

	return this.last.graft( tree, sub );
};


/*
| Picks the traced leaf.
*/
def.proto.pick =
	function(
		tree
	)
{
	return this.last.pick( tree ).hasGrid;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'hasGrid' );
};


} );
