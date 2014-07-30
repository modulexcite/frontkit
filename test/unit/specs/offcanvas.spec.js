describe( "Offcanvas Directive", function() {
    "use strict";

    var $rootScope, $rootElement, $window;
    var $ = angular.element;

    before(function() {
        var style = this.styleBiggerScreen = document.createElement( "style" );
        style.textContent = ".show-tiny { display: none !important; }";

        style = this.styleTinyScreen = document.createElement( "style" );
        style.textContent = ".show-tiny { display: block !important; }";

        $( document.head ).append( this.styleTinyScreen );
    });

    beforeEach( module( "frontkit.offcanvas" ) );
    beforeEach( inject(function( $injector ) {
        $rootScope = $injector.get( "$rootScope" );
        $rootElement = $injector.get( "$rootElement" );
        $window = $injector.get( "$window" );

        this.menu = angular.element( "<div></div>" );
        $rootElement.append( this.menu );

        this.compile = function( expr ) {
            this.menu.attr( "offcanvas", expr );
            $injector.get( "$compile" )( this.menu )( $rootScope );
            $rootScope.$apply();

            return this.menu;
        };

        this.getClasses = function( element ) {
            element = element.nodeType ? element : element[ 0 ];
            return element.className.split( " " );
        };
    }));

    afterEach(function() {
        this.menu.remove();
        this.styleBiggerScreen.remove();
    });

    it( "should exist", inject(function( $injector ) {
        var getDirective = function() {
            return $injector.get( "offcanvasDirective" );
        };

        expect( getDirective ).to.not.throw( Error );
    }));

    describe( "when there's a click in body", function() {
        it( "should assign false to expression when it's true", function() {
            $rootScope.prop = false;
            this.compile( "prop" );

            $( document.body ).triggerHandler( "click" );
            expect( $rootScope.prop ).to.not.be.ok;
        });

        it( "should assign false to expression when it's true", function() {
            $rootScope.prop = true;
            this.compile( "prop" );

            $( document.body ).triggerHandler( "click" );
            expect( $rootScope.prop ).to.not.be.ok;
        });
    });

    // ---------------------------------------------------------------------------------------------

    describe( "when no target screen is set", function() {
        it( "should add .offcanvas to body", function() {
            this.compile( "1" );
            expect( this.getClasses( document.body ) ).to.contain( "offcanvas" );
        });

        it( "should add .offcanvas-menu to the menu", function() {
            this.compile( "1" );
            expect( this.getClasses( this.menu ) ).to.contain( "offcanvas-menu" );
        });

        it( "should activate by expression", function( done ) {
            var ctx = this;
            this.compile( "1" );

            setTimeout(function() {
                expect( ctx.getClasses( document.body ) ).to.contain( "offcanvas-active" );
                done();
            }, 0 );
        });
    });

    // ---------------------------------------------------------------------------------------------

    describe( "when in the target screen", function() {
        beforeEach(function() {
            $rootScope.fn = sinon.stub().returns( true );
            this.menu.attr( "target-screen", "tiny" );
            this.compile( "fn()" );
        });

        it( "should add .offcanvas to body", function() {
            expect( this.getClasses( document.body ) ).to.contain( "offcanvas" );
        });

        it( "should add .offcanvas-menu to the menu", function() {
            expect( this.getClasses( this.menu ) ).to.contain( "offcanvas-menu" );
        });

        it( "should set display: none when the expression is false",function() {
            $rootScope.fn.returns( false );
            this.compile( "fn()" );

            expect( this.menu[ 0 ].style.display ).to.equal( "none" );
        });

        it( "should set display: block whenever the expression is true", function() {
            // fn() returns false
            $rootScope.fn.returns( false );
            $rootScope.$apply();

            expect( this.menu[ 0 ].style.display ).to.equal( "block" );

            // Let's make it return true now. display: block should keep
            $rootScope.fn.returns( true );
            $rootScope.$apply();

            expect( this.menu[ 0 ].style.display ).to.equal( "block" );
        });
    });

    // ---------------------------------------------------------------------------------------------

    describe( "when not in the target screen", function() {
        beforeEach(function() {
            $( document.head ).append( this.styleBiggerScreen );

            this.menu.attr( "target-screen", "tiny" );
            this.compile( "1" );
        });

        it( "should not add .offcanvas to body", function() {
            expect( this.getClasses( document.body ) ).to.not.contain( "offcanvas" );
        });

        it( "should not add .offcanvas-menu to the menu", function() {
            expect( this.getClasses( this.menu ) ).to.not.contain( "offcanvas-menu" );
        });

        it( "should reset display value", function() {
            this.menu.attr( "target-screen", "tiny" );
            this.compile( "1" );

            expect( this.menu[ 0 ].style.display ).to.equal( "" );
        });
    });

    // ---------------------------------------------------------------------------------------------

    describe( "when there's a resize", function() {
        it( "should update display property", function() {
            this.menu.attr( "target-screen", "tiny" );
            this.compile( "1" );
            expect( this.menu[ 0 ].style.display ).to.equal( "block" );

            $( document.head ).append( this.styleBiggerScreen );
            $( window ).triggerHandler( "resize" );
            expect( this.menu[ 0 ].style.display ).to.equal( "" );
        });
    });
});