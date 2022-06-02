document.addEventListener('DOMContentLoaded', function(e) {
  function Timer() {
    this.reset = function() {
      this.hours = 0;
      this.hoursElement = document.querySelector('span.hours');
      this.hoursElement.textContent = '00';
  
      this.minutes = 0;
      this.minutesElement = document.querySelector('span.minutes');
      this.minutesElement.textContent = '00';
  
      this.seconds = 0;
      this.secondsElement = document.querySelector('span.seconds');
      this.secondsElement.textContent = '00';
  
      this.centiseconds = 0;
      this.centisecondsElement = document.querySelector('span.centiseconds');
      this.centisecondsElement.textContent = '00';
  
      this.startStopButton = document.querySelector('#start-stop-btn');
      this.resetButton = document.querySelector('#reset-btn');
      
      if (this.intervalId || this.intervalId === 0) {
        clearInterval(this.intervalId);
        app.startStopButton.textContent = 'Start';
      }
      this.intervalId = null;
    };

    this.reset();
  }
  
  Timer.prototype = {
    addCentisecond() {
      if (this.centiseconds === 99) {
        this.centiseconds = 0;
        this.addSecond();
      } else {
        this.centiseconds += 1;
      }

      this.centisecondsElement.textContent = this.formatNumber(this.centiseconds);
    },
  
    addSecond() {
      if (this.seconds === 59) {
        this.seconds = 0;
        this.addMinute();
      } else {
        this.seconds += 1;
      }

      this.secondsElement.textContent = this.formatNumber(this.seconds);
    },
  
    addMinute() {
      if (this.minutes === 59) {
        this.minutes = 0;
        this.addHour();
      } else {
        this.minutes += 1;
      }

      this.minutesElement.textContent = this.formatNumber(this.minutes);
    },
  
    addHour() {
      this.hours += 1;
      this.hoursElement.textContent = this.formatNumber(this.hours);
    },
  
    startLoop() {
      this.intervalId = setInterval(this.addCentisecond.bind(this), 10);
    },

    stopLoop() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    },

    formatNumber(int) {
      if (int < 10) {
        return `0${int}`;
      } else {
        return `${int}`;
      }
    },

    bindEventListeners() {
      const app = this;
      this.startStopButton.addEventListener('click', function(e) {
        if (app.intervalId !== null) {
          app.stopLoop();
          app.startStopButton.textContent = 'Start';
        } else {
          app.startLoop();
          app.startStopButton.textContent = 'Stop';
        }
      });

      this.resetButton.addEventListener('click', function(e) {
        app.reset();
      });
    },

    run() {
      this.bindEventListeners();
    }
  }

  let app = new Timer();
  app.run();
});