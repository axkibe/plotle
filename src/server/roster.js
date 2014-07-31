/*
| The roster of all resources.
|
| Authors: Axel Kittenberger
*/

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Imports
*/
var
	Resource;

Resource = require( './resource' );


module.exports =
[
	Resource.Create(
		'aliases',
			[
				'meshcraft.html',
				'index.html',
				''
			],
		'filePath',
			'media/meshcraft.html',
		'maxage',
			'short',
		'postProcessor',
			'indexHtml'
	),
	Resource.Create(
		'aliases',
			[ 'devel.html' ],
		'filePath',
			'media/devel.html',
		'devel',
			true,
		'postProcessor',
			'develHtml'
	),
	Resource.Create(
		'filePath',
			'media/favicon.ico',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'webfont/webfont.js',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'src/jion/proto.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jools/jools.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jools/sha1.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/path.js',
		'inBundle',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/sign.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/sign-ray.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/change.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/change-ray.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/jion/change-wrap.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/point.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/rect.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/fontpool.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/theme.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/const.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/compass.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/margin.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/font.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/fabric.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/measure.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/shape.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/round-rect.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/ellipse.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/line.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/euclid/view.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-point.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-rect.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/design/anchor-ellipse.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/widget.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/getstyle.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/button.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/input.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/checkbox.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/widgets/label.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/style.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/accent.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/channel.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/ajax.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/net/link.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/peer.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/icons.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/disc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/createdisc.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/maindisc.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/discs/jockey.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/hover-reply.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/form.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/login.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/signup.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/moveto.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/user.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/welcome.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/no-access-to-space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/non-existing-space.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/forms/jockey.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/maindisc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/createdisc.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/login.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/moveto.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/no-access-to-space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/non-existing-space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/signup.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/space.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/user.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/gruga/welcome.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/para.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/scrollbar.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/doc.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/doc-item.js',
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/note.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/label.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/relation.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/portal.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/visual/space.js',
		'hasJion',
			true,
		'inBundle',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/stubs.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/system.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/mark.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/caret.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/item.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/range.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/vacant.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/mark/widget.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/action.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/none.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/create-generic.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/create-relation.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/item-drag.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/item-resize.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/pan.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/action/scrolly.js',
		'hasJion',
			true,
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/shell.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'src/shell/fontloader.js',
		'inBundle',
			true
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/style.css',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/boldoblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/bold-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/oblique-webfont.woff',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.eot',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.svg',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.ttf',
		'maxage',
			'long'
	),
	Resource.Create(
		'filePath',
			'media/dejavusans/webfont.woff',
		'maxage',
			'long'
	),

	// --- TestPad ---
	Resource.Create(
		'aliases',
			[ 'testpad.html' ],
		'filePath',
			'media/testpad.html',
		'devel',
			true,
		'postProcessor',
			'testPadHtml'
	),
	Resource.Create(
		'filePath',
			'src/testpad/iface-sym.js',
		'devel',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/testpad/action.js',
		'devel',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'filePath',
			'src/testpad/testpad.js',
		'devel',
			true,
		'hasJion',
			true,
		'inTestPad',
			true
	),
	Resource.Create(
		'aliases',
			[ 'torrent/PeridexisErrant%20LNP%20r53.torrent' ],
		'filePath',
			'torrent/PeridexisErrant%20LNP%20r53.torrent'
	),
];


} )( );
