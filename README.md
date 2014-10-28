JsToRegex - a fluent regular expression JavaScript framework
=========

Regular expressions are hard to read and hard to write, JS on the other hand is easy!



# Getting started with development

## Environment

You will need `git` and `node` installed to get started. I have developed on a Linux platform but any other OS might work. Google is your friend!

## The project

This projects has **no** runtime dependencies and the following design time dependencies in no particular order:

* Mocha, for unit testing.
* Instanbul, for code coverage reports (optional).

### Installing dependencies

To install mocha do (# denotes root, use sudo or whatever):
    
    # npm install -g mocha
    
This will install mocha globally (all node projects can use it). You can install it per project if you prefer, but you will have to modify all other instructions in this document accordingly.

To install instanbul do:
    
    # npm install -g instanbul
    
### Writing code

This part should be pretty self explanatory. The code is written in a test-driven fashion and the tests are the only specification.

Keep in mind:
   
* All public methods have to be tested.
* The unit tests should be written first.

The code coverage tool will catch any cheaters!

### Testing

Run all tests by (when in the root directory of the project):
    
    $ mocha
    
Or if you want to the see a code coverage report do:

    $ instanbul cover _mocha

You can open a report of the coverage result by opening the file `[project-root]/coverage/lcov-report/index.html` where `[project-root]` is the project's root folder.

