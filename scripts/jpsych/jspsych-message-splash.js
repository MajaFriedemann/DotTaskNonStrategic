/*
 * Example plugin template
 */

jsPsych.plugins['jspsych-message-splash'] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'jspsych-message-splash',
    parameters: {
      name: {
        type: jsPsych.plugins.parameterType.STRING,
      },
      subjectID: {
        type: jsPsych.plugins.parameterType.STRING,
      },
      message: {
        type: jsPsych.plugins.parameterType.STRING,
      },
      submessage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ''
      },
      variableMessage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ''
      },
      variableSubmessage: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ''
      },
      backgroundColor: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'rgb(0,0,0)'
      },
      lineSpacing: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'default'
      },
      submessageSize: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'default'
      },
      textColor: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'rgb(255,255,255)'
      },
      buttonEnabled: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false
      },
      buttonText: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'CONTINUE'
      },
      endPage: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false
      },
      redirectLink: {
        type: jsPsych.plugins.parameterType.STRING,
        default: ''
      },
      feedbackEnabled: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false
      },
      socialMediaEnabled: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false
      },
      creditsEnabled: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false
      }
    }
  };

  plugin.trial = function (display_element, trial) {

    // clear display element and apply page default styles
    display_element.innerHTML = '';
    // need to call directly on the display_element
    display_element.style.backgroundColor = trial.backgroundColor;
    $('body')
      .css('height', 'auto')
      .css('color', trial.textColor)
      .css('overflow', 'hidden');
    $.scrollify.destroy();

    // add some default text
    //var dotRestMessageBrier = 'You have reached the end of block ' + (dots_blockCount-1) + ' of 10. Your joint accuracy on this last block was ' + dataObject.dots_accuracy[dots_blockCount + 1] + '%, and you currently have ' + Math.round(dots_cumulativeScore) + ' points.';

    var dotRestMessageFlat = 'You have reached the end of block ' + (dots_blockCount-1) + ' of 10.';

    // create the page elements
    var splashPage = createGeneral(
      splashPage,
      display_element,
      'section',
      'message-splash',
      trial.name + 'splashPage',
      ''
    );

    if (trial.variableMessage == 'dotRest Brier') {
      var fullscreenMessage = createGeneral(
        fullscreenMessage,
        splashPage,
        'div',
        'main-message',
        trial.name + '-' + 'message',
        '<h1>' + dotRestMessageBrier + '</h1>'
      );
    } else if (trial.variableMessage == 'dotRest flat') {
      var fullscreenMessage = createGeneral(
        fullscreenMessage,
        splashPage,
        'div',
        'main-message',
        trial.name + '-' + 'message',
        '<h1>' + dotRestMessageFlat + '</h1>'
      );
    } else {
      var fullscreenMessage = createGeneral(
        fullscreenMessage,
        splashPage,
        'div',
        'main-message',
        trial.name + '-' + 'message',
        '<h1>' + trial.message + '</h1>'
      );
    }

    if (partner === 'overconfident'){
      var highlight = '<highlight style="color: ' + color2 + '">';
    } else {
      var highlight = '<highlight style="color: ' + color1 + '">';
    }


    var subMessage = createGeneral(
        subMessage,
        splashPage,
        'div',
        'sub-message',
        trial.name + '-' + 'submessage',
        '<h1>You may take a short break if you like.</h1>',
    );





    if (trial.submessageSize !== 'default') {
      subMessage.style.fontSize = trial.submessageSize;
    }

    if (trial.lineSpacing !== 'default') {
      subMessage.style.lineHeight = trial.lineSpacing;
    }

    if (trial.socialMediaEnabled) {
      var socialMediaLinks = '<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="Just participated in TILES, a psychology web experiment by @lindaelwei - check it out at the URL below and contribute to psychological research by @OxACClab!" data-url="https://www.studioljw.com" data-hashtags="tiles, psychology, experiment, studioljw, oxacclab" data-related="lindaelwei,oxacclab, oxexppsy" data-show-count="false">Tweet about this!</a>';

      var socialMedia = createGeneral(
        socialMedia,
        splashPage,
        'div',
        'social-media',
        'social-media-buttons',
        socialMediaLinks
      );
    }

    if (trial.endPage) {
      setCookie('UIDMUL-IST-completed', 'finished', 365);
    }

    if (trial.buttonEnabled) {
      var continueButton = createGeneral(
        continueButton,
        splashPage,
        'button',
        'default-green-button',
        trial.name + '-' + trial.buttonText + '-button',
        trial.buttonText
      );

      continueButton.onclick = function() {
        jsPsych.finishTrial();
        return;
      }
    } else {
      jsPsych.finishTrial();
    }

    // custom page options
    if (trial.name == "dotRest") {
      fullscreenMessage.innerHTML = '<h1>You have reached the end of block ' + dots_blockCount + ' of 10.';
    }

    if (trial.name == "thankYou") {
      subMessage.innerHTML = '<h1></h1>';
    }


    // make sure page starts at the top every time
    $(document).ready(function () {
      $(this).scrollTop(0);
    });
  };

  return plugin;

})();
