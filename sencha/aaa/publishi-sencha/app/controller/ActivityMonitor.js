/*
 * File: app/controller/ActivityMonitor.js
 *
 * This file was generated by Sencha Architect version 4.2.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.6.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.6.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('RolandKioskPrint.controller.ActivityMonitor', {
    extend: 'Ext.Base',

    alternateClassName: [
        'RolandKioskPrint.ActivityMonitor'
    ],
    singleton: true,

    runner: null,
    task: null,
    lastActive: null,
    ready: false,
    verbose: false,
    interval: 1000,
    maxInactive: 1000,
    isActive: null,
    isInactive: null,
    running: false,

    init: function(config) {
        if (!config) {
            config = {};
        }

        Ext.apply(this, config, {
            runner: new Ext.util.TaskRunner(),
            task: {
                run: this.monitorUI,
                interval: config.interval || this.interval,
                scope: this
            }
        });

        this.ready = true;
    },

    isReady: function() {
        return this.ready;
    },

    start: function() {
        if (!this.isReady()) {
            this.log('Please run ActivityMonitor.init()');
            return false;
        }

        var ui = Ext.getBody();
        ui.on('mousemove', this.captureActivity, this);
        ui.on('keydown', this.captureActivity, this);

        this.lastActive = new Date();
        this.log('ActivityMonitor has been started.');

        this.runner.start(this.task);
        this.running = true;
    },

    stop: function() {
        if (!this.isReady()) {
            this.log('Please run ActivityMonitor.init()');
            return false;
        }

        this.runner.stop(this.task);
        this.lastActive = null;
        this.running = false;

        var ui = Ext.getBody();
        ui.un('mousemove', this.captureActivity);
        ui.un('keydown', this.captureActivity);

        this.log('ActivityMonitor has been stopped.');
    },

    isRunning: function() {
        return this.running;
    },

    captureActivity: function(eventObj, el, eventOptions) {
        this.lastActive = new Date();
    },

    monitorUI: function() {
        var now = new Date(),
            inactive = (now - this.lastActive);

        if (inactive >= this.maxInactive) {
            this.log('Maximum inactive time hs been reached.');

            if (this.isInactive) {
                this.isInactive();
            }

            this.stop(); // remove event listeners
        }
        else {
            this.log('Currently inactive for ' + inactive + ' (ms)');

            if (this.isActive) {
                this.isActive();
            }
        }
    },

    getLastActiveTime: function() {
        return this.lastActive.getTime();
    },

    log: function(msg) {
        if (this.verbose) {
            console.log(msg);
        }
    }

});