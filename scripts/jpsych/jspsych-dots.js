jsPsych.plugins['jspsych-dots'] = (function () {

  var plugin = {};

  plugin.info = {
    name: 'jspsych-dots',
    parameters: {
      isTutorialMode: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: 'Specifies whether the block is in tutorial mode or not.'
      },
      dot_minimum: {
        type: jsPsych.plugins.parameterType.INT,
        default: 200,
        description: 'Minimum dot density of the grid'
      },
      dotDifference: {
        type: jsPsych.plugins.parameterType.INT,
        default: 10,
        description: 'Difference in number of dots between the two grids'
      },
      canvasHTML: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Canvas HTML',
        default: null,
        description: 'HTML for drawing the canvas. ' +
          'Overrides canvas width and height settings.'
      },
      canvasWidth: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas width',
        default: 600,
        description: 'Sets the width of the canvas.'
      },
      canvasHeight: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas height',
        default: 300,
        description: 'Sets the height of the canvas.'
      },
      leftColor: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Left-side colour',
        default: "#FE5F55",
        description: 'Colour for the left side of the confidence slider'
      },
      rightColor: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Right-side colour',
        default: '#62BFED',
        description: 'Colour for the right side of the confidence slider'
      },
      showPercentage: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        description: 'Show percentage for confidence slider?'
      },
      staircasingPractice: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: '"See Again" options',
        default: 'off',
        description: 'Describes what the "See Again" option presents: the exact same matrix ("same"), a same-count but differently distributed matrix ("similar"), or a different matrix ("easier").'
      },
      waitTimeLimit: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Wait time limit',
        default: Infinity,
        description: 'Optional parameter to set a wait time limit for the next trial on a staircasingPractice trial.'
      },
      trial_count: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial count',
        default: 100,
        description: 'Number of trials'
      },
      accuracyThreshold: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Accuracy threshold',
        default: 0,
        description: 'Accuracy threshold (in %)'
      },
      redButtonEnabled: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Red button enabled?',
        default: false,
        description: 'Is the red (left) button enabled?'
      },
      redButtonName: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Red button name',
        default: 'ESCAPE',
        description: 'Text for the red (left) button'
      },
      yellowButtonEnabled: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Yellow button enabled?',
        default: false,
        description: 'Is the yellow (middle) button enabled?'
      },
      yellowButtonName: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Yellow button name',
        default: 'SEE AGAIN',
        description: 'Text for the yellow (middle) button'
      },
      greenButtonEnabled: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Green button enabled',
        default: true,
        description: 'Is the green (right) button enabled?'
      },
      greenButtonName: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Green button name',
        default: 'SUBMIT',
        description: 'Text for the green (right) button'
      },
      blockCounterEnabled: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Block counter enabled?',
        default: false,
        description: 'Is the block counter enabled?'
      },
      defaultOptionEnabled: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Default option for "See Again" enabled',
        default: false,
        description: 'Is the default option for "See Again" choice enabled?'
      },
      partner: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Partner confidence skewed to being over- or underconfident',
        default: 'underconfident',
        description: 'Partner confidence low or high'
      }
    }
  };


  plugin.trial = function (display_element, trial) {

    var tempStorage = {
      trial_count: [],
      isTutorialMode: [],
      dots_partner: [],
      dots_staircase: [],
      majoritySide: [],
      initial_choices: [],
      participant_confidence: [],
      partner_confidences: [],
      //participant_chosen: [],
      dots_pairs: [],
      dots_isCorrect: [],
      //dots_jointCorrect: [],
      dots_partnerCorrect: [],
      //dots_participantCorrect: [],
      info_trial: [],
      asked_more: [],
      dots_pairs_second: [],
      second_choices: [],
      change_of_mind: [],

      dots_RTs: [],
      confidence_RTs: [],
      info_choice_RTs: [],
      dots_second_RTs: [],
      dots_waitTimes: [],
    };

    // set confidence slider options
    var dots_tooltipLabels = [
      // '80% sure<br>LEFT',
      // '60% sure<br>LEFT',
      // '60% sure<br>RIGHT',
      // '80% sure<br>RIGHT'
      'probably<br>LEFT',
      'maybe<br>LEFT',
      'maybe<br>RIGHT',
      'probably<br>RIGHT'
    ];
    var dots_endLabels = [
      // '<div>100% sure<br>LEFT</div>',
      // '<div>100% sure<br>RIGHT</div>'
      '<div>certainly<br>LEFT</div>',
      '<div>certainly<br>RIGHT</div>'
    ];
    var upperColor = trial.leftColor;
    var lowerColor = trial.rightColor;
    document.body.style.setProperty('--leftColor', trial.leftColor);
    document.body.style.setProperty('--rightColor', trial.rightColor);

    var fixationPeriod = 1000;
    var dotPeriod = 300;
    var transitionPeriod = 500;
    var trialCounter = 0;

    if (trial.blockCounterEnabled) {
      dotsBlockCounter++;
      //permanentDataVariable["block_count"].push(dotsBlockCounter);
    }

    $(document).ready(drawFixation(
      display_element,
      trial.canvasWidth,
      trial.canvasHeight,
      trial.dot_minimum,
      dotsStaircase,
      upperColor,
      lowerColor,
      dots_tooltipLabels,
      dots_endLabels,
      trial.showPercentage,
      trial.staircasingPractice,
      trial.waitTimeLimit,
      fixationPeriod,
      dotPeriod,
      transitionPeriod,
      trial.trial_count,
      trialCounter,
      tempStorage,
      dataObject,
      trial.isTutorialMode,
      trial.accuracyThreshold,
      trial.redButtonEnabled,
      trial.redButtonName,
      trial.yellowButtonEnabled,
      trial.yellowButtonName,
      trial.greenButtonEnabled,
      trial.greenButtonName,
      trial.defaultOptionEnabled,
      trial.partner
      ));

    partner = trial.partner;

  };

  return plugin;
})();
