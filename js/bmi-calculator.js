function giveRadioButtonFunctions() {
  const unit = document.getElementById("measurement-selection");

  unit.addEventListener("change", (event) => {
    changeMeasurementUnits(event);
  });
}

function changeMeasurementUnits(event) {
  const unit = document.getElementById("measurement-selection");
  const metric = document.querySelectorAll(".input-metric");
  const imperial = document.querySelectorAll(".input-imperial");

  if (event.target.id === "radio2") {
    imperial.forEach((element) => {
      element.removeAttribute("inert", "");
      element.removeAttribute("hidden", "");
    });
    metric.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("hidden", "");
    });
    unit.setAttribute("aria-selected", "imperial");
  } else {
    imperial.forEach((element) => {
      element.setAttribute("inert", "");
      element.setAttribute("hidden", "");
    });
    metric.forEach((element) => {
      element.removeAttribute("inert", "");
      element.removeAttribute("hidden", "");
    });
    unit.setAttribute("aria-selected", "metric");
  }
}

giveRadioButtonFunctions();
