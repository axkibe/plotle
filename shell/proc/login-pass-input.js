/*
| Login panel, Password input.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Proc;
Proc = Proc || {};


/*
| Imports
*/
var Dash;
var Jools;


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var LoginPassInput = Proc.LoginPassInput =
	function(
		twig,
		panel,
		inherit,
		name
	)
{
	Dash.Input.call(
		this,
		twig,
		panel,
		inherit,
		name
	);
};


Jools.subclass(
	LoginPassInput,
	Dash.Input
);


/*
| Password input field
*/
LoginPassInput.prototype.keyEnter =
	function( )
{
	Proc.util.login( this.panel );
};

})();
