let isDeveloperMode = false;
(function () {
  var isDemoMode = true;
  var currentSlideIndex = 1;
  var __scale = 1;
  var $el = $("#mainContainer");
  var checkAnsAttempt = 0;
  var elHeight = $el.outerHeight();
  var elWidth = $el.outerWidth();
  var pageContents = [];
  var audioControl1 = new AudioControls($("#soundClip1").attr("src"));
  var audioControl2 = new AudioControls($("#soundClip2").attr("src"));
  var readingSlideNum = 0;

  doResize();
  window.onload = function () {
    doResize();
  };
  window.onresize = function () {
    doResize();
  };

  function doResize() {
    var scale, origin;
    scale = Math.min(
      $("#scaleable-wrapper").outerWidth() / elWidth,
      $("#scaleable-wrapper").outerHeight() / elHeight
    );
    __scale = scale;
    $el.css({
      transform: "translate(-50%, -50%) " + "scale(" + scale + ")",
    });
    $(".loader").hide();
  }
  $(".full_screen").click(function () {
    toggleFullscreen();
  });
  $(".welcomBtn").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    $("#innerPageFrame").attr("src", "./welcome.html");
  });
  $(".snapshotBtnn").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    $("#innerPageFrame").attr("src", "./snapshot.html");
  });
  $(".readingBtnn").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    $("#innerPageFrame").attr("src", "./reading.html");
  });
  $(".activitiesBtnn").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    $("#innerPageFrame").attr("src", "./activities.html");
  });
  $(".homeBtn").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    window.location.href = "../../../reading1.html";
  });

  $(".reading1Btn").click(function () {
    window.location.href =
      "../../ARC_1.1_SB - Copy/ARC_1.1_SB_U1_P3_P13_V3/index.html";
  });
  $(".reading2Btn").click(function () {
    window.location.href =
      //"../../ARC_1.1_SB - Copy (2)/ARC_1.1_SB_U1_P3_P13_V1/index.html";
      "#";
  });

  $(".back").click(function () {
    //----------- audio controls-----------
    try {
      if (typeof window.parent.stopHeaderAudio != "undefined") {
        window.parent.stopHeaderAudio();
      }
    } catch (err) {}
    //----------- /audio controls-----------
    window.location.href = "../../../reading1.html";
  });

  function toggleFullscreen(elem) {
    elem = elem || document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      changeFullScreenIcon("exit");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      changeFullScreenIcon("full");
    }
  }
  function changeFullScreenIcon(aCondition) {
    if (aCondition == "exit") {
      $(".full_screen")
        .find("img")
        .attr("src", "../../../newSlides/minimize.png");
    } else {
      $(".full_screen")
        .find("img")
        .attr("src", "../../../newSlides/maximize.png");
    }
  }
  // -------------------- [ audio icon control ]----------------
  $(".audioIcon").click(function () {
    startTime = $(this).data("starttime");
    endTime = $(this).data("endtime");
    //----------- audio controls-----------
    try {
      if (typeof window.frames[0].stopPageAudio != "undefined") {
        window.frames[0].stopPageAudio();
      }
    } catch (err) {}
    //-----------// audio controls-----------
    var loadedFile = $("#innerPageFrame").attr("src");
    if (loadedFile == "./reading.html") {
      if (readingSlideNum == 1) {
        startTime = $(this).data("starttimereadingslideone");
        endTime = $(this).data("endtimereadingslideone");
        audioControl2.playAudio($(this), startTime, endTime);
      } else {
        audioControl1.playAudio($(this), startTime, endTime);
      }
    } else {
      audioControl1.playAudio($(this), startTime, endTime);
    }
  });
  window.stopHeaderAudio = function () {
    audioControl1.resetAudio($(".audioIcon"));
    audioControl2.resetAudio($(".audioIcon"));
  };
  window.isReadingSlide = function (aSlideNum) {
    readingSlideNum = aSlideNum;
  };
  // -------------------- [ audio icon control ]----------------
}.call(this));
