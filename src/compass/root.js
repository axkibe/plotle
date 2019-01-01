/*
| Compass root
*/
'use strict';


tim.define( module, ( def ) => {


const compass_nw = require( './nw' );

const compass_n = require( './n' );

const compass_ne = require( './ne' );

const compass_e = require( './e' );

const compass_se = require( './se' );

const compass_s = require( './s' );

const compass_sw = require( './sw' );

const compass_w = require( './w' );


/*
| North-west.
*/
def.staticLazy.nw = ( ) => compass_nw.create( );


/*
| North.
*/
def.staticLazy.n = ( ) => compass_n.create( );


/*
| North-east.
*/
def.staticLazy.ne = ( ) => compass_ne.create( );


/*
| East.
*/
def.staticLazy.e = ( ) => compass_e.create( );


/*
| South-east.
*/
def.staticLazy.se = ( ) => compass_se.create( );


/*
| South.
*/
def.staticLazy.s = ( ) => compass_s.create( );


/*
| South-west.
*/
def.staticLazy.sw = ( ) => compass_sw.create( );


/*
| West.
*/
def.staticLazy.w = ( ) => compass_w.create( );


} );
