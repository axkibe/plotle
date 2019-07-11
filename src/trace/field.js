/*
| A trace into a field (on an item).
*/
'use strict';


tim.define( module, ( def, trace_field ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// key of the field
		key : { type : 'string' },
	};

	def.json = './base';

	// path of trace back.
	def.list = [ './root', './space', './item' ];
}


const trace_base = tim.require( './base' );

const trace_offset = tim.require( './offset' );

const trace_text = tim.require( './text' );


/*
| Returns a trace with an offset appended.
*/
def.lazyFuncInt.appendOffset =
	function(
		at // offset
	)
{
	return trace_offset.create( 'list:init', this, 'list:append', this, 'at', at );
};


/*
| Returns a trace with a doc part appended.
*/
def.lazy.appendText =
	function( )
{
	return trace_text.create( 'list:init', this, 'list:append', this );
};


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)field', this.key ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'field(' + this.key + ')';
};


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
/**/	if( trace[ pos ] !== '(o)field' ) throw new Error( );
/**/}

	const key = trace[ pos + 1 ];

	return trace_base.createFromJSONTrace( trace, pos + 2 ).appendField( key );
};


/*
| Grafts a new leaf on a tree.
| In case of a root trace returns the leaf.
*/
def.proto.graft =
	function(
		tree,
		leaf
	)
{
	let sub = this.last.pick( tree );

	sub = sub.create( this.key, leaf );

	if( this.length === 0 ) return sub;

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
	if( this.length === 0 ) return tree;

	return this.last.pick( tree )[ this.key ];
};


/*
| FIXME remove.
*/
def.lazy.toPath =
	function( )
{
	return this.get( this.length - 1 ).toPath.append( this.key );
};


} );
