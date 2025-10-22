import Decimal from "../node_modules/decimal.js/decimal.mjs";

// Runs all at compile

giveRadioButtonFunctions();
// -- specifically switches from metric to imperial vice versa.

reassignClickToContainer();
// -- when parent div is clicked, it focuses on the containing input

calculateBmiAfterNumberInput();
// -- first converts any unit to:
// -- - meters in height and
// -- - kg in weight
// -- calculates bmi [function: calculatebmi()]
// -- classifies the bmi based on a list of ranges
// -- calculates the weight range at which a person of a specific height is considered healthy.

// Functions

function giveRadioButtonFunctions() {
  const unit = document.getElementById("measurement-selection");

  unit.addEventListener("change", (event) => {
    changeMeasurementUnits(event);
  });
}

// used in giveRadioButtonFunctions()
function changeMeasurementUnits(event) {
  const unit = document.getElementById("measurement-selection");
  const metric = document.querySelectorAll(".input-metric");
  const imperial = document.querySelectorAll(".input-imperial");
  const inputDisplay = document.querySelector(".calculator-inputs");

  if (event.target.id === "radio2") {
    imperial.forEach((element) => {
      element.removeAttribute("inert", "");
      element.removeAttribute("hidden", "");
    });
    metric.forEach((element) => {
      element.querySelector(".measurement").value = "";
      element.setAttribute("inert", "");
      element.setAttribute("hidden", "");
    });
    unit.setAttribute("data-unit-selected", "imperial");
    inputDisplay.classList.add("imperial");
    inputDisplay.classList.remove("metric");
  } else {
    imperial.forEach((element) => {
      element.querySelectorAll(".measurement").forEach((element) => {
        element.value = "";
      });
      element.setAttribute("inert", "");
      element.setAttribute("hidden", "");
    });
    metric.forEach((element) => {
      element.removeAttribute("inert", "");
      element.removeAttribute("hidden", "");
    });
    unit.setAttribute("data-unit-selected", "metric");
    inputDisplay.classList.add("metric");
    inputDisplay.classList.remove("imperial");
  }

  // Resets to welcome message

  const elementWelcome = document.querySelector(
    ".calculator-result-wrapper.result-empty-state"
  );
  const elementHide = document.querySelector(
    ".calculator-result-wrapper.result-unempty-state"
  );

  elementHide.setAttribute("inert", "");
  elementHide.setAttribute("hidden", "");

  elementWelcome.removeAttribute("inert");
  elementWelcome.removeAttribute("hidden");
}

function calculateBmiAfterNumberInput() {
  const measurementInputs = document.querySelectorAll(".measurement");

  measurementInputs.forEach((input) => {
    input.addEventListener("change", () => {
      checkAllInputValues();
    });
  });
}

function checkAllInputValues() {
  const unit = document.getElementById("measurement-selection");

  const measurementUnits = unit.getAttribute("data-unit-selected");

  let height = 0;
  let weight = 0;

  if (measurementUnits === "metric") {
    const heightInCm = new Decimal(
      document.querySelector(`.measurement.${measurementUnits}.height`).value ||
        "0"
    );
    const conversionToMeters = new Decimal("100");
    height = heightInCm.div(conversionToMeters);

    weight = new Decimal(
      document.querySelector(`.measurement.${measurementUnits}.weight`).value ||
        "0"
    );
  } else {
    const feet = new Decimal(
      document.querySelector(`.measurement.feet`)?.value || "0"
    );
    const inch = new Decimal(
      document.querySelector(`.measurement.inch`)?.value || "0"
    );

    const stones = new Decimal(
      document.querySelector(`.measurement.stones`)?.value || "0"
    );
    const pounds = new Decimal(
      document.querySelector(`.measurement.pounds`)?.value || "0"
    );

    height = convertMetricHeight(feet, inch);

    weight = convertMetricWeight(stones, pounds);
  }

  const zero = new Decimal("0");

  if (!height.equals(zero) && !weight.equals(zero)) {
    const bmi = calculateBmi(height, weight);
    const bmiClassObject = classifyBmi(bmi);
    const bmiHealthyRange = calculateHealthyBmiRange(height, measurementUnits);

    const elementHide = document.querySelector(
      ".calculator-result-wrapper.result-empty-state"
    );
    const elementDisplay = document.querySelector(
      ".calculator-result-wrapper.result-unempty-state"
    );

    elementHide.setAttribute("inert", "");
    elementHide.setAttribute("hidden", "");

    elementDisplay.removeAttribute("inert");
    elementDisplay.removeAttribute("hidden");

    const displayBmi = document.getElementById("calculator-result");
    displayBmi.innerHTML = bmi.toFixed(2);

    const displayBmiClass = document.getElementById("bmi-classification");
    displayBmiClass.innerHTML = bmiClassObject;

    const displayBmiRange = document.getElementById("bmi-range");
    displayBmiRange.innerHTML = bmiHealthyRange;
  }
}

// Used in calculateBmiAfterNumberInput()
function calculateBmi(height, weight) {
  const heightSquared = height.pow(2);
  const bmi = weight.div(heightSquared);

  return bmi;
}

// Used in calculateBmiAfterNumberInput()
function convertMetricHeight(feet, inch) {
  const conversionMetersFromFeet = new Decimal("0.3048");

  const conversionMetersFromInch = new Decimal("0.0254");

  const metersFromFeet = feet.mul(conversionMetersFromFeet);

  const metersFromInch = inch.mul(conversionMetersFromInch);

  const height = metersFromFeet.plus(metersFromInch);

  return height;
}

// Used in calculateBmiAfterNumberInput()
function convertMetricWeight(stones, pounds) {
  const conversionKilogramsFromStones = new Decimal("6.35029");

  const conversionKilogramsFromPounds = new Decimal("0.453592");

  const kilogramsFromStones = stones.mul(conversionKilogramsFromStones);

  const kilogramsFromPounds = pounds.mul(conversionKilogramsFromPounds);

  const weight = kilogramsFromStones.plus(kilogramsFromPounds);

  return weight;
}

// Used in classifyBmi(bmi):
const bmiRanges = {
  underweight: {
    min: 0,
    max: 18.5,
  },
  "a healthy weight": {
    min: 18.6,
    max: 24.9,
  },
  overweight: {
    min: 25,
    max: 29.9,
  },
  "obese class I": {
    min: 30,
    max: 34.9,
  },
  "obese class II": {
    min: 35,
    max: 39.9,
  },
  "obese class III": {
    min: 40,
    max: 100,
  },
};

// Used in calculateBmiAfterNumberInput()
function classifyBmi(bmi) {
  for (let i = 0; i < Object.keys(bmiRanges).length; i++) {
    const classification = Object.keys(bmiRanges)[i];
    const details = Object.values(bmiRanges)[i];
    const min = details.min;
    const max = details.max;

    if (bmi > min && bmi < max) {
      return classification;
    }
  }
}

// Used in calculateBmiAfterNumberInput()
function calculateHealthyBmiRange(height, units) {
  console.log(height);
  const heightSquared = height.pow(2);
  const minimumBmi = new Decimal("18.6");
  const maximumBmi = new Decimal("24.9");
  const minimum = heightSquared.mul(minimumBmi);
  const maximum = heightSquared.mul(maximumBmi);

  if (units === "metric") {
    return `${minimum.toFixed(2)}kg - ${maximum.toFixed(2)}kg`;
  }
  if (units === "imperial") {
    const conversionStones = new Decimal("6.35029");
    const conversionPounds = new Decimal("0.453592");

    const minimumStones = minimum.div(conversionStones);
    const minimumRemainder = minimum.mod(conversionStones);
    const minimumPounds = minimumRemainder.div(conversionPounds);
    const minimumStonesDisplay =
      minimumStones.toFixed(0) !== "0" ? `${minimumStones.toFixed(0)}st` : "";
    const minimumPoundsDisplay =
      minimumPounds.toFixed(0) !== "0" ? `${minimumPounds.toFixed(0)}lbs` : "";
    const spaceBetweenMinimum =
      (minimumStonesDisplay === "") | (minimumPoundsDisplay === "") ? "" : " ";

    const minimumConverted = `${minimumStonesDisplay}${spaceBetweenMinimum}${minimumPoundsDisplay}`;

    const maximumStones = maximum.div(conversionStones);
    const maximumRemainder = maximum.mod(conversionStones);
    const maximumPounds = maximumRemainder.div(conversionPounds);
    const maximumStonesDisplay =
      maximumStones.toFixed(0) !== "0" ? `${maximumStones.toFixed(0)}st` : "";
    const maximumPoundsDisplay =
      maximumPounds.toFixed(0) !== "0" ? `${maximumPounds.toFixed(0)}lbs` : "";
    const spaceBetweenMaximum =
      (maximumStonesDisplay === "") | (maximumPoundsDisplay === "") ? "" : " ";
    const maximumConverted = `${maximumStonesDisplay}${spaceBetweenMaximum}${maximumPoundsDisplay}`;

    return `${minimumConverted} - ${maximumConverted}`;
  }
}

function reassignClickToContainer() {
  const inputs = document.querySelectorAll(".measurement");

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const parent = input.parentElement;

    parent.addEventListener("click", () => {
      input.focus();
    });

    input.addEventListener("focus", () => {
      parent.classList.add("active");
    });

    input.addEventListener("focusout", () => {
      parent.classList.remove("active");
    });
  }
}
