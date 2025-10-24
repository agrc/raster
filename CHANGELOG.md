# Changelog

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
