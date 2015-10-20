if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' && typeof define !== 'function' ) {
    var define = function( factory ) {
        factory( require, exports, module );
    };
}
/**
 * @preserve Copyright 2012 Martijn van de Rijdt & Modilabs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define( function( require, exports, module ) {
    'use strict';
    var Widget = require( 'enketo-core/src/js/Widget' );
    var $ = require( 'jquery' );
    require( 'enketo-core/src/js/plugins' );

    var pluginName = 'locationwidget';

    /**
     * Enhances notes
     *
     * @constructor
     * @param {Element} element [description]
     * @param {(boolean|{touch: boolean, repeat: boolean})} options options
     * @param {*=} e     event
     */

    function Locationwidget( element, options ) {
        this.namespace = pluginName;
        Widget.call( this, element, options );
        this._init();
    }

    //copy the prototype functions from the Widget super class
    Locationwidget.prototype = Object.create( Widget.prototype );

    //ensure the constructor is the new one
    Locationwidget.prototype.constructor = Locationwidget;

    Locationwidget.prototype._init = function() {
        var $el = $( this.element );
        this.$question = $( this.element ).closest( '.question' );

        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(
                function(pos) {
                    pos = pos.coords;
                    $el.val(JSON.stringify({
                        accuracy: pos.accuracy,
                        altitude: pos.altitude,
                        altitudeAccuracy: pos.altitudeAccuracy,
                        heading: pos.heading,
                        latitude: pos.latitude,
                        longitude: pos.longitude,
                        speed: pos.speed,
                    }));
                },
                function(error) {
                    $el.val('Please allow the app to see your location for this report.');
                });
        } else {
            // Geolocation NOT available
            $el.val('LOCATION API NOT AVAILABLE');
        }
    };

    Locationwidget.prototype.destroy = function( element ) {
        /* jshint unused:false */
    };

    $.fn[ pluginName ] = function( options, event ) {
        return this.each( function() {
            var $this = $( this ),
                data = $this.data( pluginName );

            options = options || {};

            if ( !data && typeof options === 'object' ) {
                $this.data( pluginName, ( data = new Locationwidget( this, options, event ) ) );
            } else if ( data && typeof options === 'string' ) {
                data[ options ]( this );
            }
        } );
    };

    module.exports = {
        'name': pluginName,
        'selector': 'input[data-type-xml="geopoint"]',
    };
} );
