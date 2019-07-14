/*
| A trace into a fontsize.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './base';


if( TIM )
{
	// path of trace back.
	def.list = [ './item', './root', './space' ];

	def.json = './base';
}


const trace_base = tim.require( './base' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)fontsize' ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep = ( ) => 'fontsize';


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
/**/	if( trace[ pos ] !== '(o)fontsize' ) throw new Error( );
/**/}

	return trace_base.createFromJSONTrace( trace, pos + 1 ).appendFontsize;
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
/**/	if( typeof( val ) !== 'number' ) throw new Error( );
/**/}

	let sub = this.last.pick( tree );

	sub = sub.create( 'fontsize', val );

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
	return this.last.pick( tree ).fontsize;
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( 'fontsize' );
};


} );
