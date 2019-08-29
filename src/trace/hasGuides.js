/*
| A trace into a 'hasGuides' setting.
*/
'use strict';


tim.define( module, ( def, trace_hasGuides ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './root', './space' ];

	def.json = './base';
}

const trace_base = tim.require( './base' );
const trace_space = tim.require( './space' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return( {
		type : 'trace',
		trace : [ '(o)hasGuides' ].concat(this.last.asJSON.trace )
	});
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'hasGuides';


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
/**/	if( trace[ pos ] !== '(o)hasGuides' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1, trace_space.fakeRoot ).appendHasGuides;
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

	sub = sub.create( 'hasGuides', val );

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
	return this.last.pick( tree ).hasGuides;
};


} );
