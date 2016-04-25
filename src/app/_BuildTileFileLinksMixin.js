/* global dojo, raster, console, rasterglobal, rasterapp */
dojo.provide('raster._BuildTileFileLinksMixin');

dojo.declare('raster._BuildTileFileLinksMixin', null, {
    // summary:
    //      builds links for downloading files associated with the current tile
    //      Used in raster.TilePopup & raster.Tile
    
    constructor: function (params) {
        // summary:
        //      description
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        params.graphic.attributes[rasterglobal.fields.indices.SIZE_FORMATTED] = 
            rasterapp.getMbOrGb(params.graphic.attributes[rasterglobal.fields.indices.SIZE]);
    
        dojo.mixin(this, params.graphic.attributes);

        // fix url
        this.PATH = this.PATH.replace('ftp://', 'http://');
    },
    buildFileLinks: function () {
        // summary:
        //        
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // handle geopdf links
        if (!this.EXT) {
            this.TILE = this.NAME;
            this.titleSpan.innerHTML = this.NAME;
            this.tileLink.innerHTML = 'PDF';
            this.tileLink.target = '_blank';
        }

        this.createExtraFileLink(this[rasterglobal.fields.indices.WORLDFILE], true);
        this.createExtraFileLink(this[rasterglobal.fields.indices.METADATA], true);
        this.createExtraFileLink(this.EXTENT_ATTRIBUTES[rasterglobal.fields.common.METADATA], false);
        this.createExtraFileLink(this.EXTENT_ATTRIBUTES[rasterglobal.fields.common.REPORT], false);
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
        console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

        // only create link if there is a value in that field
        if (!ext || ext === null || ext === 'Null') {
            return;
        }
    
        dojo.create('span', {innerHTML: ', '}, this.extraFilesSpan);
        var url = this.PATH;
        if (useTileName) {
            url = url + this.TILE;
        }
        url = url + ext;

        var txt = (linkName) ? linkName : ext;

        dojo.create('a', {
            href: url,
            innerHTML: txt,
            target: '_blank'
        }, this.extraFilesSpan);
    }
});