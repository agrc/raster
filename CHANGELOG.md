# Changelog

## [3.0.2-rc.3](https://github.com/agrc/raster/compare/v3.0.2...v3.0.2-rc.3) (2026-01-15)


### Bug Fixes

* a11y fixes and improvements ([5194ea5](https://github.com/agrc/raster/commit/5194ea5e6928cb1619d5aa82491a0d8900592540))


### Dependencies

* bump npm dependencies 🌲 ([63ac0d4](https://github.com/agrc/raster/commit/63ac0d4dcb20019edf6e8344fb80aff1b1692c7d))

## [3.0.2](https://github.com/agrc/raster/compare/v3.0.1...v3.0.2) (2026-01-12)


### Features

* add place search component to map ([e691300](https://github.com/agrc/raster/commit/e691300e7d39257070b61ab82f2ddebbc153244a)), closes [#253](https://github.com/agrc/raster/issues/253)


### Bug Fixes

* bump react-aria-components to get bug fix ([a46928c](https://github.com/agrc/raster/commit/a46928c1e2e40510d810cdfa9bb29e5f2519ef02)), closes [#244](https://github.com/agrc/raster/issues/244)
* fix search button tooltip and test ([5867857](https://github.com/agrc/raster/commit/586785772b75cba3bbe60f08f6113d4b87f37e0a))
* prevent tiles found and preview banners from overlapping ([8e36419](https://github.com/agrc/raster/commit/8e364190eb6b3be16e0b97daab65d83ecbbb71d3)), closes [#288](https://github.com/agrc/raster/issues/288)


### Dependencies

* bump npm dependencies 🌲 ([586e81f](https://github.com/agrc/raster/commit/586e81feb08b335d71e83623c07ce9860712d5a1))

## [3.0.2-rc.2](https://github.com/agrc/raster/compare/v3.0.1...v3.0.2-rc.2) (2026-01-09)


### Features

* add place search component to map ([f70e481](https://github.com/agrc/raster/commit/f70e4819072d4dfad0d7312200ee063b2b95d212)), closes [#253](https://github.com/agrc/raster/issues/253)


### Bug Fixes

* bump react-aria-components to get bug fix ([a6c2b88](https://github.com/agrc/raster/commit/a6c2b88de3022a24727e916afa1347ad486e70d5)), closes [#244](https://github.com/agrc/raster/issues/244)
* fix search button tooltip and test ([91d710b](https://github.com/agrc/raster/commit/91d710bab1283e1856dba881e0fb941b8ca5f93f))
* prevent tiles found and preview banners from overlapping ([e27f09d](https://github.com/agrc/raster/commit/e27f09dbd3e2d19d113a8a3ee0d7ab6ed18146bc)), closes [#288](https://github.com/agrc/raster/issues/288)


### Dependencies

* bump npm dependencies 🌲 ([a94a5e6](https://github.com/agrc/raster/commit/a94a5e647b68e3d77968b606082d34006d05cad4))

## [3.0.2-rc.1](https://github.com/agrc/raster/compare/v3.0.1...v3.0.2-rc.1) (2026-01-02)


### Features

* add place search component to map ([f70e481](https://github.com/agrc/raster/commit/f70e4819072d4dfad0d7312200ee063b2b95d212)), closes [#253](https://github.com/agrc/raster/issues/253)
* add tool for copying bulk download snippets for various tools ([d667068](https://github.com/agrc/raster/commit/d667068c1e15a49a931d1a87b81f82a074110c67)), closes [#165](https://github.com/agrc/raster/issues/165)


### Bug Fixes

* bump react-aria-components to get bug fix ([a6c2b88](https://github.com/agrc/raster/commit/a6c2b88de3022a24727e916afa1347ad486e70d5)), closes [#244](https://github.com/agrc/raster/issues/244)
* prevent tiles found and preview banners from overlapping ([e27f09d](https://github.com/agrc/raster/commit/e27f09dbd3e2d19d113a8a3ee0d7ab6ed18146bc)), closes [#288](https://github.com/agrc/raster/issues/288)


### Dependencies

* bump npm dependencies 🌲 ([a94a5e6](https://github.com/agrc/raster/commit/a94a5e647b68e3d77968b606082d34006d05cad4))

## [3.0.1](https://github.com/agrc/raster/compare/v3.0.0...v3.0.1) (2025-12-09)


### Bug Fixes

* fix layer selector by downgrading @arcgis/map-components package ([fbae6ca](https://github.com/agrc/raster/commit/fbae6cacd95502a982ab1d83fa965cd3aaa6a1e2)), closes [#259](https://github.com/agrc/raster/issues/259)

## [3.0.0](https://github.com/agrc/raster/compare/v2.5.11...v3.0.0) (2025-12-08)


### ⚠ BREAKING CHANGES

* Total rewrite to use modern libraries
    - Esri API for JavaScript 4.x
    - Implement Utah Design System including many accessibility improvements
    - Added visual cues for downloaded tiles
    - Added support for dark mode
    - Fixed a variety of bugs

### Features

* rewrite application using modern libraries ([9bce3e6](https://github.com/agrc/raster/commit/9bce3e62948a6b0878db6c8d0929992031075686))


### Dependencies

* bump the safe-dependencies group with 2 updates ([2de7811](https://github.com/agrc/raster/commit/2de78113cffdca97ee2746c0c6618bdec0e095d5))

## [3.0.0-rc.10](https://github.com/agrc/raster/compare/v3.0.0-rc.9...v3.0.0-rc.10) (2025-12-05)


### Bug Fixes

* add light background to qualtrics survey ([d4c8990](https://github.com/agrc/raster/commit/d4c899032b519278602855e48d9e0e4f00f0d339)), closes [#271](https://github.com/agrc/raster/issues/271)
* add temporary patch to fix upstream disclosure bug ([85c856f](https://github.com/agrc/raster/commit/85c856f4fb139676dc1e56033319bd3fd493b6d8)), closes [#244](https://github.com/agrc/raster/issues/244)
* fix bug preventing visual download clues from working when downloading via map popup ([283cdf6](https://github.com/agrc/raster/commit/283cdf66879eb3c5aee2f405a0aafae1d337b3be))

## [3.0.0-rc.9](https://github.com/agrc/raster/compare/v2.5.11...v3.0.0-rc.9) (2025-11-25)


### ⚠ BREAKING CHANGES

* This is a total rewrite of the application

### Features

* add home button ([67d026a](https://github.com/agrc/raster/commit/67d026af02159912fcbdf52188d720c9930a9c1a)), closes [#217](https://github.com/agrc/raster/issues/217)
* add lidar link to header menu ([c359b7d](https://github.com/agrc/raster/commit/c359b7ddd1ce9e0c5c1e0699a3d7fbff75c04eae)), closes [#227](https://github.com/agrc/raster/issues/227)
* add links to base map and aerial photography pages ([1d3cdb0](https://github.com/agrc/raster/commit/1d3cdb06bf988f5f95dc9dc69c5e0135bd694a23)), closes [#227](https://github.com/agrc/raster/issues/227)
* add metadata and report links to download ([9352117](https://github.com/agrc/raster/commit/9352117f77480aaccd1d95febbf7fbe501316a68)), closes [#218](https://github.com/agrc/raster/issues/218)
* add more info & web page links & download button ([2b49e03](https://github.com/agrc/raster/commit/2b49e036d0ed82b9b062222b06b797b00b7103e7)), closes [#221](https://github.com/agrc/raster/issues/221)
* add qualtrics survey ([3f983d9](https://github.com/agrc/raster/commit/3f983d9d07914ac299314d78e9f0495ebe803649))
* add request timeouts and retry buttons where appropriate ([1325db1](https://github.com/agrc/raster/commit/1325db1cd19956e76c928bc8d08aa298f674ae59)), closes [#223](https://github.com/agrc/raster/issues/223)
* add uds tooltips ([c961ad8](https://github.com/agrc/raster/commit/c961ad8a414e977e116bddc92d9b5ae1006e0fc4)), closes [#220](https://github.com/agrc/raster/issues/220)
* add year collected to lidar category labels ([d621a0d](https://github.com/agrc/raster/commit/d621a0dd1301ebc8e30a7db8713721b2e525869e)), closes [#168](https://github.com/agrc/raster/issues/168)
* basic tile download list and popup ([ecba668](https://github.com/agrc/raster/commit/ecba668d5763a01247cb5e44b9f2ebe7cc0bb13e)), closes [#218](https://github.com/agrc/raster/issues/218)
* cache all queries for 30 minutes ([9655e4e](https://github.com/agrc/raster/commit/9655e4e8e6a134668d3f7c2562a9fe1535a96109))
* create state machine and model product type selection ([4427ea2](https://github.com/agrc/raster/commit/4427ea21cbb5cb48362eb057882ea1340a77992f)), closes [#220](https://github.com/agrc/raster/issues/220)
* Firebase Analytics tracking for user interactions ([7952908](https://github.com/agrc/raster/commit/7952908f6bb47e2dc1d10bf4a3fc16be783cadfa)), closes [#215](https://github.com/agrc/raster/issues/215)
* implement area of interest definition ([04bd6e1](https://github.com/agrc/raster/commit/04bd6e16734bc071bb4b4659a89a0f438fdd9307)), closes [#213](https://github.com/agrc/raster/issues/213)
* implement extents searching ([4074816](https://github.com/agrc/raster/commit/4074816eebf3e9dff7953fa362c82efee79a2376)), closes [#222](https://github.com/agrc/raster/issues/222)
* implement map loading busy bar indicator ([7cfd63f](https://github.com/agrc/raster/commit/7cfd63ffe3f6043cdc443c5281fc55e5dc92cb6d))
* implement more info dialog ([5411302](https://github.com/agrc/raster/commit/54113020aa982f10f4df58812935b814d83a2356)), closes [#223](https://github.com/agrc/raster/issues/223)
* implement preview functionality ([86f9704](https://github.com/agrc/raster/commit/86f9704de0999212b7a6ce09975e6fd1121ed8f2)), closes [#221](https://github.com/agrc/raster/issues/221)
* implement tile download limits and error handling for exceeded tile requests ([f851ef7](https://github.com/agrc/raster/commit/f851ef7ed74bd8f77ff030d82bb59e62576659f4))
* implement URL parameters ([41110ed](https://github.com/agrc/raster/commit/41110ed0b4082cbe5e1e58579155448097abd565)), closes [#212](https://github.com/agrc/raster/issues/212)
* implement zoom to extent button and show extent on hover ([17e5d87](https://github.com/agrc/raster/commit/17e5d87f4d538fe3c869f40ea799c3afff1633f4)), closes [#221](https://github.com/agrc/raster/issues/221)
* indicate which tiles have been downloaded ([ca11c96](https://github.com/agrc/raster/commit/ca11c962f3130c6ca6ac5ca74f3dd40abfd4d38b)), closes [#247](https://github.com/agrc/raster/issues/247)
* save clicks by auto-expanding tree items that are single children ([9ed8530](https://github.com/agrc/raster/commit/9ed853060a5dfe145d1c97580341f418084b4baa)), closes [#221](https://github.com/agrc/raster/issues/221)
* show search results grouped by product type and category ([48c076d](https://github.com/agrc/raster/commit/48c076d5d5944e7f61b13041cd1bbdcf1d6adccd)), closes [#221](https://github.com/agrc/raster/issues/221)
* show search results in a tree structure ([21ed003](https://github.com/agrc/raster/commit/21ed0039a42d6a0d67aa1f3a4b0ff215333bd554)), closes [#221](https://github.com/agrc/raster/issues/221)


### Bug Fixes

* add imagery as an additional base map option ([a7601bb](https://github.com/agrc/raster/commit/a7601bb3453465a93ee9a59a6b5f5903734df2f1)), closes [#214](https://github.com/agrc/raster/issues/214)
* add UGRC to lidar link text ([3b8ba21](https://github.com/agrc/raster/commit/3b8ba21e04293b99a9d210c83e8e0848105ca9ab))
* better logic for clearing old tile map layers ([1c3e3f8](https://github.com/agrc/raster/commit/1c3e3f82160b29ef6ca53635510a268e0b81d783))
* clear any existing AOI if a new sketch tool is activated ([a19cd54](https://github.com/agrc/raster/commit/a19cd5452cfed4ffceec261834916da64a5a1da2)), closes [#221](https://github.com/agrc/raster/issues/221)
* disable drawing toolbar when search is triggered ([b77393c](https://github.com/agrc/raster/commit/b77393c011bf0a1664b02f0e49a61ba425d121a4))
* don't run firebase performance in dev ([5761499](https://github.com/agrc/raster/commit/5761499ef5bb46fefb7633f77f62673b8544fdf1))
* expand default extent to better fit the state of utah ([7b1cd23](https://github.com/agrc/raster/commit/7b1cd2311281454567e15789c5114195d68e7e00)), closes [#217](https://github.com/agrc/raster/issues/217)
* fix bug causing multiple taps on the extent button from zooming the map out continually ([0e243ed](https://github.com/agrc/raster/commit/0e243edbfd2e6bafd64e1ed398663d09de3124fb))
* fix bug preventing previous download tile layers from being removed ([e134732](https://github.com/agrc/raster/commit/e134732643a87f6168d931297b9e939feb3cfd09))
* make sure that the preview does not cover up the AOI graphic ([c0a8d8d](https://github.com/agrc/raster/commit/c0a8d8de71ab8a60af9b6486f07b14677c9c0a76))
* move year in lidar categories to parenthesis ([a0d3c04](https://github.com/agrc/raster/commit/a0d3c0482ee83efcbf6dd62735b3f7163a9c3959)), closes [#168](https://github.com/agrc/raster/issues/168)
* prevent app from attempting to load before mapview is ready ([3ca0af3](https://github.com/agrc/raster/commit/3ca0af31b275500815aa3e34b08d2fe4e845d1c5))
* prevent blank base maps ([68766ea](https://github.com/agrc/raster/commit/68766ea93e196a749f9538abba5a536b72ddf6ac))
* provide more consistent ordering of products within categories ([94c9eb9](https://github.com/agrc/raster/commit/94c9eb92bf9ee6a6d0379a4a2465242546cacdd7)), closes [#234](https://github.com/agrc/raster/issues/234)
* remove curly brace text in product names ([2153bb9](https://github.com/agrc/raster/commit/2153bb9ebe48e0bea01329e98548a72831ae188d))
* reset AOI when selected product types changes ([67b8995](https://github.com/agrc/raster/commit/67b8995bbfc5cd6631ec744e4106261948394bb0))
* set appropriate base map options ([4d4145a](https://github.com/agrc/raster/commit/4d4145a3aab9640b67f15c626f5fe5cba00a7375)), closes [#214](https://github.com/agrc/raster/issues/214)
* show extents on hovering over product card contents, not just header ([14b5c96](https://github.com/agrc/raster/commit/14b5c965ed7aa4ca34a0316c5d8369327903998e))
* start fresh with atlas template ([83db5a3](https://github.com/agrc/raster/commit/83db5a325fc78dc2b8078e7fded96950b915900f))


### Documentation

* document lidar category naming convention ([5eed9c1](https://github.com/agrc/raster/commit/5eed9c1085622e6adf132fa3fe22588624182134))
* import architecture and schema-report docs ([c65ba95](https://github.com/agrc/raster/commit/c65ba95f36aaac7df7264c77eda1e1da28668239))


### Styles

* add left margin to categories ([d03699f](https://github.com/agrc/raster/commit/d03699f451dacef4ed7ad83d431cad472458e8fd))
* better alignment of more info & download buttons ([eb66597](https://github.com/agrc/raster/commit/eb665975237b90f7b9a693b0190678622cc60a03))
* better contrast of product header and buttons ([6d8d411](https://github.com/agrc/raster/commit/6d8d41150a0d33f128ced96f6768b65cd8403d2d))
* better title sizes and sidebar layout on smaller screens ([bceb694](https://github.com/agrc/raster/commit/bceb694aeceab302228632af0b56f0717e83f370))
* increase indent for product cards ([3864b62](https://github.com/agrc/raster/commit/3864b625d7f69a4d0a93f74dff6e3610ebb40958))
* LiDAR -&gt; Lidar ([a5bc040](https://github.com/agrc/raster/commit/a5bc04035ccfa7e94321ba100695bef0e0050b7e))
* make drawing toolbar fit in better with other controls ([526d99e](https://github.com/agrc/raster/commit/526d99e06bd85e401b8e6d72c1e5dab1b64f782c))
* make gutters more consistent ([179ef1e](https://github.com/agrc/raster/commit/179ef1e6e1aabb1e8ddf336ee7d49fd3a925d142))
* provide more padding for qualtrics survey ([fd4faa5](https://github.com/agrc/raster/commit/fd4faa5e7db912e3c06042a5f464a8d2f113ad71))

## [3.0.0-rc.8](https://github.com/agrc/raster/compare/v3.0.0-rc.7...v3.0.0-rc.8) (2025-11-24)


### Features

* implement tile download limits and error handling for exceeded tile requests ([0c6c221](https://github.com/agrc/raster/commit/0c6c221e91d5238f74ff2bf00d08b0fbbd345bb2))


### Bug Fixes

* better logic for clearing old tile map layers ([0ba4328](https://github.com/agrc/raster/commit/0ba43281ad2560823c559a3483d231e11801069c))
* prevent app from attempting to load before mapview is ready ([f97c21c](https://github.com/agrc/raster/commit/f97c21c57e32969427575fa87b903e19c043189c))

## [3.0.0-rc.7](https://github.com/agrc/raster/compare/v3.0.0-rc.6...v3.0.0-rc.7) (2025-11-18)


### Features

* add lidar link to header menu ([5ae0e54](https://github.com/agrc/raster/commit/5ae0e545181dc1aaa19a237e30091ef0fe77f275)), closes [#227](https://github.com/agrc/raster/issues/227)
* add qualtrics survey ([7015f5d](https://github.com/agrc/raster/commit/7015f5d9f66411e1ac005d9d886a6b963635f155))
* add request timeouts and retry buttons where appropriate ([e4216bd](https://github.com/agrc/raster/commit/e4216bd909b52394d75bf72d1f7419df43a71353)), closes [#223](https://github.com/agrc/raster/issues/223)


### Bug Fixes

* fix bug preventing previous download tile layers from being removed ([06dc838](https://github.com/agrc/raster/commit/06dc838eefc28dff3ff584fad7bf5b74fac1b3eb))


### Styles

* provide more padding for qualtrics survey ([0b9aa2c](https://github.com/agrc/raster/commit/0b9aa2c7c97fa009b88a36042b13f3906d76b05c))

## [3.0.0-rc.6](https://github.com/agrc/raster/compare/v3.0.0-rc.5...v3.0.0-rc.6) (2025-11-14)


### Features

* add links to base map and aerial photography pages ([330604d](https://github.com/agrc/raster/commit/330604dd702ccd3d83238d0cc238123d679e006c)), closes [#227](https://github.com/agrc/raster/issues/227)
* add metadata and report links to download ([615f000](https://github.com/agrc/raster/commit/615f0009b3bbd7b9216a0aa862587b6fdadda389)), closes [#218](https://github.com/agrc/raster/issues/218)
* basic tile download list and popup ([a74f681](https://github.com/agrc/raster/commit/a74f68162c27baefc6a479b3c8d222f0c625ee19)), closes [#218](https://github.com/agrc/raster/issues/218)
* cache all queries for 30 minutes ([33135ed](https://github.com/agrc/raster/commit/33135edeb247ca2bef3c044a676e96c55d32307d))
* Firebase Analytics tracking for user interactions ([8ed9fd4](https://github.com/agrc/raster/commit/8ed9fd432b2fd41fbca84f2a86a37b134e5922e7)), closes [#215](https://github.com/agrc/raster/issues/215)
* implement more info dialog ([b4c3c66](https://github.com/agrc/raster/commit/b4c3c66c6532aa98249d367a7ebbb603891fabc9)), closes [#223](https://github.com/agrc/raster/issues/223)
* implement URL parameters ([3572a70](https://github.com/agrc/raster/commit/3572a7069b7da21f9b1ca9bc75601954e93c7cf5)), closes [#212](https://github.com/agrc/raster/issues/212)
* indicate which tiles have been downloaded ([642d708](https://github.com/agrc/raster/commit/642d708e695f9cfdde7c8a9e24029dae05107a98)), closes [#247](https://github.com/agrc/raster/issues/247)


### Bug Fixes

* clear any existing AOI if a new sketch tool is activated ([a3eb5b8](https://github.com/agrc/raster/commit/a3eb5b866ae0f8123bdd2c90c9439a0e0c727363)), closes [#221](https://github.com/agrc/raster/issues/221)
* fix bug causing multiple taps on the extent button from zooming the map out continually ([7798b1a](https://github.com/agrc/raster/commit/7798b1aaf745553a0388fd4f8f1f7a5dcfe5f4a9))
* move year in lidar categories to parenthesis ([5b2a008](https://github.com/agrc/raster/commit/5b2a0085e063a977d6bc32f22d68538957ee7078)), closes [#168](https://github.com/agrc/raster/issues/168)
* show extents on hovering over product card contents, not just header ([f96a613](https://github.com/agrc/raster/commit/f96a6139f579cbd07d311edb50ec7d1109fea778))


### Styles

* add left margin to categories ([55745a7](https://github.com/agrc/raster/commit/55745a79a7bedbb3a2e62e1f672d43e54a1a5853))
* increase indent for product cards ([58f57f6](https://github.com/agrc/raster/commit/58f57f60b28be31fb46c3a7ea0bd34bb7b84b4fa))
* make drawing toolbar fit in better with other controls ([d696bec](https://github.com/agrc/raster/commit/d696beca4e217c82a375ac70498668e9e6ebdb79))
* make gutters more consistent ([10c16d6](https://github.com/agrc/raster/commit/10c16d6628382dcb6e2be4ae0ac5349f35c1aa6d))

## [3.0.0-rc.5](https://github.com/agrc/raster/compare/v3.0.0-rc.4...v3.0.0-rc.5) (2025-10-24)


### Features

* add year collected to lidar category labels ([97ad17e](https://github.com/agrc/raster/commit/97ad17e03b6f12352f2d53b64ec865811dd33a86)), closes [#168](https://github.com/agrc/raster/issues/168)
* save clicks by auto-expanding tree items that are single children ([89db81d](https://github.com/agrc/raster/commit/89db81dcf9370276d61aae780b6553eae032a5e6)), closes [#221](https://github.com/agrc/raster/issues/221)


### Bug Fixes

* make sure that the preview does not cover up the AOI graphic ([5b15fa5](https://github.com/agrc/raster/commit/5b15fa593da116758539b5e987f91655585103ec))
* provide more consistent ordering of products within categories ([c17f8a7](https://github.com/agrc/raster/commit/c17f8a751adf0b963ad6e5bc4e9766401e8fc228)), closes [#234](https://github.com/agrc/raster/issues/234)
* remove curly brace text in product names ([75801d3](https://github.com/agrc/raster/commit/75801d357231f888e1eeb80044f2e3742cc09249))
* reset AOI when selected product types changes ([183869e](https://github.com/agrc/raster/commit/183869ee09306fc42615c3a8daacf7e411fecd84))


### Documentation

* document lidar category naming convention ([26fed48](https://github.com/agrc/raster/commit/26fed48382ea78b812c0159545093956725f8239))


### Styles

* better alignment of more info & download buttons ([3350f73](https://github.com/agrc/raster/commit/3350f7394de2dce140ee445eef105079087101bc))
* better contrast of product header and buttons ([11a60e8](https://github.com/agrc/raster/commit/11a60e8b645d9979234ffa4cfc1f40acbd7e82dd))

## [3.0.0-rc.4](https://github.com/agrc/raster/compare/v3.0.0-rc.3...v3.0.0-rc.4) (2025-10-22)


### Features

* add more info & web page links & download button ([f50c377](https://github.com/agrc/raster/commit/f50c3770a2b3c1b6ab50be3ac2409f28e50de58e)), closes [#221](https://github.com/agrc/raster/issues/221)
* implement preview functionality ([0173ad8](https://github.com/agrc/raster/commit/0173ad8b993aa57a2c9acbd0b629d3f6c913a2cd)), closes [#221](https://github.com/agrc/raster/issues/221)
* implement zoom to extent button and show extent on hover ([49eadde](https://github.com/agrc/raster/commit/49eadde7caad0322c4886475947de929e7697895)), closes [#221](https://github.com/agrc/raster/issues/221)
* show search results in a tree structure ([7061a53](https://github.com/agrc/raster/commit/7061a530f3ebde545c83fbc2bfe1429d5865110f)), closes [#221](https://github.com/agrc/raster/issues/221)


### Bug Fixes

* disable drawing toolbar when search is triggered ([bdf01a4](https://github.com/agrc/raster/commit/bdf01a47df640794fc5ee24e523172f19357d934))


### Styles

* LiDAR -&gt; Lidar ([6aaa4b1](https://github.com/agrc/raster/commit/6aaa4b17cbd8d60fae81f3ab55a314994075e36c))

## [3.0.0-rc.3](https://github.com/agrc/raster/compare/v3.0.0-rc.2...v3.0.0-rc.3) (2025-10-14)


### Features

* implement area of interest definition ([6856296](https://github.com/agrc/raster/commit/6856296dfeeed8523860cfa38614d2e706105230)), closes [#213](https://github.com/agrc/raster/issues/213)
* implement extents searching ([2ead3ef](https://github.com/agrc/raster/commit/2ead3efe03cdc194880e7035f253613c7ad3d33f)), closes [#222](https://github.com/agrc/raster/issues/222)
* implement map loading busy bar indicator ([62e37ce](https://github.com/agrc/raster/commit/62e37ceb60020651ff19dddb948fe7ffdd91db55))
* show search results grouped by product type and category ([17b8445](https://github.com/agrc/raster/commit/17b844550333407519cad86cb858a5d1b07d2ba3)), closes [#221](https://github.com/agrc/raster/issues/221)


### Bug Fixes

* add imagery as an additional base map option ([763935e](https://github.com/agrc/raster/commit/763935ea58bae2006475b5b021dd56cdd7976acb)), closes [#214](https://github.com/agrc/raster/issues/214)
* expand default extent to better fit the state of utah ([6992d9f](https://github.com/agrc/raster/commit/6992d9f665ed13f7716a09f68bbd69d070cbf4d0)), closes [#217](https://github.com/agrc/raster/issues/217)
* prevent blank base maps ([cfc9d17](https://github.com/agrc/raster/commit/cfc9d174eeb9a0199b05fb2c70cb28ed3a5111f7))


### Documentation

* import architecture and schema-report docs ([0fed212](https://github.com/agrc/raster/commit/0fed212b34e0ee5ab4358d93e82f06e3dc7018ce))

## [3.0.0-rc.2](https://github.com/agrc/raster/compare/v3.0.0-rc.1...v3.0.0-rc.2) (2025-10-08)


### Features

* add home button ([74f7074](https://github.com/agrc/raster/commit/74f7074cf9e6463e0f4d5738cc56af62faf773bc)), closes [#217](https://github.com/agrc/raster/issues/217)
* add uds tooltips ([6fb3377](https://github.com/agrc/raster/commit/6fb3377b1ef41dbfeb55511d341956a1375f6347)), closes [#220](https://github.com/agrc/raster/issues/220)
* create state machine and model product type selection ([d5bbf9c](https://github.com/agrc/raster/commit/d5bbf9ce84fa23ce6c70e57e7504303a9fd6230a)), closes [#220](https://github.com/agrc/raster/issues/220)


### Bug Fixes

* set appropriate base map options ([8fb26e3](https://github.com/agrc/raster/commit/8fb26e3be164f7222ef68a1d8968090cdf79266d)), closes [#214](https://github.com/agrc/raster/issues/214)


### Styles

* better title sizes and sidebar layout on smaller screens ([6d1e814](https://github.com/agrc/raster/commit/6d1e8147904b7ebfd21219868b69b42706e5c307))

## [3.0.0-rc.1](https://github.com/agrc/raster/compare/v2.5.10...v3.0.0-rc.1) (2025-09-29)


### ⚠ BREAKING CHANGES

* This is a total rewrite of the application

### Bug Fixes

* don't run firebase performance in dev ([0ee5374](https://github.com/agrc/raster/commit/0ee537483ed2b9343279c01d81c1c1fd47d6247c))
* start fresh with atlas template ([581ecbd](https://github.com/agrc/raster/commit/581ecbdb86c9fe65b1d00f5a3764c21583215da3))

## [2.5.11](https://github.com/agrc/raster/compare/v2.5.10...v2.5.11) (2025-11-10)


### Dependencies

* **dev:** bump the safe-dependencies group with 2 updates ([#225](https://github.com/agrc/raster/issues/225)) ([e2bba81](https://github.com/agrc/raster/commit/e2bba813210be1fb3976c68bab2a764f33204f7c))

## [2.5.10](https://github.com/agrc/raster/compare/v2.5.10-rc.2...v2.5.10) (2025-09-04)


### Bug Fixes

* add missing dep ([25e0a61](https://github.com/agrc/raster/commit/25e0a6198b04429ae01ba5d8c2fc22cdada7c118))

## [2.5.10-rc.2](https://github.com/agrc/raster/compare/v2.5.10-rc.1...v2.5.10-rc.2) (2025-09-04)


### Bug Fixes

* remove missing exclude layer from dojo build ([ab69903](https://github.com/agrc/raster/commit/ab6990365c0c63f9977e15e722716a8c0a5c074f))

## [2.5.10-rc.1](https://github.com/agrc/raster/compare/v2.5.9...v2.5.10-rc.1) (2025-09-04)


### Bug Fixes

* **scripts:** fix path for new forklift machine ([4f9d46d](https://github.com/agrc/raster/commit/4f9d46da2d6b341f1ec0158fd772b9c9126617f7))


### Dependencies

* bump esri js api ([803a446](https://github.com/agrc/raster/commit/803a4465a518ac0da8068880feeea051936c8d0a))

## [2.5.9](https://github.com/agrc/raster/compare/v2.5.8...v2.5.9) (2025-07-30)


### Dependencies

* audit fix ([5cbbe3e](https://github.com/agrc/raster/commit/5cbbe3eb5f22f4c71b3b908fc23f8eeb52c9cfa0))
* bump the npm_and_yarn group with 2 updates ([5a9d10d](https://github.com/agrc/raster/commit/5a9d10d38fb51236d776c929b0543e326eb9152d))
* **dev:** bump the safe-dependencies group across 1 directory with 2 updates ([930fabd](https://github.com/agrc/raster/commit/930fabdaaec9f0b15d5da04050bbb58ab7f18614))

## [2.5.8](https://github.com/agrc/raster/compare/v2.5.7...v2.5.8) (2025-06-30)


### Bug Fixes

* replace redirected link with permanent location ([180dd72](https://github.com/agrc/raster/commit/180dd7278a360757ebbcc7af3c5b14e4b47b4ebb))


### Dependencies

* **dev:** bump @babel/core in the safe-dependencies group ([c95286c](https://github.com/agrc/raster/commit/c95286c90bacca756d294169e6a52ada23d6ab8c))

## [2.5.7](https://github.com/agrc/raster/compare/v2.5.6...v2.5.7) (2025-05-20)


### Dependencies

* fy25q4 package updates ([75ca715](https://github.com/agrc/raster/commit/75ca715a14c247f68f0efa2ef1f3d75ea2472479))


### Documentation

* document uglify issue ([a243da9](https://github.com/agrc/raster/commit/a243da96e8b4e53acbce451d45086495118ceadd))

## [2.5.6](https://github.com/agrc/raster/compare/v2.5.5...v2.5.6) (2025-01-07)


### Dependencies

* **dev:** bump the safe-dependencies group across 1 directory with 5 updates ([1452ad6](https://github.com/agrc/raster/commit/1452ad680803889d96af3f4ef3763579b41e508b))

## [2.5.5](https://github.com/agrc/raster/compare/v2.5.4...v2.5.5) (2024-10-03)


### Bug Fixes

* remove extra bump step ([320091d](https://github.com/agrc/raster/commit/320091d5707c96afd0cfd28802b11536a6b6d2cd))

## [2.5.4](https://github.com/agrc/raster/compare/v2.5.3...v2.5.4) (2024-10-03)


### Bug Fixes

* correct version number ([2ae6975](https://github.com/agrc/raster/commit/2ae6975d790ed51ddae2d06cb718d153eae5a1cd))

## [2.5.3](https://github.com/agrc/raster/compare/v2.5.2...v2.5.3) (2024-10-03)


### Bug Fixes

* pin uglify to workaround breaking change ([35c067d](https://github.com/agrc/raster/commit/35c067d93f179c20d1c489bef04a97a2e00d0185))

## [2.5.2](https://github.com/agrc/raster/compare/v2.5.1...v2.5.2) (2024-10-02)


### Dependencies

* FY25Q2 dependency updates 🌲 ([9fc41a6](https://github.com/agrc/raster/commit/9fc41a6907ae48d62d92e9aa42b041381ed8b650))

## [2.5.1](https://github.com/agrc/raster/compare/v2.5.0...v2.5.1) (2024-07-22)


### Bug Fixes

* Add new ga property information ([2fbc4ba](https://github.com/agrc/raster/commit/2fbc4bafa359fda51f937a77151d202c7fde26c7))

## [2.5.0](https://github.com/agrc/raster/compare/v2.4.1...v2.5.0) (2024-06-26)


### 🚀 Features

* add qualtrics survey snippet ([957211a](https://github.com/agrc/raster/commit/957211ae9333364aae3a8b243082629f8f92ea2a))


### 🌲 Dependencies

* bump ws and websocket-stream ([1d54e58](https://github.com/agrc/raster/commit/1d54e583e6708fd0fac14de90e00f52df0bb98a5))
* **dev:** bump the safe-dependencies group across 1 directory with 3 updates ([ae954b7](https://github.com/agrc/raster/commit/ae954b79a77ea999b14e023245f466c142ae6981))

## [2.5.0-0](https://github.com/agrc/raster/compare/v2.4.1...v2.5.0-0) (2024-06-26)


### 🚀 Features

* add qualtrics survey snippet ([3944e5c](https://github.com/agrc/raster/commit/3944e5c67ecd458857fd5d182b9c7220ec8cde5c))

## [2.4.1](https://github.com/agrc/raster/compare/v2.4.0...v2.4.1) (2024-04-02)


### 🌲 Dependencies

* **dev:** bump the major-dependencies group with 1 update ([bddca3c](https://github.com/agrc/raster/commit/bddca3c03b118fb8b2203bca1252f04c74d9a0e7))
* **dev:** bump the safe-dependencies group with 2 updates ([f1a7679](https://github.com/agrc/raster/commit/f1a7679566987a441d35f4101c2deae4d84120c5))

## [2.4.0](https://github.com/agrc/raster/compare/v2.3.8...v2.4.0) (2024-02-12)


### 🚀 Features

* add products url param ([f2ea280](https://github.com/agrc/raster/commit/f2ea280ba548c91554e7033b9ab67e4725ad2598)), closes [#158](https://github.com/agrc/raster/issues/158)


### 🐛 Bug Fixes

* add loader when using cat/catGroup url params ([67b45d4](https://github.com/agrc/raster/commit/67b45d4ab401dd6f06ce3b021299bf95c30dda70)), closes [#131](https://github.com/agrc/raster/issues/131)


### 🌲 Dependencies

* **dev:** bump the safe-dependencies group with 2 updates ([2e909af](https://github.com/agrc/raster/commit/2e909afcf50fb7bc9ca6c2381447abf529ab245f))


### 📖 Documentation Improvements

* remove broken badge ([81d256b](https://github.com/agrc/raster/commit/81d256b0000833ebaaa7a77bb2b12ee18e21f859))

## [2.4.0-0](https://github.com/agrc/raster/compare/v2.3.8...v2.4.0-0) (2024-02-09)


### 🚀 Features

* add products url param ([0e9fdcd](https://github.com/agrc/raster/commit/0e9fdcd5f4b0f923d249ff6cf6d6ea70ac4e74cc)), closes [#158](https://github.com/agrc/raster/issues/158)


### 🐛 Bug Fixes

* add loader when using cat/catGroup url params ([5f28a15](https://github.com/agrc/raster/commit/5f28a15ae26e426df4a32fc8ffa38e867355b0c0)), closes [#131](https://github.com/agrc/raster/issues/131)


### 🌲 Dependencies

* **dev:** bump the safe-dependencies group with 2 updates ([2e909af](https://github.com/agrc/raster/commit/2e909afcf50fb7bc9ca6c2381447abf529ab245f))


### 📖 Documentation Improvements

* remove broken badge ([81d256b](https://github.com/agrc/raster/commit/81d256b0000833ebaaa7a77bb2b12ee18e21f859))

## [2.3.8](https://github.com/agrc/raster/compare/v2.3.7...v2.3.8) (2023-10-19)


### 🌲 Dependencies

* **dev:** bump @babel/traverse from 7.23.0 to 7.23.2 ([3496ce8](https://github.com/agrc/raster/commit/3496ce8c13d76777cf3aaaae1988f8509bd6d66c))

## [2.3.7](https://github.com/agrc/raster/compare/v2.3.6...v2.3.7) (2023-10-06)


### 🐛 Bug Fixes

* add new gtag snippet and ga4 id ([f876e0e](https://github.com/agrc/raster/commit/f876e0ef546a7600ab773127487a0ed590513c71))

## [2.3.6](https://github.com/agrc/raster/compare/v2.3.5...v2.3.6) (2023-07-04)


### 🌲 Dependencies

* q3 package updates ([87d0833](https://github.com/agrc/raster/commit/87d0833699a1e73490fd70d6aa5339e86205b4bf))

## [2.3.5](https://github.com/agrc/raster/compare/v2.3.4...v2.3.5) (2023-04-04)


### 🌲 Dependencies

* q2 package updates ([5da5d64](https://github.com/agrc/raster/commit/5da5d64a9c0b6fa99c3189e008530d673bd794ba))

## [2.3.4](https://github.com/agrc/raster/compare/v2.3.3...v2.3.4) (2023-02-02)


### 🌲 Dependencies

* february dependencies ([0f4e2cc](https://github.com/agrc/raster/commit/0f4e2cc10e61543bfcdb9c63bdf2da7239e5aeef))

## [2.3.3](https://github.com/agrc/raster/compare/v2.3.2...v2.3.3) (2022-12-07)


### 🐛 Bug Fixes

* :evergreen_tree: november package updates ([254ebfb](https://github.com/agrc/raster/commit/254ebfbaf824ecdda07d5cd95e6de57df253d985))
* :evergreen_tree: update dependencies for november ([8c3ccd5](https://github.com/agrc/raster/commit/8c3ccd55b275bcf3c6a600017ca7727736b77404))

## [2.3.2](https://github.com/agrc/raster/compare/v2.3.1...v2.3.2) (2022-11-03)


### 🐛 Bug Fixes

* add missing param to prod deploy action ([ece29b1](https://github.com/agrc/raster/commit/ece29b11ba63b4224d38e429b2ab5744bc9661d4))

## [2.3.1](https://github.com/agrc/raster/compare/v2.3.0...v2.3.1) (2022-11-03)


### 🐛 Bug Fixes

* November dependency bumps 🌲 ([5b9337d](https://github.com/agrc/raster/commit/5b9337d95d6a8e5ff21d54e8d1ee907e0dd8005f))

## [2.3.0](https://github.com/agrc/raster/compare/v2.2.7...v2.3.0) (2022-10-03)


### 📖 Documentation Improvements

* make it more clear that this is py3 env ([a7e566b](https://github.com/agrc/raster/commit/a7e566ba8ad96233dc7733b29e0903bcda240bc1))


### 🚀 Features

* add security headers to firebase ([579a573](https://github.com/agrc/raster/commit/579a573e72f7882529878f1305f810959c88cdbc))


### 🐛 Bug Fixes

* add bump step ([11dc1a8](https://github.com/agrc/raster/commit/11dc1a80c90a23daeac15214d7deff22e4e6c603))
* add mission action permissions ([eccbbb3](https://github.com/agrc/raster/commit/eccbbb3d5ba329bd3c8095c7d31e713e1cdca45c))
* defined output for release job and use better name ([c60bd28](https://github.com/agrc/raster/commit/c60bd2864c6db966c8b49a1f7d9fb9a21043c268))
* handle strict mode dojo issue with inherited calls ([e72545e](https://github.com/agrc/raster/commit/e72545e1e339679a5041d97bf3542e5900af44bc))
* move service now inputs to prod deploy action ([6eaedda](https://github.com/agrc/raster/commit/6eaeddacdbc80f48821b996c60fe3cb131000737))
* point at v1 of deploy action ([e94bf3b](https://github.com/agrc/raster/commit/e94bf3b93f4ab7c11ee66830a34f30f87fc50250))
* remove async/await that uglify was choking on ([9bc512a](https://github.com/agrc/raster/commit/9bc512aae560274ba248773455beeda576b6cdb4)), closes [#72](https://github.com/agrc/raster/issues/72)
* set bump files to 0.0.0 ([14dd620](https://github.com/agrc/raster/commit/14dd620b57520e8fa9a5cf6024896c81ad9e7974))
* switch to prebuild-command ([4be1102](https://github.com/agrc/raster/commit/4be11020004a138c0a862b719b5743edff752b80))
* update def queries for 2019 kane lidar layers ([2231624](https://github.com/agrc/raster/commit/2231624d9c1d4571404d06f7256d9bf149175fce))
* update SEO markup ([89e1864](https://github.com/agrc/raster/commit/89e18643a6bd1f427f0b4008cdff1c57c157b8d2)), closes [#55](https://github.com/agrc/raster/issues/55)
* use new build command syntax ([ed1565d](https://github.com/agrc/raster/commit/ed1565de54ce5238bd20342c7dd0355b5dec19f2))

## [2.3.0-5](https://github.com/agrc/raster/compare/v2.3.0-4...v2.3.0-5) (2022-09-30)


### 🐛 Bug Fixes

* point at v1 of deploy action ([7a86d27](https://github.com/agrc/raster/commit/7a86d2718c9900f328694be49baa28fdf62f2d6f))
* set bump files to 0.0.0 ([74d3a67](https://github.com/agrc/raster/commit/74d3a677e1a05f8639ef676bddaebbbb2fbe95e4))

## [2.3.0-4](https://github.com/agrc/raster/compare/v2.3.0-3...v2.3.0-4) (2022-09-29)


### 🐛 Bug Fixes

* defined output for release job and use better name ([ed4357f](https://github.com/agrc/raster/commit/ed4357fd264e00af978a01afb0e9b589ce2048f4))

## [2.3.0-3](https://github.com/agrc/raster/compare/v2.3.0-2...v2.3.0-3) (2022-09-29)


### 🐛 Bug Fixes

* switch to prebuild-command ([22ea0f6](https://github.com/agrc/raster/commit/22ea0f67072327ef1c3b851be9a70fd94933164f))

## [2.3.0-2](https://github.com/agrc/raster/compare/v2.3.0-1...v2.3.0-2) (2022-09-29)


### 🐛 Bug Fixes

* add bump step ([79fa81e](https://github.com/agrc/raster/commit/79fa81ed653de61950a3cce2850e7231b0df7979))

## [2.3.0-1](https://github.com/agrc/raster/compare/v2.3.0-0...v2.3.0-1) (2022-09-29)


### 🐛 Bug Fixes

* use new build command syntax ([7b1346d](https://github.com/agrc/raster/commit/7b1346d9d506db27a9cbe2017ef442d26cf4c170))

## [2.3.0-0](https://github.com/agrc/raster/compare/v2.2.7...v2.3.0-0) (2022-09-29)


### 📖 Documentation Improvements

* make it more clear that this is py3 env ([a7e566b](https://github.com/agrc/raster/commit/a7e566ba8ad96233dc7733b29e0903bcda240bc1))


### 🚀 Features

* add security headers to firebase ([579a573](https://github.com/agrc/raster/commit/579a573e72f7882529878f1305f810959c88cdbc))


### 🐛 Bug Fixes

* handle strict mode dojo issue with inherited calls ([e72545e](https://github.com/agrc/raster/commit/e72545e1e339679a5041d97bf3542e5900af44bc))
* remove async/await that uglify was choking on ([9bc512a](https://github.com/agrc/raster/commit/9bc512aae560274ba248773455beeda576b6cdb4)), closes [#72](https://github.com/agrc/raster/issues/72)
* update def queries for 2019 kane lidar layers ([2231624](https://github.com/agrc/raster/commit/2231624d9c1d4571404d06f7256d9bf149175fce))
* update SEO markup ([89e1864](https://github.com/agrc/raster/commit/89e18643a6bd1f427f0b4008cdff1c57c157b8d2)), closes [#55](https://github.com/agrc/raster/issues/55)
