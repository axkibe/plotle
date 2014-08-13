/*
| The space form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;


Forms = Forms || { };


/*
| Imports
*/
var
	jools;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Space',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								unit :
									'Forms',
								type :
									'Form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null,
						assign :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
						concerns :
							{
								member :
									'sizeOnly'
							},
						defaultValue :
							undefined
					}
			},
		subclass :
			'Forms.Form',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'form-widgets'
	};
}


var
	Space =
		Forms.Space;


/*
| The space form.
*/
Space.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	if( this.path )
	{
		if( !twigDup )
		{
			this.twig = jools.copy( this.twig );
		}

		this.twig.headline =
			this.twig.headline.create(
				'text',
					this.spaceUser + ':' + this.spaceTag
			);
	}

	Forms.Form.init.call(
		this,
		inherit
	);
};


} )( );
