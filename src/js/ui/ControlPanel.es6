var SpookyEl = require('spooky-element');
var Signal = require('signals');
var domSelect = require('dom-select');


class ControlPanel extends SpookyEl {

    constructor(data){


        this.template = require('../templates/ui/ControlPanel.hbs');

        super(data);

        this.temperatureCalculate = new SpookyEl('.button-temperature', this);
        this.addCafe = new SpookyEl('.button-add-cafe', this);
        this.isEmpty = true;

        this.onAddCafe = new Signal();

        this.addListeners();

    }

    animateIn(){

      TweenMax.fromTo(this.temperatureCalculate, 1.5, {
            x: -100,
            autoAlpha:0
        }, {
            x: 0,
            delay:0.1,
            autoAlpha:1,
            ease: Expo.easeOut
      });

      TweenMax.fromTo(this.addCafe, 1.5, {
          x: -100,
          autoAlpha:0
      }, {
          x: 0,
          delay:0.1,
          autoAlpha:1,
          ease: Expo.easeOut
      });
      
    }

    addListeners(){

      this.temperatureCalculate.on( 'click', () => {
        if(!this.mercury.top <= 46){
            this.degrees = this.degrees + 1;
            this.mercury.top+=-3;

            TweenMax.to(this.mercury, 0.5, {
                height:this.degrees * 3,
                top:this.mercury.top
            });
                
            domSelect('.degrees',this.view).innerHTML = this.degrees;
        }
      });

      this.addCafe.on( 'click', () =>{
          if(this.isEmpty){
              this.onAddCafe.dispatch();
              this.isEmpty = false;
          }

      } );

    }

}
module.exports = ControlPanel;