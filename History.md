## 1.1.1 / 2012-03-31

  - [refactoring] Error handling when no parallel task assigned before calling `join`



## 1.1.0 / 2012-02-14

  - [new feature] Pass is_parallel to have better look args from last stack
  - [refactoring] Use Object.keys forEAch instead of for in
  - [update packages] mongoose->2.5.7 for test
  - Added more tests



## 1.0.0 / 2012-02-14

  - [bug fix] Parallel arguments from last stack should be overwritten by default arguments
  - Added full test



## 0.1.0 / 2012-02-13

  - [bug fix] Cant pass arguments to parallel fn from series fn
  - Read version number from package.json
  - Added basic tests



## 0.0.3 / 2012-01-16

  - [bug fix] Clear arguments passed from ready method before running the next task



## 0.0.2 / 2012-01-16

  - [bug fix] Merge arguments from parallel tasks and pass to the next task



## 0.0.1 / 2012-01-10

  - Initial release