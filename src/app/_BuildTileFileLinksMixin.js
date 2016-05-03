define([
    'app/config',

    'dojo/dom-construct',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    config,

    domConstruct,
    declare,
    lang
) {
    return declare(null, {
        // summary:
        //      builds links for downloading files associated with the current tile
        //      Used in raster.TilePopup & raster.Tile

        constructor: function (params) {
            // summary:
            //      description
            console.log('app/_BuildTileFileLinksMixin:constructor', arguments);

            params.graphic.attributes[config.fields.indices.SIZE_FORMATTED] =
            window.rasterapp.getMbOrGb(params.graphic.attributes[config.fields.indices.SIZE]);

            lang.mixin(this, params.graphic.attributes);

            // fix url
            this.PATH = this.PATH.replace('ftp://', 'http://');
        },
        buildFileLinks: function () {
            // summary:
            //
            console.log('app/_BuildTileFileLinksMixin:buildFileLinks', arguments);

            // handle geopdf links
            if (!this.EXT) {
                this.TILE = this.NAME;
                this.titleSpan.innerHTML = this.NAME;
                this.tileLink.innerHTML = 'PDF';
                this.tileLink.target = '_blank';
            }

            this.createExtraFileLink(this[config.fields.indices.WORLDFILE], true);
            this.createExtraFileLink(this[config.fields.indices.METADATA], true);
        },
        createExtraFileLink: function (ext, useTileName, linkName) {
            // summary:
            //      creates an anchor tag and span with a comma
            // ext: String
            //      The filename or just extension of the file
            // useTileName: Boolean
            //      Determines whether or not the tile name is used in constructing
            //      the url.
            // linkName: String [optional]
            //      If provided, this is used for the innerHTML of the link instead of
            //      ext.
            console.log('app/_BuildTileFileLinksMixin:createExtraFileLink', arguments);

            // only create link if there is a value in that field
            if (!ext || ext === null || ext === 'Null') {
                return;
            }

            domConstruct.create('span', {innerHTML: ', '}, this.extraFilesSpan);
            var url = this.PATH;
            if (useTileName) {
                url = url + this.TILE;
            }
            url = url + ext;

            var txt = (linkName) ? linkName : ext;

            domConstruct.create('a', {
                href: url,
                innerHTML: txt,
                target: '_blank'
            }, this.extraFilesSpan);
        }
    });
});
