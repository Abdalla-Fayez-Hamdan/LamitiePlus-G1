//let isDeveloperMode = false;
(function () {
  //var currentSlideIndex = 1;

  $(".nextBtn").click(function () {
    if (currUnit < numUnits) {
      currUnit++;
      checkUnitStatus();
    }
  });
  $(".backBtn").click(function () {
    if (currUnit > 1) {
      currUnit--;
      checkUnitStatus();
    }
  });

  function checkUnitStatus() {
    if (currUnit == 1) {
      $(".backBtn").addClass("disabled");
    } else {
      $(".backBtn").removeClass("disabled");
    }
    if (currUnit == numUnits) {
      $(".nextBtn").addClass("disabled");
    } else {
      $(".nextBtn").removeClass("disabled");
    }
    $(".pinsContainer").find(".pin").removeClass("selected");
    $(".pinsContainer")
      .find(".pin")
      .eq(currUnit - 1)
      .addClass("selected");
    $(".units").find(".unit").hide();
    $(".units")
      .find(".unit")
      .eq(currUnit - 1)
      .show();

    currUnitTitle = $(".units")
      .find(".unit")
      .eq(currUnit - 1)
      .data("title");
    currUnitLink = $(".units")
      .find(".unit")
      .eq(currUnit - 1)
      .data("ref");
    $(".paperRoll .pin").text(currUnit);
    $(".paperRoll .unitTitle").text(currUnitTitle);
  }
}.call(this));
