//  Script - Version no: 2
// Play audio without time
(function () {
  var numSlides = $(".slides").find("div[class^='slide']").length;
  console.log("numSlides", numSlides);
  var currentSlide = 1;
  $(".slide")
    .eq(currentSlide - 1)
    .show();
  checkSlideForAudio();
  checkPageStatus();
  var readingAudio = new Audio();

  $(".nextBtn").click(function () {
    if (currentSlide < numSlides) {
      currentSlide++;
      $(".slide").hide();
      $(".slide")
        .eq(currentSlide - 1)
        .show();
      checkSlideForAudio();
      checkPageStatus();
      //----------- audio controls-----------
      try {
        if (typeof window.parent.stopHeaderAudio != "undefined") {
          window.parent.stopHeaderAudio();
        }
      } catch (err) {}
      $(".audioIcon").removeClass("on").addClass("off");
      resetAudio();
      //----------- /audio controls-----------
    }
  });
  $(".backBtn").click(function () {
    if (currentSlide > 0) {
      currentSlide--;
      $(".slide").hide();
      $(".slide")
        .eq(currentSlide - 1)
        .show();
      checkSlideForAudio();
      checkPageStatus();
      //----------- audio controls-----------
      try {
        if (typeof window.parent.stopHeaderAudio != "undefined") {
          window.parent.stopHeaderAudio();
        }
      } catch (err) {}
      $(".audioIcon").removeClass("on").addClass("off");
      resetAudio();
      //----------- /audio controls-----------
    }
  });
  function resetAudio() {
    if (!readingAudio.paused) {
      readingAudio.pause();
    }
  }
  function checkPageStatus() {
    if (currentSlide > 1) {
      $(".backBtn").removeClass("disabled");
    } else {
      $(".backBtn").addClass("disabled");
    }
    if (currentSlide < numSlides) {
      $(".nextBtn").removeClass("disabled");
    } else {
      $(".nextBtn").addClass("disabled");
    }
  }
  // -------------------- [ audio icon control ]----------------
  window.stopPageAudio = function () {
    resetAudio();
  };
  function checkSlideForAudio() {
    try {
      if (typeof window.parent.isReadingSlide != "undefined") {
        window.parent.isReadingSlide(currentSlide);
      }
    } catch (err) {}
  }

  function switchAudioIcon(val, control) {
    console.log(val);
    val = val !== undefined ? val : "off";
    var toRemove = val == "on" ? "off" : "on";
    if (control) {
      if ($(control).hasClass(toRemove)) {
        $(control).removeClass(toRemove);
      }
      $(control).addClass(val);
    }
  }
  $(".audioIcon").click(function () {
    try {
      window.parent.stopHeaderAudio();
    } catch (err) {}
    window.curElm = $(this);
    audioPath = window.curElm.data("audiopath");
    readingAudio.src = audioPath;
    readingAudio.currentTime = 0;
    switchAudioIcon("on", $(this));
    readingAudio.play();
    readingAudio.addEventListener("ended", function () {
      switchAudioIcon("off", window.curElm);
    });
  });
  // -------------------- [ audio icon control ]----------------
}.call(this));
