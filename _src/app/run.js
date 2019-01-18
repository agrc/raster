(function () {
    require({ baseUrl: './' }, ['dojo/parser', 'jquery', 'babel-polyfill', 'dojo/domReady!'], function (parser) {
        parser.parse();
    });
}());
