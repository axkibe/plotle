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
			If :
				require( '../code/if' ),
			Fail :
				require( '../code/fail' ),
			File :
				require( '../code/file' ),
			Func :
				require( '../code/func' ),
			FuncArg :
				require( '../code/func-arg' ),
			Term :
				require( '../code/term' ),
			VarDec :
				require( '../code/var-dec' ),
			VList :
				require( '../code/vlist' )
		},
	Generator =
		require( '../joobj/this' )( module ),
	Jools =
		require( '../jools/jools' ),
	Validator =
		require( './validator' );


/*
| Shortcut for creating assignments.
*/
var
Assign =
	function(
		left,
		right
	)
{
	return (
		Code.Assign.create(
			'left',
				left,
			'right',
				right
		)
	);
};


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
| Shortcut for variable declerations.
*/
/*
var
VarDec =
	function(
		name,   // variable name
		assign  // variable assignment
	)
{
	return (
		Code.VarDec.create(
			'name',
				name,
			'assign',
				assign || null
		)
	);
};
*/


/*
| Shortcut for creating vlists.
*/
var
VList =
	function( )
{
	return Code.VList.create( );
};



/*
| Initialized a generator
*/
Generator.prototype._init =
	function( )
{
	var
		attr,
		attributes =
			{ },
		attrList,
		jAttr,
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
		jAttr =
			joobj.attributes[ name ];

		if( jAttr.json )
		{
			this.hasJSON =
				true;
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				assign :
					jAttr.assign !== undefined ?
						jAttr.assign
						:
						name,
				comment :
					jAttr.comment,
				json :
					jAttr.json,
				name :
					name,
				vName :
					'v_' + name
			} );

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
			constructArgs.push(
				FuncArg(
					attr.vName,
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

	attrList =
		Object.keys( attributes );

	attrList.sort( );

	this.attrList =
		attrList;

	this.attributes =
		Object.freeze( attributes );

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
| Generates the imports section.
*/
Generator.prototype.genImportsSection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule.Comment(
			'Imports.'
		);

	capsule =
		capsule
			.VarDec( 'JoobjProto' )
			.VarDec( 'Jools' );

	return capsule;
};

/*
| Generates the node include section.
*/
Generator.prototype.genNodeIncludesSection =
	function(
		capsule // block to append to
	)
{
	var
		block;

	capsule =
		capsule.Comment(
			'Node includes.'
		);

	block =
		Block( )
		.Assign(
			Term( 'JoobjProto' ),
			Term( 'require( \'../src/joobj/proto\' )' )
		)
		.Assign(
			Term( 'Jools' ),
			Term( 'require( \'../src/jools/jools\' )' )
		);

	capsule =
		capsule.If(
			Term( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
Generator.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		block,
		constructor;

	capsule =
		capsule.Comment(
			'Constructor.'
		);

	block =
		Block( )
		.Check(
			Block( ).
			If(
				Term( 'tag !== ' + this.tag ),
				Block( )
					.Fail( )
			)
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				this.attrList[ a ],
			attr =
				this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		block =
			block.Assign(
				Term( 'this.' + attr.assign ),
				Term( attr.vName )
			);
	}

	block =
		block.Term(
			'Jools.immute( this )'
		);

	constructor =
		Func(
			this.constructArgs,
			block
		);

	if( this.unit )
	{
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
	}
	else
	{
		throw new Error( 'TODO' );
	}

	return capsule;
};


/*
| Generates the creators inheritance receiver.
*/
Generator.prototype.genCreatorInheritance =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		receiver =
			Block( )
			.Assign(
				Term( 'inherit' ),
				Term( 'this' )
			);

	if( this.twig )
	{
		throw new Error( 'TODO' );
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver.Assign(
				Term( attr.vName ),
				Term( 'this.' + attr.assign )
			);
	}

	return (
		block.If(
			Term( 'this !== ' + this.reference ),
			receiver
		)
	);
};


/*
| Generates the creators free strings parser.
*/
Generator.prototype.genCreatorFreeStrings =
	function(
		block // block to append to
	)
{
	var
		loop =
			Block( ).
			VarDec(
				'arg',
				Term( 'arguments[ a + 1 ]' )
			);

	block =
		block.For(
			VList( )
				.VarDec( 'a', Term( '0' ) )
				.VarDec( 'aZ', Term( 'arguments.length' ) ),
			Term( 'a < aZ' ),
			Term( 'a += 2' ),
			loop
		);

	return block;
};



/*
| Generates the creator.
*/
Generator.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		block,
		name;

	capsule =
		capsule.Comment(
			'Creates a new ' + this.name + ' object.'
		);

	block =
		Block( );

	// generates the variable list
	var
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].vName );
	}

	varList.push( 'inherit' );
	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.VarDec( varList[ a ] );
	}

	block =
		this.genCreatorInheritance( block );

	block =
		this.genCreatorFreeStrings( block );

	capsule =
		capsule
		.Assign(
			Term( this.reference + '.create' ),
			Assign(
				Term( this.reference + '.prototype.create' ),
				Func(
					[
						FuncArg( null, 'free strings' )
					],
					block
				)
			)
		);

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
		this.genImportsSection(
			capsule
		);

	capsule =
		this.genNodeIncludesSection(
			capsule
		);

	capsule =
		this.genConstructor(
			capsule
		);

	capsule =
		this.genCreator(
			capsule
		);

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
