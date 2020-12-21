(function () {
  $(".wiwtkBtn").click(function () {
    $(".wiwtkPanel").show();
  });
  $(".wiwtkClose").click(function () {
    $(".wiwtkPanel").hide();
  });
  // -------- [ sound functions starts here ]-------------------------
  var snapShotaudio;
  $(".audioCard").click(function () {
    try {
      window.parent.stopHeaderAudio();
    } catch (err) {}
    var thisNum = $(this).attr("class").split(" ")[1].slice(-2);
    console.log($(this).attr("class").split(" ")[1]);
    if (snapShotaudio != undefined) {
      if (!snapShotaudio.paused) {
        snapShotaudio.currentTime = 0;
        snapShotaudio.pause();
      }
    }
    snapShotaudio = $("#audioClip_" + thisNum)[0];
    if (snapShotaudio != undefined && snapShotaudio != null) {
      snapShotaudio.play();
    }
  });
  // -------- [ sound functions ends here ]-------------------------
}.call(this));
