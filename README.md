# Oitup

Put.io application for Apple TV

## Installing

Oitup is currently not available in App Store - you will need to install it manually. In order to do so
you will need Xcode and cable to connect to Apple TV (USB-C). After connecting Apple TV and opening project
from `xcode` folder you should be able to select Apple TV from target menu - hit `Run` and it should install
on your device.

## Contributing

There are two parts of this project - Swift wrapper around TVJS API, and JavaScript application.

Swift app can be found in `xcode` directory - just open project in Xcode and run it in simulator (it should work OOTB).

JavaScript application can be found in `src` directory, and will require Node.js and NPM in order to run.
After installing them you will need to download required packages:

```
npm install --save-dev
```

This will install `grund` with required dependencies. After that all you need to do is tell grunt to watch any changes
in source code and update application in `xcode` directory:

```
grunt watch
```

Any change in files should immediately update application, but in order to see it you will need to rebuild app in
Xcode every time (just hit `Run` again).

## Changelog

- v1.1.0
  - Add automatic conversion of supported files
- v1.0.0
  - First release

## License

(The MIT License)

Copyright © 2016 Bernard Potocki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
