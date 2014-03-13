/*
| Generates jooled objects from a jools definition.
|
| FIXME remove all mutable pushes
|
| Version 2
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'GenV2',
		node :
			true,
		attributes :
			{
				'joobj' :
					{
						comment :
							'the joobj definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	Code =
		{
			Assign :
				require( '../code/assign' ),
			Block :
				require( '../code/block' ),
			Check :
				require( '../code/check' ),
			Comment :
				require( '../code/comment' ),
			File :
				require( '../code/file' ),
			Func :
				require( '../code/func' ),
			FuncArg :
				require( '../code/func-arg' ),
			Term :
				require( '../code/term' )
		},
	Generator =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' ),
	Validator =
		require( './validator' );

/*
| Shortcut for creating blocks.
*/
var
Block =
	function( )
{
	return Code.Block.create( );
};


/*
| Shortcut for creating files.
*/
var
File =
	function( )
{
	return Code.File.create( );
};


/*
| Shortcut for creating function arguments.
*/
var
FuncArg =
	function(
		name,
		comment
	)
{
	return (
		Code.FuncArg.create(
			'name',
				name,
			'comment',
				comment
		)
	);
};


/*
| Shortcut for creating functions.
*/
var
Func =
	function(
		argList,
		block
	)
{
	var
		func =
			Code.Func.create(
				'block',
					block || null
			);

	if( argList )
	{
		for(
			var a = 0, aZ = argList.length;
			a < aZ;
			a++
		)
		{
			func =
				func.create(
					'twig:add',
					Jools.uid( ), // FIXME
					argList[ a ]
				);
		}
	}

	return func;
};


/*
| Shortcut for creating terms.
*/
var
Term =
	function( term )
{
	return (
		Code.Term.create(
			'term',
				term
		)
	);
};


/*
| Initialized a generator
*/
Generator.prototype._init =
	function( )
{
	var
		attr,
		joobj =
			this.joobj,
		name,
		constructArgs =
			[ ];

	this.unit =
		joobj.unit;

	this.name =
		joobj.name;

	this.hasJSON =
		!!joobj.json;

	this.tag =
		Math.floor( Math.random( ) * 1000000000 );

	for( name in joobj.attributes || { } )
	{
		attr =
			joobj.attributes[ name ];

		if( attr.json )
		{
			this.hasJSON =
				true;
			//jsonList.push( name );
		}

		if(
			attr.assign !== null
			||
			(
				joobj.init
				&&
				joobj.init.indexOf( name ) >= 0
			)
		)
		{
			var
				argName =
					'v_' + name;

			constructArgs.push(
				FuncArg(
					argName,
					attr.comment
				)
			);
		}
	}

	constructArgs.sort(
		function( o, p )
		{
			return Jools.compare( o.name, p.name );
		}
	);

	constructArgs.unshift(
		FuncArg(
			'tag',
			'magic cookie'
		)
	);

	this.constructArgs =
		Object.freeze( constructArgs );

	this.reference =
		( joobj.unit === joobj.name ) ?
			joobj.name + 'Obj'
			:
			joobj.name;

};


/*
| Creates the joobj data structures to work with.
*/
/*
var
buildJD =
	function(
		joobj
	)
{
	var
		attr,
		// alphabetical sorted attribute names
		attrList =
			[ ],
		attributes =
			{ },
		// list of all arguments passed to
		// constructor
		conVars =
			{ },
		name,
		jsonList =
			[ ],
		// units sorted alphabetically
		unitList =
			null,
		// units used
		units =
			{ };

	// list of attributes
	if( joobj.attributes )
	{
		for( name in joobj.attributes )
		{
			attr =
				joobj.attributes[ name ];

			attributes[ name ] =
				Object.freeze(
					{
						allowsNull :
							attr.allowsNull
							||
							attr.defaultValue === 'null',
						allowsUndefined :
							attr.allowsUndefined
							||
							attr.defaultValue === 'undefined',
						assign :
							attr.assign !== undefined
								?
								attr.assign
								:
								name,
						comment :
							attr.comment,
						concerns :
							attr.concerns,
						defaultValue :
							attr.defaultValue,
						json :
							attr.json,
						name :
							name,
						type :
							attr.type,
						unit :
							attr.unit,
						vName :
							'v_' + name
					}
				);

			if( attr.unit )
			{
				units[ attr.unit ] =
					true;
			}

			if( attr.json )
			{
				hasJSON =
					true;

				jsonList.push( name );
			}

			if(
				attr.assign !== null
				||
				(
					joobj.init
					&&
					joobj.init.indexOf( name ) >= 0
				)
			)
			{
				conVars[ name ] =
					Object.freeze(
						{
							name :
								name,
							comment :
								attr.comment,
							vName :
								attributes[ name ].vName
						}
					);
			}
		}

		attrList =
			Object
				.keys( joobj.attributes )
				.sort( );
	}

	unitList =
		Object.keys( units ).sort( );

	if(
		joobj.init
		&&
		joobj.init.indexOf( 'inherit' ) >= 0
	)
	{
		conVars.inherit =
			Object.freeze(
				{
					name :
						'inherit',
					comment :
						'inheritance',
					vName :
						'inherit'
				}
			);
	}

	if( joobj.twig )
	{
		conVars.twig =
			Object.freeze(
				{
					name :
						'twig',
					comment :
						'twig, set upon change',
					vName :
						'twig'
				}
			);

		conVars.ranks =
			Object.freeze(
				{
					name :
						'ranks',
					comment :
						'twig order, set upon change',
					vName :
						'ranks'
				}
			);

		if( hasJSON )
		{
			jsonList.push( 'twig' );
			jsonList.push( 'ranks' );
		}
	}

	var
		conList =
			Object.keys( conVars );

	conList.sort(
		function( o, p )
		{
			return (
				Jools.compare(
					conVars[ o ].vName,
					conVars[ p ].vName
				)
			);
		}
	);

	jsonList.sort( );

	return Object.freeze(
		{
			attrList :
				attrList,
			attributes :
				attributes,
			conList :
				conList,
			conVars :
				conVars,
			equals :
				joobj.equals,
			init :
				joobj.init,
			hasJSON :
				hasJSON,
			jsonList :
				jsonList,
			name :
				joobj.name,
			node :
				joobj.node,
			// in case unit and joobj are named identically
			// the shortcut will be renamed
			singleton :
				joobj.singleton,
			subclass :
				joobj.subclass,
			twig :
				joobj.twig,
			unitList :
				unitList
		}
	);
};
*/


/*
| Generates the constructor.
*/
Generator.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	block =
		Block( )
		.Check(
			Block( )
		);

	var
		constructor =
			Func( this.constructArgs, block );

	if( this.unit )
	{
		/*
		capsule =
			capsule.VarDec(
				this.reference,
				Assign(
					Term(
						this.unit + '.' + this.name
					),
					constructor
				)
			);
		*/
		capsule =
			capsule.Assign(
				Term(
					this.unit + '.' + this.name
				),
				Term( 'hallo' )
			);
	}
	else
	{
		throw new Error( 'TODO' );
	}

	/*
	capsule =
		capsule.Assign(
			this.unit ?
				[
					'var ' + this.reference,
					this.unit + '.' + this.name
				]
				:
				this.reference
			,
			constructor
		);
	*/

	return capsule;
};


/*
| Returns generator with the capsule generated.
*/
Generator.prototype.genCapsule =
	function( )
{
	var
		capsule =
			Block( );

	capsule =
		this.genConstructor( capsule );

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Generator.generate =
	function(
		joobj // the joobj definition
	)
{
	Validator.check( joobj );

	var
		file,
		gen;

	gen =
		Generator.create(
			'joobj',
				joobj
		);


	file =
		File( )
		.Header(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		).Capsule(
			gen.genCapsule( )
		);

	return file;
};


/*
| Node export
*/
if( SERVER )
{
	module.exports =
		Generator;
}


} )( );
