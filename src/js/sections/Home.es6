var SpookyEl = require('spooky-element');
var THREE = require('three');
var TweenMax = require('gsap');
var Signal = require('signals');
var router = require('../router-main');

class Home extends SpookyEl {

    constructor(data){

        this.template = require('../templates/sections/Home.hbs');
         // renderer

        super(data);
        

        this.buttonConcreteBar = new SpookyEl('.button-concrete-bar', this);
        this.buttonCafe = new SpookyEl('.button-coffee-cup', this);
        this.title = new SpookyEl('.home-title', this);
        this.footer = new SpookyEl('.home-footer', this);
        this.buttonsContainer = new SpookyEl('.buttons-container', this);

        this.addListeners();
    }
    animate(){



    }
    
    animateIn(){

        TweenMax.fromTo(this.title, 0.5, {
            autoAlpha:0
        }, {
            autoAlpha:1,
            ease: Expo.easeIn
        });

        TweenMax.fromTo(this.buttonsContainer, 0.5, {
            autoAlpha:0
        }, {
            autoAlpha:1,
            ease: Expo.easeIn
        });
        TweenMax.fromTo(this.footer, 0.5, {
            autoAlpha:0
        }, {
            autoAlpha:1,
            ease: Expo.easeIn
        });


    }
    
    animateOut(){

        var _this = this;

        TweenMax.fromTo(this.title, 0.2, {
            autoAlpha:1
        }, {
            autoAlpha:0,
            ease: Expo.easeOut
        });

        TweenMax.fromTo(this.buttonsContainer, 0.2, {
            autoAlpha:1
        }, {
            autoAlpha:0,
            ease: Expo.easeOut
        });
        TweenMax.fromTo(this.footer, 0.2, {
            autoAlpha:1
        }, {
            autoAlpha:0,
            ease: Expo.easeOut,
            onComplete:function(){
                _this.remove();
            }
        });

    }

    addListeners(){

        this.buttonConcreteBar.on( 'click', () => {
            router.go('concrete');
            this.animateOut();

        });

        this.buttonCafe.on( 'click', () =>{
            router.go('coffee');
            this.animateOut();
        });

        this.buttonConcreteBar.on( 'mouseenter', () => {
            TweenMax.to(this.buttonConcreteBar, 0.2, {
                autoAlpha:0.6
            });
        });

        this.buttonCafe.on( 'mouseenter', () => {
            TweenMax.to(this.buttonCafe, 0.2, {
                autoAlpha:0.6
            });
        });

        this.buttonConcreteBar.on( 'mouseleave', () => {
            TweenMax.to(this.buttonConcreteBar, 0.2, {
                autoAlpha:1
            });
        });

        this.buttonCafe.on( 'mouseleave', () => {
            TweenMax.to(this.buttonCafe, 0.2, {
                autoAlpha:1
            });
        });
    }

    paramsChanged(params) {
        console.log('navigating to '+params);
    }

}

module.exports = Home;