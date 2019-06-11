/*
| A root of a trace
*/
'use strict';

tim.define( module, ( def, trace_root ) => {


def.singleton = true;

def.extend = './bare';


const tim_path = tim.require( 'tim.js/path' );

const trace_discs = tim.require( './discs' );

const trace_forms = tim.require( './forms' );

const trace_space = tim.require( './space' );



/*
| Returns a trace with a step to discs root appended.
*/
def.lazy.appendDiscs =
	function( )
{
	return trace_discs.create( 'list:append', this );
};


/*
| Returns a trace with a step to forms root appended.
*/
def.lazy.appendForms =
	function( )
{
	return trace_forms.create( 'list:append', this );
};


/*
| Returns a trace with a space appended.
*/
def.lazy.appendSpace =
	function( )
{
	return trace_space.create( 'list:append', this );
};


/*
| In case of a root trace returns the leaf.
*/
def.proto.graft = ( tree, leaf ) => leaf;


/*
| The root trace always has length 0.
*/
def.proto.length = 0;


/*
| Picks the traced leaf.
| In case of a root trace returns the tree.
*/
def.proto.pick = ( tree ) => tree;


/*
| FIXME remove
*/
def.lazy.toPath = function( ) { return tim_path.empty; };


} );
