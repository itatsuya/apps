/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */
Ext.application({
    extend: 'ccc.Application',

    name: 'ccc',

    requires: [
        // This will automatically load all classes in the ccc namespace
        // so that application classes do not need to require each other.
        'ccc.*'
    ],

    // The name of the initial view to create.
    mainView: 'ccc.view.main.Main'
});
