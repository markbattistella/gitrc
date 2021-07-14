#!/usr/bin/env node

//
// MARK: safety first
//
'use strict'





//
// MARK: import the modules / variables
//

// access file system
const fs = require( 'fs' );

// access operating system
const os = require( 'os' );

// access the path
const path = require( 'path' );

// get the .gitconfig file
const GITCONFIG = (
	process.env.GITCONFIG	||
	path.join(
		process.env.HOME	||
		process.env.USERPROFILE, '.gitconfig'
	)
);

// get the .gitconfigs directory
const GITCONFIGS = (
	process.env.GITCONFIGS	||
	path.join(
		process.env.HOME	||
		process.env.USERPROFILE, '.gitconfigs'
	)
);

// blank variables
let options, name;





//
// MARK: - functions
//

// function: help display
function listHelpMessage() {

	// log the message to display
	console.log(
		"-----------------------------------------------" + "\n"   +
		"------               gitrc               ------" + "\n"   +
		"-----------------------------------------------" + "\n\n" +
		"Easily switch between different gitconfig files" + "\n\n" +
		"Usage:"                                          + "\n"   +
		"  gitrc               List all profiles"         + "\n"   +
		"  gitrc [name]        Switch to profile"         + "\n"   +
		"  gitrc -n [name]     Create a new profile"      + "\n"   +
		"  gitrc -d [name]     Delete the profile"        + "\n"   +
		"  gitrc -h            Display this screen"       + "\n"
	);

	// successful exit
	process.exit( 0 );
}

// function: list all configs
function listAllConfigs() {

	// list the title
	console.log( "Available .gitconfig files:\n" );

	// return the symbolic link value
	fs.readlink( GITCONFIG, ( err, linkString ) => {

		// get the symbolic link value
		// -- returns the actual file name
		linkString = linkString && path.basename( linkString );

		// read the contents of the directory
		fs.readdirSync( GITCONFIGS ).forEach( ( configurations ) => {
			if( configurations[ 0 ] !== '.' ) {

				// list the file names
				// -- if the active config mark it
				console.log(
					' %s %s',
					linkString == configurations ? '>' : ' ',
					configurations
				);
			}
		});
	});
}

// function: check if existing file is symbolic
function isConfigFileSymbolicLink( file ) {

	// if the .gitconfig file is not a symbolic link file
	if( !file.isSymbolicLink() ) {

		// log the message to display
		console.log(
			'The current .gitconfig file (%s) is not a symbolic link. You may want to move this into %s.', GITCONFIG, GITCONFIGS
		);

		// unsuccessful exit
		process.exit( 1 );
	}
}

// function: create the symbolic link
function createSymbolicLinkFile( name ) {

	var ln = path.join( GITCONFIGS, name || '' ),
		stat;

	// if the file doesnt exist
	if( ln == GITCONFIGS || !fs.existsSync( ln ) ) {
		console.error( 'Couldn\'t find .gitconfig file: "%s"', name );

		// exit out - unsuccessful
		return process.exit( 1 )
	}

	//
	try {
		stat = fs.lstatSync( GITCONFIG );

		// check if is symbolic link
		isConfigFileSymbolicLink( stat );

	// catch nothing
	} catch( e ) {}

	// if the config exists
	if( stat ) {
		console.log(
			'Removing old .gitconfig (%s)',
			path.basename( fs.readlinkSync( GITCONFIG ) )
		);

		// destroy the symbolic link
		fs.unlinkSync( GITCONFIG );
	}

	// generate a new symbolic link
	// -- display message
	console.log(
		'Activating .gitconfig: "%s"',
		path.basename( ln )
	);

	// -- create the link
	fs.symlinkSync( ln, GITCONFIG, 'file' );
}

// function: create new .gitconfig
// -- gitrc -n [name]
function createNewGitConfig() {

	// no name provided
	if( !name ) {
		console.error( 'What do you want to call your new .gitconfig file?\n' );
		console.error( 'Usage: gitrc -n [name]\n' );
		return process.exit( 1 );
	}

	// get the pathway for creation
	var newFilename = path.join( GITCONFIGS, name );

	// that name is already exists
	if( fs.existsSync( newFilename ) ) {
		console.log(
			'.gitconfig file "%s", already exists (%s/%s)',
			name,
			GITCONFIGS,
			name
		);

		// exit - unsuccessful
		return process.exit( 1 );
	}

	// write the file to the directory
	fs.writeFileSync( newFilename, '' );
}

// function: delete selected .gitconfig
// -- gitrc -d [name]
function deleteGitConfig() {

	// no name provided
	if( !name ) {
		console.error( 'What .gitconfig file did you want to delete?\n' );
		console.error( 'Usage: gitrc -d [name]\n' );
		return process.exit( 1 );
	}

	// get the pathway for deletion
	let newFilename = path.join( GITCONFIGS, name );

	// that name is exists
	if( fs.existsSync( newFilename ) ) {
		console.log(
			'Deleting .gitconfig file "%s"\n',
			name
		);

		// if the current active config is being deleted
		if(
			fs.existsSync( GITCONFIG ) &&
			newFilename == fs.readlinkSync( GITCONFIG )
		) {
			console.log( 'Current active config is being deleted.\n' );
			console.log( 'Remember to set a new one before use.\n' );

			// delete the link
			fs.unlinkSync( GITCONFIG );
		}

		// delete the file
		fs.unlinkSync( newFilename );

		// exit - successful
		return process.exit( 0 );

	// if no file found
	} else {

		// report if name doesnt exist
		console.error(
			'.gitconfig file with the name "%s" doesn\'t exist',
			name
		);

		// exit - unsuccessful
		return process.exit( 1 );
	}
}





//
// MARK: - self executed functions
//

// self-exe: get the command line arguments
( function processCmdline() {

	// get the options
	// -- only use the first one
	// -- since we are only creating, deleting, or helping at once
	options = process.argv.slice( 2 ).map( (a) => {
		return a[ 0 ] == '-' && a.replace( /^-+/, '' )[ 0 ];
	}).filter( Boolean );

	// first non '-' arg
	// -- sets it as the "name" variable
	name = process.argv.slice( 2 ).filter( (a) => {
		return a[ 0 ] != '-';
	})[ 0 ];

 	// other known options go here
	options.filter( ( o ) => {
		if( o == 'n' || o == 'd' || o == 'h' ) {
			return false
		} else {
			console.error( 'Unknown option: -' + o );
			return true
		}
	}).length && listHelpMessage();

	// display the help message
	if( options.indexOf( 'h' ) > -1 ) {
		listHelpMessage();
	}
}());

// self-exe: set up .gitconfigs directory if it doesn't exist
( function createGitConfigDirectory() {

	// try if the directory is set up and working
	try {

		// return information about file path
		var stat = fs.statSync( GITCONFIGS );

		// if it is not a directory
		if( !stat.isDirectory() ) {

			// log it
			console.error( 'Error: %s is not a directory', GITCONFIGS );

			// exit - unsuccessful
			process.exit( 1 );
		}

	} catch( e ) {

		//
		var def = path.join( GITCONFIGS, 'default' );

		// log the init
		console.log( 'Initialising gitrc!' );
		console.log( 'Creating directory: %s', GITCONFIGS );

		// create the directory synchronously
		fs.mkdirSync( GITCONFIGS );

		// check if file already exists in the given path or not
		if( fs.existsSync( GITCONFIG ) ) {

			// log it
			console.log( 'Making %s the default .gitconfig file', GITCONFIG );
			fs.renameSync( GITCONFIG, def );

		} else {

			// creates a new file if the specified file does not exist
			fs.writeFileSync( def, '' );
		}

		// run the symbolic link function
		createSymbolicLinkFile( 'default' );

		// exit - successful
		process.exit( 0 );
	}
}());

// no name and no args
if( !name && !options.length ) {
	return listAllConfigs();
}

// create the new config if option is selected
if( ~options.indexOf( 'n' ) ) {
	createNewGitConfig();
}

// create the new config if option is selected
if( ~options.indexOf( 'd' ) ) {
	deleteGitConfig();
}

// self-exe: check if the switch is required
( function checkExistingConfiguration() {

	var stat;

	try {
		stat = fs.lstatSync( GITCONFIG );
		isConfigFileSymbolicLink( stat );

	// no errors
	} catch( e ) {}

	// selected one is already active
	if(
		name &&
		stat &&
		fs.readlinkSync( GITCONFIG ) == path.join( GITCONFIGS, name )
	) {

		// log it to user
		console.log(
			'Current .gitconfig (%s) is already "%s" (%s/%s)',
			GITCONFIG,
			name,
			GITCONFIGS,
			name
		);

		// exit - successful
		return process.exit( 0 );
	}
}());

// switch to the config
createSymbolicLinkFile( name );
