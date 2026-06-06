/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
    // All imported modules in your tests should be mocked automatically
    // automock: false,
    // Stop running tests after `n` failures
    // bail: 0,
    // The directory where Jest should store its cached dependency information
    // cacheDirectory: "/tmp/jest_rs",
    // Automatically clear mock calls, instances, contexts and results before every test
    clearMocks: true,
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // collectCoverageFrom: undefined,
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
    // An array of regexp pattern strings used to skip coverage collection
    // coveragePathIgnorePatterns: [
    //   "/node_modules/"
    // ],
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",
    // A list of reporter names that Jest uses when writing coverage reports
    // coverageReporters: [
    //   "json",
    //   "text",
    //   "lcov",
    //   "clover"
    // ],
    // An object that configures minimum threshold enforcement for coverage results
    // coverageThreshold: undefined,
    // A path to a custom dependency extractor
    // dependencyExtractor: undefined,
    // Make calling deprecated APIs throw helpful error messages
    // errorOnDeprecated: false,
    // The default configuration for fake timers
    // fakeTimers: {
    //   "enableGlobally": false
    // },
    // Force coverage collection from ignored files using an array of glob patterns
    // forceCoverageMatch: [],
    // A path to a module which exports an async function that is triggered once before all test suites
    // globalSetup: undefined,
    // A path to a module which exports an async function that is triggered once after all test suites
    // globalTeardown: undefined,
    // A set of global variables that need to be available in all test environments
    // globals: {},
    // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
    // maxWorkers: "50%",
    // An array of directory names to be searched recursively up from the requiring module's location
    // moduleDirectories: [
    //   "node_modules"
    // ],
    // An array of file extensions your modules use
    // moduleFileExtensions: [
    //   "js",
    //   "mjs",
    //   "cjs",
    //   "jsx",
    //   "ts",
    //   "tsx",
    //   "json",
    //   "node"
    // ],
    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    // moduleNameMapper: {},
    // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
    // modulePathIgnorePatterns: [],
    // Activates notifications for test results
    // notify: false,
    // An enum that specifies notification mode. Requires { notify: true }
    // notifyMode: "failure-change",
    // A preset that is used as a base for Jest's configuration
    preset: 'ts-jest',
    // Run tests from one or more projects
    // projects: undefined,
    // Use this configuration option to add custom reporters to Jest
    // reporters: undefined,
    // Automatically reset mock state before every test
    // resetMocks: false,
    // Reset the module registry before running each individual test
    // resetModules: false,
    // A path to a custom resolver
    // resolver: undefined,
    // Automatically restore mock state and implementation before every test
    // restoreMocks: false,
    // The root directory that Jest should scan for tests and modules within
    // rootDir: undefined,
    // A list of paths to directories that Jest should use to search for files in
    // roots: [
    //   "<rootDir>"
    // ],
    // Allows you to use a custom runner instead of Jest's default test runner
    // runner: "jest-runner",
    // The paths to modules that run some code to configure or set up the testing environment before each test
    // setupFiles: [],
    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    // setupFilesAfterEnv: [],
    // The number of seconds after which a test is considered as slow and reported as such in the results.
    // slowTestThreshold: 5,
    // A list of paths to snapshot serializer modules Jest should use for snapshot testing
    // snapshotSerializers: [],
    // The test environment that will be used for testing
    testEnvironment: "node",
    // Options that will be passed to the testEnvironment
    // testEnvironmentOptions: {},
    // Adds a location field to test results
    // testLocationInResults: false,
    // The glob patterns Jest uses to detect test files
    // testMatch: [
    //   "**/__tests__/**/*.[jt]s?(x)",
    //   "**/?(*.)+(spec|test).[tj]s?(x)"
    // ],
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    // testPathIgnorePatterns: [
    //   "/node_modules/"
    // ],
    // The regexp pattern or array of patterns that Jest uses to detect test files
    // testRegex: [],
    // This option allows the use of a custom results processor
    // testResultsProcessor: undefined,
    // This option allows use of a custom test runner
    // testRunner: "jest-circus/runner",
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.js?$': 'ts-jest',
    },
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    transformIgnorePatterns: [
        "/node_modules/",
        "\\.pnp\\.[^\\/]+$"
    ],
    // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
    // unmockedModulePathPatterns: undefined,
    // Indicates whether each individual test should be reported during the run
    // verbose: undefined,
    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    // watchPathIgnorePatterns: [],
    // Whether to use watchman for file crawling
    // watchman: true,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamVzdC5jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJqZXN0LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxlQUFlO0lBQ1gsb0VBQW9FO0lBQ3BFLG1CQUFtQjtJQUVuQix3Q0FBd0M7SUFDeEMsV0FBVztJQUVYLDBFQUEwRTtJQUMxRSxrQ0FBa0M7SUFFbEMsb0ZBQW9GO0lBQ3BGLFVBQVUsRUFBRSxJQUFJO0lBRWhCLDBGQUEwRjtJQUMxRixlQUFlLEVBQUUsSUFBSTtJQUVyQix5R0FBeUc7SUFDekcsa0NBQWtDO0lBRWxDLDREQUE0RDtJQUM1RCxpQkFBaUIsRUFBRSxVQUFVO0lBRTdCLHNFQUFzRTtJQUN0RSxnQ0FBZ0M7SUFDaEMscUJBQXFCO0lBQ3JCLEtBQUs7SUFFTCwwRUFBMEU7SUFDMUUsZ0JBQWdCLEVBQUUsSUFBSTtJQUV0Qix3RUFBd0U7SUFDeEUsdUJBQXVCO0lBQ3ZCLFlBQVk7SUFDWixZQUFZO0lBQ1osWUFBWTtJQUNaLGFBQWE7SUFDYixLQUFLO0lBRUwsK0VBQStFO0lBQy9FLGdDQUFnQztJQUVoQywwQ0FBMEM7SUFDMUMsa0NBQWtDO0lBRWxDLDREQUE0RDtJQUM1RCw0QkFBNEI7SUFFNUIsNENBQTRDO0lBQzVDLGdCQUFnQjtJQUNoQiw0QkFBNEI7SUFDNUIsS0FBSztJQUVMLCtFQUErRTtJQUMvRSwwQkFBMEI7SUFFMUIsbUdBQW1HO0lBQ25HLDBCQUEwQjtJQUUxQixrR0FBa0c7SUFDbEcsNkJBQTZCO0lBRTdCLCtFQUErRTtJQUMvRSxlQUFlO0lBRWYsaU9BQWlPO0lBQ2pPLHFCQUFxQjtJQUVyQixpR0FBaUc7SUFDakcsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQixLQUFLO0lBRUwsK0NBQStDO0lBQy9DLDBCQUEwQjtJQUMxQixVQUFVO0lBQ1YsV0FBVztJQUNYLFdBQVc7SUFDWCxXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxZQUFZO0lBQ1osV0FBVztJQUNYLEtBQUs7SUFFTCxvSUFBb0k7SUFDcEksd0JBQXdCO0lBRXhCLHdIQUF3SDtJQUN4SCxnQ0FBZ0M7SUFFaEMsMkNBQTJDO0lBQzNDLGlCQUFpQjtJQUVqQixzRUFBc0U7SUFDdEUsZ0NBQWdDO0lBRWhDLDJEQUEyRDtJQUMzRCxNQUFNLEVBQUUsU0FBUztJQUVqQixzQ0FBc0M7SUFDdEMsdUJBQXVCO0lBRXZCLGdFQUFnRTtJQUNoRSx3QkFBd0I7SUFFeEIsbURBQW1EO0lBQ25ELHFCQUFxQjtJQUVyQixnRUFBZ0U7SUFDaEUsdUJBQXVCO0lBRXZCLDhCQUE4QjtJQUM5Qix1QkFBdUI7SUFFdkIsd0VBQXdFO0lBQ3hFLHVCQUF1QjtJQUV2Qix3RUFBd0U7SUFDeEUsc0JBQXNCO0lBRXRCLDZFQUE2RTtJQUM3RSxXQUFXO0lBQ1gsZ0JBQWdCO0lBQ2hCLEtBQUs7SUFFTCwwRUFBMEU7SUFDMUUseUJBQXlCO0lBRXpCLDBHQUEwRztJQUMxRyxrQkFBa0I7SUFFbEIsOEdBQThHO0lBQzlHLDBCQUEwQjtJQUUxQixzR0FBc0c7SUFDdEcsd0JBQXdCO0lBRXhCLHNGQUFzRjtJQUN0RiwyQkFBMkI7SUFFM0IscURBQXFEO0lBQ3JELGVBQWUsRUFBRSxNQUFNO0lBRXZCLHFEQUFxRDtJQUNyRCw4QkFBOEI7SUFFOUIsd0NBQXdDO0lBQ3hDLGdDQUFnQztJQUVoQyxtREFBbUQ7SUFDbkQsZUFBZTtJQUNmLG1DQUFtQztJQUNuQyxxQ0FBcUM7SUFDckMsS0FBSztJQUVMLHdHQUF3RztJQUN4Ryw0QkFBNEI7SUFDNUIscUJBQXFCO0lBQ3JCLEtBQUs7SUFFTCw4RUFBOEU7SUFDOUUsaUJBQWlCO0lBRWpCLDJEQUEyRDtJQUMzRCxtQ0FBbUM7SUFFbkMsaURBQWlEO0lBQ2pELG9DQUFvQztJQUVwQywwREFBMEQ7SUFDMUQsU0FBUyxFQUFFO1FBQ1QsWUFBWSxFQUFFLFNBQVM7S0FDeEI7SUFFRCw0SEFBNEg7SUFDNUgsdUJBQXVCLEVBQUU7UUFDdkIsZ0JBQWdCO1FBQ2hCLG1CQUFtQjtLQUNwQjtJQUVELDZJQUE2STtJQUM3SSx5Q0FBeUM7SUFFekMsMkVBQTJFO0lBQzNFLHNCQUFzQjtJQUV0QixtSEFBbUg7SUFDbkgsK0JBQStCO0lBRS9CLDRDQUE0QztJQUM1QyxrQkFBa0I7Q0FDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBGb3IgYSBkZXRhaWxlZCBleHBsYW5hdGlvbiByZWdhcmRpbmcgZWFjaCBjb25maWd1cmF0aW9uIHByb3BlcnR5IGFuZCB0eXBlIGNoZWNrLCB2aXNpdDpcbiAqIGh0dHBzOi8vamVzdGpzLmlvL2RvY3MvY29uZmlndXJhdGlvblxuICovXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICAvLyBBbGwgaW1wb3J0ZWQgbW9kdWxlcyBpbiB5b3VyIHRlc3RzIHNob3VsZCBiZSBtb2NrZWQgYXV0b21hdGljYWxseVxuICAgIC8vIGF1dG9tb2NrOiBmYWxzZSxcbiAgXG4gICAgLy8gU3RvcCBydW5uaW5nIHRlc3RzIGFmdGVyIGBuYCBmYWlsdXJlc1xuICAgIC8vIGJhaWw6IDAsXG4gIFxuICAgIC8vIFRoZSBkaXJlY3Rvcnkgd2hlcmUgSmVzdCBzaG91bGQgc3RvcmUgaXRzIGNhY2hlZCBkZXBlbmRlbmN5IGluZm9ybWF0aW9uXG4gICAgLy8gY2FjaGVEaXJlY3Rvcnk6IFwiL3RtcC9qZXN0X3JzXCIsXG4gIFxuICAgIC8vIEF1dG9tYXRpY2FsbHkgY2xlYXIgbW9jayBjYWxscywgaW5zdGFuY2VzLCBjb250ZXh0cyBhbmQgcmVzdWx0cyBiZWZvcmUgZXZlcnkgdGVzdFxuICAgIGNsZWFyTW9ja3M6IHRydWUsXG4gIFxuICAgIC8vIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjb3ZlcmFnZSBpbmZvcm1hdGlvbiBzaG91bGQgYmUgY29sbGVjdGVkIHdoaWxlIGV4ZWN1dGluZyB0aGUgdGVzdFxuICAgIGNvbGxlY3RDb3ZlcmFnZTogdHJ1ZSxcbiAgXG4gICAgLy8gQW4gYXJyYXkgb2YgZ2xvYiBwYXR0ZXJucyBpbmRpY2F0aW5nIGEgc2V0IG9mIGZpbGVzIGZvciB3aGljaCBjb3ZlcmFnZSBpbmZvcm1hdGlvbiBzaG91bGQgYmUgY29sbGVjdGVkXG4gICAgLy8gY29sbGVjdENvdmVyYWdlRnJvbTogdW5kZWZpbmVkLFxuICBcbiAgICAvLyBUaGUgZGlyZWN0b3J5IHdoZXJlIEplc3Qgc2hvdWxkIG91dHB1dCBpdHMgY292ZXJhZ2UgZmlsZXNcbiAgICBjb3ZlcmFnZURpcmVjdG9yeTogXCJjb3ZlcmFnZVwiLFxuICBcbiAgICAvLyBBbiBhcnJheSBvZiByZWdleHAgcGF0dGVybiBzdHJpbmdzIHVzZWQgdG8gc2tpcCBjb3ZlcmFnZSBjb2xsZWN0aW9uXG4gICAgLy8gY292ZXJhZ2VQYXRoSWdub3JlUGF0dGVybnM6IFtcbiAgICAvLyAgIFwiL25vZGVfbW9kdWxlcy9cIlxuICAgIC8vIF0sXG4gIFxuICAgIC8vIEluZGljYXRlcyB3aGljaCBwcm92aWRlciBzaG91bGQgYmUgdXNlZCB0byBpbnN0cnVtZW50IGNvZGUgZm9yIGNvdmVyYWdlXG4gICAgY292ZXJhZ2VQcm92aWRlcjogXCJ2OFwiLFxuICBcbiAgICAvLyBBIGxpc3Qgb2YgcmVwb3J0ZXIgbmFtZXMgdGhhdCBKZXN0IHVzZXMgd2hlbiB3cml0aW5nIGNvdmVyYWdlIHJlcG9ydHNcbiAgICAvLyBjb3ZlcmFnZVJlcG9ydGVyczogW1xuICAgIC8vICAgXCJqc29uXCIsXG4gICAgLy8gICBcInRleHRcIixcbiAgICAvLyAgIFwibGNvdlwiLFxuICAgIC8vICAgXCJjbG92ZXJcIlxuICAgIC8vIF0sXG4gIFxuICAgIC8vIEFuIG9iamVjdCB0aGF0IGNvbmZpZ3VyZXMgbWluaW11bSB0aHJlc2hvbGQgZW5mb3JjZW1lbnQgZm9yIGNvdmVyYWdlIHJlc3VsdHNcbiAgICAvLyBjb3ZlcmFnZVRocmVzaG9sZDogdW5kZWZpbmVkLFxuICBcbiAgICAvLyBBIHBhdGggdG8gYSBjdXN0b20gZGVwZW5kZW5jeSBleHRyYWN0b3JcbiAgICAvLyBkZXBlbmRlbmN5RXh0cmFjdG9yOiB1bmRlZmluZWQsXG4gIFxuICAgIC8vIE1ha2UgY2FsbGluZyBkZXByZWNhdGVkIEFQSXMgdGhyb3cgaGVscGZ1bCBlcnJvciBtZXNzYWdlc1xuICAgIC8vIGVycm9yT25EZXByZWNhdGVkOiBmYWxzZSxcbiAgXG4gICAgLy8gVGhlIGRlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgZmFrZSB0aW1lcnNcbiAgICAvLyBmYWtlVGltZXJzOiB7XG4gICAgLy8gICBcImVuYWJsZUdsb2JhbGx5XCI6IGZhbHNlXG4gICAgLy8gfSxcbiAgXG4gICAgLy8gRm9yY2UgY292ZXJhZ2UgY29sbGVjdGlvbiBmcm9tIGlnbm9yZWQgZmlsZXMgdXNpbmcgYW4gYXJyYXkgb2YgZ2xvYiBwYXR0ZXJuc1xuICAgIC8vIGZvcmNlQ292ZXJhZ2VNYXRjaDogW10sXG4gIFxuICAgIC8vIEEgcGF0aCB0byBhIG1vZHVsZSB3aGljaCBleHBvcnRzIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uY2UgYmVmb3JlIGFsbCB0ZXN0IHN1aXRlc1xuICAgIC8vIGdsb2JhbFNldHVwOiB1bmRlZmluZWQsXG4gIFxuICAgIC8vIEEgcGF0aCB0byBhIG1vZHVsZSB3aGljaCBleHBvcnRzIGFuIGFzeW5jIGZ1bmN0aW9uIHRoYXQgaXMgdHJpZ2dlcmVkIG9uY2UgYWZ0ZXIgYWxsIHRlc3Qgc3VpdGVzXG4gICAgLy8gZ2xvYmFsVGVhcmRvd246IHVuZGVmaW5lZCxcbiAgXG4gICAgLy8gQSBzZXQgb2YgZ2xvYmFsIHZhcmlhYmxlcyB0aGF0IG5lZWQgdG8gYmUgYXZhaWxhYmxlIGluIGFsbCB0ZXN0IGVudmlyb25tZW50c1xuICAgIC8vIGdsb2JhbHM6IHt9LFxuICBcbiAgICAvLyBUaGUgbWF4aW11bSBhbW91bnQgb2Ygd29ya2VycyB1c2VkIHRvIHJ1biB5b3VyIHRlc3RzLiBDYW4gYmUgc3BlY2lmaWVkIGFzICUgb3IgYSBudW1iZXIuIEUuZy4gbWF4V29ya2VyczogMTAlIHdpbGwgdXNlIDEwJSBvZiB5b3VyIENQVSBhbW91bnQgKyAxIGFzIHRoZSBtYXhpbXVtIHdvcmtlciBudW1iZXIuIG1heFdvcmtlcnM6IDIgd2lsbCB1c2UgYSBtYXhpbXVtIG9mIDIgd29ya2Vycy5cbiAgICAvLyBtYXhXb3JrZXJzOiBcIjUwJVwiLFxuICBcbiAgICAvLyBBbiBhcnJheSBvZiBkaXJlY3RvcnkgbmFtZXMgdG8gYmUgc2VhcmNoZWQgcmVjdXJzaXZlbHkgdXAgZnJvbSB0aGUgcmVxdWlyaW5nIG1vZHVsZSdzIGxvY2F0aW9uXG4gICAgLy8gbW9kdWxlRGlyZWN0b3JpZXM6IFtcbiAgICAvLyAgIFwibm9kZV9tb2R1bGVzXCJcbiAgICAvLyBdLFxuICBcbiAgICAvLyBBbiBhcnJheSBvZiBmaWxlIGV4dGVuc2lvbnMgeW91ciBtb2R1bGVzIHVzZVxuICAgIC8vIG1vZHVsZUZpbGVFeHRlbnNpb25zOiBbXG4gICAgLy8gICBcImpzXCIsXG4gICAgLy8gICBcIm1qc1wiLFxuICAgIC8vICAgXCJjanNcIixcbiAgICAvLyAgIFwianN4XCIsXG4gICAgLy8gICBcInRzXCIsXG4gICAgLy8gICBcInRzeFwiLFxuICAgIC8vICAgXCJqc29uXCIsXG4gICAgLy8gICBcIm5vZGVcIlxuICAgIC8vIF0sXG4gIFxuICAgIC8vIEEgbWFwIGZyb20gcmVndWxhciBleHByZXNzaW9ucyB0byBtb2R1bGUgbmFtZXMgb3IgdG8gYXJyYXlzIG9mIG1vZHVsZSBuYW1lcyB0aGF0IGFsbG93IHRvIHN0dWIgb3V0IHJlc291cmNlcyB3aXRoIGEgc2luZ2xlIG1vZHVsZVxuICAgIC8vIG1vZHVsZU5hbWVNYXBwZXI6IHt9LFxuICBcbiAgICAvLyBBbiBhcnJheSBvZiByZWdleHAgcGF0dGVybiBzdHJpbmdzLCBtYXRjaGVkIGFnYWluc3QgYWxsIG1vZHVsZSBwYXRocyBiZWZvcmUgY29uc2lkZXJlZCAndmlzaWJsZScgdG8gdGhlIG1vZHVsZSBsb2FkZXJcbiAgICAvLyBtb2R1bGVQYXRoSWdub3JlUGF0dGVybnM6IFtdLFxuICBcbiAgICAvLyBBY3RpdmF0ZXMgbm90aWZpY2F0aW9ucyBmb3IgdGVzdCByZXN1bHRzXG4gICAgLy8gbm90aWZ5OiBmYWxzZSxcbiAgXG4gICAgLy8gQW4gZW51bSB0aGF0IHNwZWNpZmllcyBub3RpZmljYXRpb24gbW9kZS4gUmVxdWlyZXMgeyBub3RpZnk6IHRydWUgfVxuICAgIC8vIG5vdGlmeU1vZGU6IFwiZmFpbHVyZS1jaGFuZ2VcIixcbiAgXG4gICAgLy8gQSBwcmVzZXQgdGhhdCBpcyB1c2VkIGFzIGEgYmFzZSBmb3IgSmVzdCdzIGNvbmZpZ3VyYXRpb25cbiAgICBwcmVzZXQ6ICd0cy1qZXN0JyxcbiAgXG4gICAgLy8gUnVuIHRlc3RzIGZyb20gb25lIG9yIG1vcmUgcHJvamVjdHNcbiAgICAvLyBwcm9qZWN0czogdW5kZWZpbmVkLFxuICBcbiAgICAvLyBVc2UgdGhpcyBjb25maWd1cmF0aW9uIG9wdGlvbiB0byBhZGQgY3VzdG9tIHJlcG9ydGVycyB0byBKZXN0XG4gICAgLy8gcmVwb3J0ZXJzOiB1bmRlZmluZWQsXG4gIFxuICAgIC8vIEF1dG9tYXRpY2FsbHkgcmVzZXQgbW9jayBzdGF0ZSBiZWZvcmUgZXZlcnkgdGVzdFxuICAgIC8vIHJlc2V0TW9ja3M6IGZhbHNlLFxuICBcbiAgICAvLyBSZXNldCB0aGUgbW9kdWxlIHJlZ2lzdHJ5IGJlZm9yZSBydW5uaW5nIGVhY2ggaW5kaXZpZHVhbCB0ZXN0XG4gICAgLy8gcmVzZXRNb2R1bGVzOiBmYWxzZSxcbiAgXG4gICAgLy8gQSBwYXRoIHRvIGEgY3VzdG9tIHJlc29sdmVyXG4gICAgLy8gcmVzb2x2ZXI6IHVuZGVmaW5lZCxcbiAgXG4gICAgLy8gQXV0b21hdGljYWxseSByZXN0b3JlIG1vY2sgc3RhdGUgYW5kIGltcGxlbWVudGF0aW9uIGJlZm9yZSBldmVyeSB0ZXN0XG4gICAgLy8gcmVzdG9yZU1vY2tzOiBmYWxzZSxcbiAgXG4gICAgLy8gVGhlIHJvb3QgZGlyZWN0b3J5IHRoYXQgSmVzdCBzaG91bGQgc2NhbiBmb3IgdGVzdHMgYW5kIG1vZHVsZXMgd2l0aGluXG4gICAgLy8gcm9vdERpcjogdW5kZWZpbmVkLFxuICBcbiAgICAvLyBBIGxpc3Qgb2YgcGF0aHMgdG8gZGlyZWN0b3JpZXMgdGhhdCBKZXN0IHNob3VsZCB1c2UgdG8gc2VhcmNoIGZvciBmaWxlcyBpblxuICAgIC8vIHJvb3RzOiBbXG4gICAgLy8gICBcIjxyb290RGlyPlwiXG4gICAgLy8gXSxcbiAgXG4gICAgLy8gQWxsb3dzIHlvdSB0byB1c2UgYSBjdXN0b20gcnVubmVyIGluc3RlYWQgb2YgSmVzdCdzIGRlZmF1bHQgdGVzdCBydW5uZXJcbiAgICAvLyBydW5uZXI6IFwiamVzdC1ydW5uZXJcIixcbiAgXG4gICAgLy8gVGhlIHBhdGhzIHRvIG1vZHVsZXMgdGhhdCBydW4gc29tZSBjb2RlIHRvIGNvbmZpZ3VyZSBvciBzZXQgdXAgdGhlIHRlc3RpbmcgZW52aXJvbm1lbnQgYmVmb3JlIGVhY2ggdGVzdFxuICAgIC8vIHNldHVwRmlsZXM6IFtdLFxuICBcbiAgICAvLyBBIGxpc3Qgb2YgcGF0aHMgdG8gbW9kdWxlcyB0aGF0IHJ1biBzb21lIGNvZGUgdG8gY29uZmlndXJlIG9yIHNldCB1cCB0aGUgdGVzdGluZyBmcmFtZXdvcmsgYmVmb3JlIGVhY2ggdGVzdFxuICAgIC8vIHNldHVwRmlsZXNBZnRlckVudjogW10sXG4gIFxuICAgIC8vIFRoZSBudW1iZXIgb2Ygc2Vjb25kcyBhZnRlciB3aGljaCBhIHRlc3QgaXMgY29uc2lkZXJlZCBhcyBzbG93IGFuZCByZXBvcnRlZCBhcyBzdWNoIGluIHRoZSByZXN1bHRzLlxuICAgIC8vIHNsb3dUZXN0VGhyZXNob2xkOiA1LFxuICBcbiAgICAvLyBBIGxpc3Qgb2YgcGF0aHMgdG8gc25hcHNob3Qgc2VyaWFsaXplciBtb2R1bGVzIEplc3Qgc2hvdWxkIHVzZSBmb3Igc25hcHNob3QgdGVzdGluZ1xuICAgIC8vIHNuYXBzaG90U2VyaWFsaXplcnM6IFtdLFxuICBcbiAgICAvLyBUaGUgdGVzdCBlbnZpcm9ubWVudCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGVzdGluZ1xuICAgIHRlc3RFbnZpcm9ubWVudDogXCJub2RlXCIsXG4gIFxuICAgIC8vIE9wdGlvbnMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgdGVzdEVudmlyb25tZW50XG4gICAgLy8gdGVzdEVudmlyb25tZW50T3B0aW9uczoge30sXG4gIFxuICAgIC8vIEFkZHMgYSBsb2NhdGlvbiBmaWVsZCB0byB0ZXN0IHJlc3VsdHNcbiAgICAvLyB0ZXN0TG9jYXRpb25JblJlc3VsdHM6IGZhbHNlLFxuICBcbiAgICAvLyBUaGUgZ2xvYiBwYXR0ZXJucyBKZXN0IHVzZXMgdG8gZGV0ZWN0IHRlc3QgZmlsZXNcbiAgICAvLyB0ZXN0TWF0Y2g6IFtcbiAgICAvLyAgIFwiKiovX190ZXN0c19fLyoqLyouW2p0XXM/KHgpXCIsXG4gICAgLy8gICBcIioqLz8oKi4pKyhzcGVjfHRlc3QpLlt0al1zPyh4KVwiXG4gICAgLy8gXSxcbiAgXG4gICAgLy8gQW4gYXJyYXkgb2YgcmVnZXhwIHBhdHRlcm4gc3RyaW5ncyB0aGF0IGFyZSBtYXRjaGVkIGFnYWluc3QgYWxsIHRlc3QgcGF0aHMsIG1hdGNoZWQgdGVzdHMgYXJlIHNraXBwZWRcbiAgICAvLyB0ZXN0UGF0aElnbm9yZVBhdHRlcm5zOiBbXG4gICAgLy8gICBcIi9ub2RlX21vZHVsZXMvXCJcbiAgICAvLyBdLFxuICBcbiAgICAvLyBUaGUgcmVnZXhwIHBhdHRlcm4gb3IgYXJyYXkgb2YgcGF0dGVybnMgdGhhdCBKZXN0IHVzZXMgdG8gZGV0ZWN0IHRlc3QgZmlsZXNcbiAgICAvLyB0ZXN0UmVnZXg6IFtdLFxuICBcbiAgICAvLyBUaGlzIG9wdGlvbiBhbGxvd3MgdGhlIHVzZSBvZiBhIGN1c3RvbSByZXN1bHRzIHByb2Nlc3NvclxuICAgIC8vIHRlc3RSZXN1bHRzUHJvY2Vzc29yOiB1bmRlZmluZWQsXG4gIFxuICAgIC8vIFRoaXMgb3B0aW9uIGFsbG93cyB1c2Ugb2YgYSBjdXN0b20gdGVzdCBydW5uZXJcbiAgICAvLyB0ZXN0UnVubmVyOiBcImplc3QtY2lyY3VzL3J1bm5lclwiLFxuICBcbiAgICAvLyBBIG1hcCBmcm9tIHJlZ3VsYXIgZXhwcmVzc2lvbnMgdG8gcGF0aHMgdG8gdHJhbnNmb3JtZXJzXG4gICAgdHJhbnNmb3JtOiB7XG4gICAgICAnXi4rXFxcXC5qcz8kJzogJ3RzLWplc3QnLFxuICAgIH0sXG4gIFxuICAgIC8vIEFuIGFycmF5IG9mIHJlZ2V4cCBwYXR0ZXJuIHN0cmluZ3MgdGhhdCBhcmUgbWF0Y2hlZCBhZ2FpbnN0IGFsbCBzb3VyY2UgZmlsZSBwYXRocywgbWF0Y2hlZCBmaWxlcyB3aWxsIHNraXAgdHJhbnNmb3JtYXRpb25cbiAgICB0cmFuc2Zvcm1JZ25vcmVQYXR0ZXJuczogW1xuICAgICAgXCIvbm9kZV9tb2R1bGVzL1wiLFxuICAgICAgXCJcXFxcLnBucFxcXFwuW15cXFxcL10rJFwiXG4gICAgXSxcbiAgXG4gICAgLy8gQW4gYXJyYXkgb2YgcmVnZXhwIHBhdHRlcm4gc3RyaW5ncyB0aGF0IGFyZSBtYXRjaGVkIGFnYWluc3QgYWxsIG1vZHVsZXMgYmVmb3JlIHRoZSBtb2R1bGUgbG9hZGVyIHdpbGwgYXV0b21hdGljYWxseSByZXR1cm4gYSBtb2NrIGZvciB0aGVtXG4gICAgLy8gdW5tb2NrZWRNb2R1bGVQYXRoUGF0dGVybnM6IHVuZGVmaW5lZCxcbiAgXG4gICAgLy8gSW5kaWNhdGVzIHdoZXRoZXIgZWFjaCBpbmRpdmlkdWFsIHRlc3Qgc2hvdWxkIGJlIHJlcG9ydGVkIGR1cmluZyB0aGUgcnVuXG4gICAgLy8gdmVyYm9zZTogdW5kZWZpbmVkLFxuICBcbiAgICAvLyBBbiBhcnJheSBvZiByZWdleHAgcGF0dGVybnMgdGhhdCBhcmUgbWF0Y2hlZCBhZ2FpbnN0IGFsbCBzb3VyY2UgZmlsZSBwYXRocyBiZWZvcmUgcmUtcnVubmluZyB0ZXN0cyBpbiB3YXRjaCBtb2RlXG4gICAgLy8gd2F0Y2hQYXRoSWdub3JlUGF0dGVybnM6IFtdLFxuICBcbiAgICAvLyBXaGV0aGVyIHRvIHVzZSB3YXRjaG1hbiBmb3IgZmlsZSBjcmF3bGluZ1xuICAgIC8vIHdhdGNobWFuOiB0cnVlLFxuICB9O1xuICAiXX0=