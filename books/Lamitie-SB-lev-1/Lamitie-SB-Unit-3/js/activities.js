 
(function () {
  var numSlides = $(".slides").find("div[class^='slide']").length;
  console.log("numSlides here: ", numSlides);
  var currentSlide = 1;
  $(".slide")
    .eq(currentSlide - 1)
    .show();

  checkPageStatus();

  $(".nextBtn").click(function () {
    // this is me audio for
    $("audio[id*='audioClip_']")[0].pause();
    $("audio[id*='audioClip_']")[0].currentTime = 0;

    $("#audioClip_71")[0].pause();
    $("#audioClip_71")[0].currentTime = 0;

    if (currentSlide < numSlides) {
      currentSlide++;
      $(".slide").hide();
      $(".slide")
        .eq(currentSlide - 1)
        .show();
      checkPageStatus();
      //----------- audio controls-----------
      try {
        if (typeof window.parent.stopHeaderAudio != "undefined") {
          window.parent.stopHeaderAudio();
        }
      } catch (err) {}
      //----------- /audio controls-----------
      initActivity(currentSlide, "next");
    }
  });
  $(".backBtn").click(function () {
    // this is me audio for
    $("audio[id*='audioClip_']")[0].pause();
    $("audio[id*='audioClip_']")[0].currentTime = 0;

    $("#audioClip_71")[0].pause();
    $("#audioClip_71")[0].currentTime = 0;

    if (currentSlide > 0) {
      currentSlide--;
      $(".slide").hide();
      $(".slide")
        .eq(currentSlide - 1)
        .show();
      checkPageStatus();
      //----------- audio controls-----------
      try {
        if (typeof window.parent.stopHeaderAudio != "undefined") {
          window.parent.stopHeaderAudio();
        }
      } catch (err) {}
      //----------- /audio controls-----------
      initActivity(currentSlide, "back");
    }
  });
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

  // -------- [ activity starts here ]-------------------------
  var $bodyContainer = $(".bodyContainer");
  var activity = $(".slides");
  var noOfQuestions = activity.find(".slide").length;
  $(".feedback").hide();
  $(".numberBox").hide();

  var currentQObj = {};
  currentQObj.qNum = 0;
  currentQObj.qType = "";
  currentQObj.numOptions = 0;
  currentQObj.toValidate = false;
  var hasCanvas = false;

  var wordSearch;
  var dad_objects;
  var letterpath;
  var wordPuzzle;
  var theAudio = new Audio();
  var theCurrAudioObj = null;
  // -------- [ activity_controls starts here ]-------------------------
  var $activityControls = $bodyContainer.find(".activity_controls");
  var $actCtrlPanel = $bodyContainer.find(".activityCtrlPanel");
  $actCtrlPanel.hide();
  $(".ctrlClose").click(function () {
    showActivityPanel(false);
  });

  function setActivityControls(aVis) {
    showActivityControlButs(false);
    if (
      currentQObj.queActiCtrls != null &&
      currentQObj.queActiCtrls != undefined
    ) {
      var act_buttons =
        currentQObj.queActiCtrls.data("buttons") != undefined &&
        currentQObj.queActiCtrls.data("buttons") != null
          ? currentQObj.queActiCtrls.data("buttons")
          : "none";
      var act_buttons_arr = getStrArray(act_buttons, "controls");
      var act_height = [];
      var act_data = [];
      if (act_buttons_arr.length > 1) {
        for (var aa = 0; aa < act_buttons_arr.length; aa++) {
          var thisCtrl = $activityControls.find("." + act_buttons_arr[aa]);
          var new1 = $("#activity" + currentQObj.qNum)
            .find(".ccss_content")
            .html();
          act_height[aa] = currentQObj.queActiCtrls
            .find("." + act_buttons_arr[aa] + "_content")
            .data("height");
          act_data[aa] = currentQObj.queActiCtrls
            .find("." + act_buttons_arr[aa] + "_content")
            .html();
          if (thisCtrl !== null && thisCtrl != undefined) {
            thisCtrl.css("left", aa * 60 + "px");
            thisCtrl.show();
            thisCtrl.click(function () {
              showActivityPanel(true, $(this));
            });
          }
        }
      }
      if (aVis) {
        $activityControls.css("display", "block");
      }
      currentQObj.queActiCtrls.hide();
    }
  }

  function showActivityPanel(aVis, aClass) {
    if (aVis) {
      var thisClass = aClass.attr("class");
      $(".ctrlIcon").removeClass("icon_ccss");
      $(".ctrlIcon").removeClass("icon_homework");
      $(".ctrlIcon").removeClass("icon_tips");
      $(".ctrlIcon").removeClass("icon_link");
      $(".ctrlTitle").html("");
      $(".ctrlIcon").addClass("icon_" + thisClass);
      if (thisClass != "ccss") {
        var tmp =
          thisClass == "tips"
            ? "Tips"
            : thisClass == "homework"
            ? "Homework"
            : "Link";
        $(".ctrlTitle").html(tmp);
      }
      var ctrlCnt = currentQObj.queActiCtrls.find("." + thisClass + "_content");
      if (ctrlCnt != null) {
        var cntClone = ctrlCnt.clone();
        var cntHeight =
          cntClone.data("height") != undefined &&
          cntClone.data("height") != null
            ? cntClone.data("height")
            : 20;
        $actCtrlPanel.find(".ctrlContent").css("height", cntHeight + "px");
        $actCtrlPanel.css("bottom", cntHeight + 181 + "px");
        $actCtrlPanel.find(".ctrlContent").empty();
        $actCtrlPanel.find(".ctrlContent").append(cntClone);
        cntClone.find(".audioBox").each(function () {
          // var fBorColor = ($(this).data('bordercolor')!=undefined && $(this).data('bordercolor')!=null) ? $(this).data('bordercolor') : '#25459d';
          //     ($(this).find("*")).each(function(){

          //         if(!($(this).is( "img" ))){
          //             // $(this).css('border-bottom', 'none');
          //             $(this).css('border-bottom-width', '2px');
          //             $(this).css('border-bottom-style', 'solid');
          //             $(this).css('border-bottom-color', fBorColor);
          //         }
          //     });
          $(this).click(function () {
            playThisAudio($(this));
          });
        });
        $actCtrlPanel.show();
      } else {
        $actCtrlPanel.hide();
      }
    } else {
      $actCtrlPanel.hide();
    }
  }
  function showActivityControlButs(aVis) {
    if (!aVis) {
      $activityControls.find("div").hide();
    }
  }
  // ------------ >>  general functions for all activities >> --------------
  function setActivityArea() {
    $(".slides")
      .children(".slide")
      .each(function () {
        if ($(this).attr("class").split(" ")[1] == "dad_line") {
          if (!hasCanvas) {
            hasCanvas = true;
          }
        }
      });
  }
  function initActivity(aNum, aVal) {
    showActivityControlButs(false);
    showActivityPanel(false);
    stopPlaying();
    if (noOfQuestions > 0) {
      $(".roundRect").removeClass("selected");
      setCurrentQuestionObj(aNum, aVal);
    }
  }
  function setCurrentQuestionObj(aQNum, aVal) {
    var stmt = "";
    if (aVal == "next") {
      if (aQNum > 1) {
        var prevQuestion = activity.find("#activity" + (aQNum - 1));
        if (prevQuestion.attr("class").split(" ")[1] == "dad_objects") {
          resetDragnDropObjects(aQNum - 1);
        }
      }
    } else if (aVal == "back") {
      if (aQNum < numSlides) {
        var nxtQuestion = activity.find("#activity" + (aQNum + 1));
        if (nxtQuestion.attr("class").split(" ")[1] == "dad_objects") {
          resetDragnDropObjects(aQNum + 1);
        }
      }
    }

    if (aQNum > 0) {
      currentQObj = {};
      currentQObj.qNum = aQNum;
      currentQObj.quePart = activity.find("#activity" + aQNum);
      currentQObj.qType = currentQObj.quePart.attr("class").split(" ")[1];
      currentQObj.qPlus =
        currentQObj.quePart.data("plus") != undefined &&
        currentQObj.quePart.data("plus") != null
          ? currentQObj.quePart.data("plus")
          : "none";
      currentQObj.qPlusValidation =
        currentQObj.quePart.data("plusneedvalidation") != undefined &&
        currentQObj.quePart.data("plusneedvalidation") != null
          ? currentQObj.quePart.data("plusneedvalidation")
          : "no";
      currentQObj.numOptions = 0;
      currentQObj.numDrags = 0;
      currentQObj.numDrops = 0;
      currentQObj.connectType = "";
      currentQObj.connectPath = "";
      currentQObj.color = "";
      currentQObj.thick = "";
      currentQObj.selOptions = 0;
      currentQObj.numUserColored = 0;
      currentQObj.toValidate = true;
      currentQObj.audioQue = "no";
      currentQObj.autovalidate = "no";
      currentQObj.numQuestions = 0;
      currentQObj.firstPart = 0;
      currentQObj.secondPart = 0;
      var options = currentQObj.quePart.children(".options");
      currentQObj.queActiCtrls = currentQObj.quePart.find(".activity_buts");

      if (currentQObj.qType == "mcq") {
        currentQObj.numOptions = currentQObj.quePart.find(".roundRect").length;
        currentQObj.toValidate = false;
        options.children(".roundRect").each(function () {
          $(this).css("cursor", "pointer");
          if ($(this).data("answer") > 0) {
            if (!currentQObj.toValidate) {
              currentQObj.toValidate = true;
            }
          }
        });
      } else if (currentQObj.qType == "dad_line") {
        currentQObj.connectType =
          currentQObj.quePart.data("connect") != undefined &&
          currentQObj.quePart.data("connect") != ""
            ? currentQObj.quePart.data("connect")
            : "single";
        currentQObj.connectPath =
          currentQObj.quePart.data("path") != undefined &&
          currentQObj.quePart.data("path") != ""
            ? currentQObj.quePart.data("path")
            : "curve";
        currentQObj.color =
          currentQObj.quePart.data("color") != undefined &&
          currentQObj.quePart.data("color") != ""
            ? currentQObj.quePart.data("color")
            : "blue";
        currentQObj.thick =
          currentQObj.quePart.data("strokewidth") != undefined &&
          currentQObj.quePart.data("strokewidth") != ""
            ? currentQObj.quePart.data("strokewidth")
            : "5";
        currentQObj.icon =
          currentQObj.quePart.data("icon") != undefined &&
          currentQObj.quePart.data("icon") != ""
            ? currentQObj.quePart.data("icon")
            : "both";
        currentQObj.numDrags = currentQObj.quePart.find(".drag").length;
        currentQObj.numDrops = currentQObj.quePart.find(".drop").length;
        stmt +=
          '<div class="mousePoint" style="background-color:' +
          currentQObj.color +
          ';"></div>';
      } else if (currentQObj.qType == "order") {
        currentQObj.numOptions = options.find(".pic").length;
        currentQObj.firstPart = 0;
        options.children(".pic").each(function () {
          $(this).data("correct", 0);
        });
        $(".numberBox").show();
      } else if (currentQObj.qType == "tick_select") {
      } else if (currentQObj.qType == "drop_down") {
        currentQObj.selOptions = getStrArray(
          currentQObj.quePart.data("options"),
          "activity"
        );
        currentQObj.numOptions = currentQObj.quePart.find("select").length;
        initiateDropDown();
      } else if (currentQObj.qType == "color_select") {
        currentQObj.numQuestions = options.find(".colorIt").length;
        $(".face").css("cursor", "pointer");
        resetColorSelect();
      } else if (currentQObj.qType == "coloring") {
      } else if (currentQObj.qType == "wordsearch") {
        currentQObj.toValidate = false;
        wordSearch = new WordSearch(currentQObj.quePart);
      } else if (currentQObj.qType == "color_answer") {
        currentQObj.numUserColored = 0;
        currentQObj.coloredRight = false;
        currentQObj.txtRight = false;
      } else if (currentQObj.qType == "color_palette") {
        stmt += '<div class="mousePoint" style="z-index:8;"></div>';
        buildpalette();
      } else if (currentQObj.qType == "fill_in") {
      } else if (currentQObj.qType == "add_space") {
        initiateAddSpace(aQNum);
      } else if (currentQObj.qType == "letterpath") {
        letterpath = new LetterPath(currentQObj.quePart);
      } else if (currentQObj.qType == "mcq_advanced") {
        currentQObj.numQuestions = currentQObj.quePart.find(".que").length;
      } else if (currentQObj.qType == "static") {
        currentQObj.toValidate = false;
      } else if (currentQObj.qType == "dad_objects") {
        // currentQObj.toValidate = false;
        currentQObj.autovalidate =
          currentQObj.quePart.data("autovalidate") != undefined &&
          currentQObj.quePart.data("autovalidate") != ""
            ? currentQObj.quePart.data("autovalidate")
            : "no";
        currentQObj.firstPart = 0;
        initDragnDropObjects();
        if (currentQObj.qPlusValidation == "yes") {
          currentQObj.toValidate = true;
        }
      } else if (currentQObj.qType == "letter_choice") {
      } else if (currentQObj.qType == "word_puzzle") {
        wordPuzzle = new WordPuzzle(currentQObj.quePart);
      }
      if (currentQObj.qPlus == "palette") {
        buildpalette();
        stmt += '<div class="mousePoint" style="z-index:8;"></div>';
      }
      //----- for adding audio --------
      currentQObj.audioQue =
        currentQObj.quePart.data("audio") != undefined &&
        currentQObj.quePart.data("audio") != null
          ? currentQObj.quePart.data("audio")
          : "no";
      //-----/ for adding audio --------
      $bodyContainer.find(".mousePoint").remove();
      $bodyContainer.find(".resetBtn").remove();
      $bodyContainer.find(".checkBtn").remove();
      if (currentQObj.qType != "static") {
        stmt += '<div class="resetBtn disabled"></div>';
      }
      if (currentQObj.toValidate && currentQObj.autovalidate == "no") {
        // stmt += '<div class="checkBtn disabled"><span style="position: absolute;top: 3px;font-family: Arcon;font-size: 30px;letter-spacing: 1px;left:20px;">Submit</span><img src="./images/button-submit.png"></div>';
        stmt += '<div class="checkBtn disabled"></div>';
      }
      $bodyContainer.append(stmt);
      if (hasCanvas) {
        initDrawCanvas();
        resetDADLine();
      }
      resetActivity();
      setActivityControls(true);
    }
  }
  $bodyContainer.on("click", ".resetBtn", function (e) {
    $(this).addClass("disabled");
    resetActivity();
  });
  function resetActivity() {
    stopPlaying();
    if (currentQObj.qType == "mcq") {
      resetMCQ();
    } else if (currentQObj.qType == "dad_line") {
      resetDADLine();
    } else if (currentQObj.qType == "order") {
      resetOrder();
    } else if (currentQObj.qType == "tick_select") {
      resetTickSelect();
    } else if (currentQObj.qType == "drop_down") {
      resetDropDowns();
    } else if (currentQObj.qType == "color_select") {
      resetColorSelect();
    } else if (currentQObj.qType == "coloring") {
      resetColoring();
    } else if (currentQObj.qType == "wordsearch") {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      wordSearch.resetWordSearch();
    } else if (currentQObj.qType == "color_answer") {
      resetColoring();
      resetTxtAnswers();
    } else if (currentQObj.qType == "color_palette") {
      resetColorPalette();
    } else if (currentQObj.qType == "fill_in") {
      resetFillIn();
    } else if (currentQObj.qType == "add_space") {
      resetAddSpace();
    } else if (currentQObj.qType == "letterpath") {
      letterpath.resetLetterPath();
    } else if (currentQObj.qType == "mcq_advanced") {
      resetMCQAdvanced();
    } else if (currentQObj.qType == "dad_objects") {
      resetDragnDropObjects(currentQObj.qNum);
    } else if (currentQObj.qType == "letter_choice") {
      resetLetterChoice();
    } else if (currentQObj.qType == "word_puzzle") {
      wordPuzzle.resetWordPuzzle();
    }
  }
  $bodyContainer.on("click", ".checkBtn", function (e) {
    $(this).addClass("disabled");
    if (currentQObj.qType == "mcq") {
      validateMCQ();
      $(".roundRect").css("cursor", "default");
    } else if (currentQObj.qType == "dad_line") {
      $(".node").css("cursor", "default");
      validateDADLine();
    } else if (currentQObj.qType == "order") {
      validateOrder();
    } else if (currentQObj.qType == "tick_select") {
      validateTickSelect();
    } else if (currentQObj.qType == "drop_down") {
      validateDropDowns();
    } else if (currentQObj.qType == "color_select") {
      validateColorSelect();
    } else if (currentQObj.qType == "coloring") {
      validateColoringActivity();
    } else if (currentQObj.qType == "color_answer") {
      validateColoring();
      validateTxtAnswers();
    } else if (currentQObj.qType == "color_palette") {
      validateColorPalette();
    } else if (currentQObj.qType == "fill_in") {
      validatefillIn();
    } else if (currentQObj.qType == "letterpath") {
      letterpath.validateLetterPath();
    } else if (currentQObj.qType == "mcq_advanced") {
      validateMCQAdvanced();
    } else if (currentQObj.qType == "dad_objects") {
      validateDragnDropObjects();
    } else if (currentQObj.qType == "letter_choice") {
      validateLetterChoice();
    } else if (currentQObj.qType == "word_puzzle") {
      wordPuzzle.validateWordPuzzle();
    }
    if (currentQObj.qPlus == "palette") {
      validateColorPalette();
    }
  });
  window.showFeedback = function (aBool, aCorrect) {
    $(".goodJob").hide();
    $(".tryAgain").hide();
    if (aBool) {
      $(".feedback").css("display", "block");
      aCorrect ? $(".goodJob").show() : $(".tryAgain").show();
      if (aCorrect) {
        $("#video_1").trigger("play");
      } else {
        $("#video_2").trigger("play");
      }
    } else {
      $(".feedback").css("display", "none");
    }
  };
  $(".closePop").click(function () {
    $("#video_1").trigger("pause");
    $("#video_2").trigger("pause");
    $("#video_1")[0].currentTime = 0;
    $("#video_2")[0].currentTime = 0;
    showFeedback(false);
  });
  window.getIntArray = function (arr) {
    var arr1 = [];
    if (arr != null) {
      arr = arr.toString().split(",");
      for (var i = 0; i < arr.length; i++) {
        arr1[i] = parseInt(arr[i]);
      }
    }
    return arr1;
  };
  function getStrArray(str, pos) {
    var arr = [];
    var arrIndx = 0;
    if (str != null) {
      str = str.toString().split(",");
      if (currentQObj.qType == "drop_down" && pos == "activity") {
        arr[arrIndx] = " - select -";
        arrIndx++;
      }
      for (var i = 0; i < str.length; i++) {
        arr[arrIndx] = $.trim(str[i]);
        arrIndx++;
      }
    }
    return arr;
  }
  //-------------  >> letter_choice functions - starts here >> -----------------
  $(".alph").click(function () {
    var isSelected = 1;
    if (
      $(this).hasClass("selWord") ||
      $(this).hasClass("correctWord") ||
      $(this).hasClass("wrongWord")
    ) {
      isSelected = 0;
    }
    clearLetterChoiceSet($(this).parent());
    if (isSelected == 1) {
      $(this).addClass("selWord");
    }
    $(this).parent().find(".alph").data("selected", 0);
    $(this).data("selected", isSelected);
    setLetterChoiceValues($(this).parent());
    checkControlsLetterChoice();
    if ($(this).hasClass("audioBox")) {
      playThisAudio($(this));
    }
  });
  function clearLetterChoiceSet(ob) {
    if (ob != null) {
      ob.find(".alph").each(function () {
        $(this).removeClass("selWord");
        $(this).removeClass("correctWord");
        $(this).removeClass("wrongWord");
      });
      ob.parent().find(".tick").remove();
      ob.parent().find(".cross").remove();
    }
  }
  function setLetterChoiceValues(aObj) {
    var arr = [];
    var notSel = 0;

    aObj.find(".alph").each(function () {
      if ($(this).data("selected") == 1) {
        arr.push($(this).index());
      } else {
        notSel++;
      }
    });
    if (notSel == aObj.find(".alph").length) {
      aObj.data("selOpt", []);
    } else {
      aObj.data("selOpt", arr);
    }
  }
  function checkControlsLetterChoice() {
    var options = currentQObj.quePart.children(".options");
    var isVal = false;

    options.children(".que").each(function () {
      $(this)
        .find(".letter_choice_set")
        .each(function () {
          if ($(this).data("selOpt").length > 0) {
            if (!isVal) {
              isVal = true;
            }
          }
        });
    });

    if (isVal) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function validateLetterChoice() {
    var options = currentQObj.quePart.children(".options");
    var correctCount = options.find(".que").length;
    var isCorrect = [];
    for (var cc = 0; cc < correctCount; cc++) {
      isCorrect[cc] = 0;
    }
    var count = 0;
    options.children(".que").each(function () {
      var corr_ans = getIntArray($(this).data("answer"));
      var fAudio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      var letter_sets_length = $(this).find(".letter_choice_set").length;
      var correct_letter_sets = 0;
      var wrong_letter_sets = 0;
      var fIcon = $(this).find(".icon_wrap");
      var fLetSets = $(this).find(".letter_sets_wrap");
      fLetSets.find(".letter_choice_set").each(function () {
        var _ind = $(this).index();
        if ($(this).data("selOpt").length == 1) {
          var _alph = $(this).find(".alph").eq($(this).data("selOpt")[0]);
          _alph.removeClass("selWord");
          if ($(this).data("selOpt")[0] == corr_ans[_ind] - 1) {
            _alph.addClass("correctWord");
            correct_letter_sets++;
          } else {
            _alph.addClass("wrongWord");
            wrong_letter_sets++;
          }
        }
      });
      if (correct_letter_sets == letter_sets_length && wrong_letter_sets == 0) {
        isCorrect[count] = 1;
        fIcon.append('<div class="tick"></div>');
        if (fAudio == "yes" && $(this).data("isdone") == 0) {
          $(this).data("isdone") == 1;
          var fLetSets = $(this).find(".letter_sets_wrap");
          fLetSets.find(".letter_choice_set").each(function () {
            $(this).find(".alph").addClass("audioBox");
          });
        }
      } else {
        fIcon.append('<div class="cross"></div>');
      }
      count++;
    });
    var allCorrect = isCorrect.join("").split("0")[0].length == correctCount;
    showFeedback(true, allCorrect);
    if (allCorrect) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function resetLetterChoice() {
    var options = currentQObj.quePart.children(".options");
    options.children(".que").each(function () {
      $(this).data("isdone", 0);
      $(this).find(".tick").remove();
      $(this).find(".cross").remove();
      $(this)
        .find(".letter_choice_set")
        .each(function () {
          $(this).find(".alph").data("selected", 0);
          $(this).find(".alph").removeClass("selWord");
          $(this).find(".alph").removeClass("correctWord");
          $(this).find(".alph").removeClass("wrongWord");
          $(this).data("selOpt", []);
        });
    });
  }
  //-------------  >> dad_objects functions - starts here >> -----------------
  /*$(".drag_wrap .drg").draggable({
        containment: '#activity'+currentQObj.aQNum,        
        stack: '.drag_wrap .drg',
        cursor: 'pointer',
        revert: true,
        refreshPositions: true,
        drag: function (event, ui) {
            ui.helper.addClass("draggable");                
        }            
    });    
    */
  $(".drop_wrap .drp").droppable({
    accept: ".drag_wrap .drg",
    drop: handlePicsDrop,
  });
  // $(".dummy").droppable({
  //     accept: '.drag_wrap .drg',
  //     drop: handlePicsDrop1
  // });
  function handlePicsDrop(event, ui) {
    var drpNmber = $(this).data("drpnum");
    var drgNumber = ui.draggable.data("drgnum");
    var _parentQue = $(this).parent().parent();
    var drpParent = parseInt(_parentQue.data("quenumber"));
    var drgParent = parseInt(ui.draggable.parent().parent().data("quenumber"));
    var _audio =
      _parentQue.data("audio") != undefined && _parentQue.data("audio") != null
        ? _parentQue.data("audio")
        : "no";
    var _userTotal = _parentQue.data("usertotal");
    var _haveDrops = $(this).data("haveDrg");
    var fIconWrap = _parentQue.find(".icon_wrap");
    ui.draggable.data("droppedAt", drpNmber);

    ui.draggable.data("dropper", $(this));
    if (drpParent == drgParent) {
      _haveDrops.push(drgNumber);
      $(this).data("haveDrg", _haveDrops);
      if (drpNmber == drgNumber) {
        if (currentQObj.autovalidate == "yes") {
          ui.draggable.draggable("disable");
          $(this).droppable("disable");
          revertDrgPosition(ui.draggable);
          $(this).css("opacity", "1");
          // ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
          ui.draggable.draggable("option", "revert", false);
          fIconWrap
            .find(".icon_" + drpNmber)
            .append('<div class="tick"></div>');
          fIconWrap.find(".icon_" + drpNmber).data("corr", 1);
          if (_audio == "yes") {
            var fAudioWrap = _parentQue.find(".audio_wrap");
            fAudioWrap.find(".audio_" + drpNmber).removeClass("disabled");
          }
          _parentQue.data("usertotal", _userTotal + 1);
        } else {
          ui.draggable.position({
            of: $(this),
            my: "left top",
            at: "left top",
          });
        }
      } else if (drpNmber != drgNumber) {
        ui.draggable.position({ of: $(this), my: "left top", at: "left top" });
        // ui.draggable.draggable( 'option', 'revert', false );
      }
    } else {
      ui.draggable.draggable("option", "revert", true);
    }

    if (currentQObj.autovalidate == "no") {
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      currentQObj.firstPart = 0;

      checkTotalsDragnDropObjs();
    }
    $bodyContainer.find(".resetBtn").removeClass("disabled");
  }
  function validateDragnDropObjects() {
    var fOptions = currentQObj.quePart.children(".options");
    currentQObj.numQuestions = fOptions.children(".que").length;

    fOptions.children(".que").each(function () {
      var fDrgWrap = $(this).find(".drag_wrap");
      var fDrpWrap = $(this).find(".drop_wrap");
      var fIconWrap = $(this).find(".icon_wrap");
      var _audio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      var drgData = [];
      $(this).data("usertotal", 0);
      fDrpWrap.children(".drp").each(function () {
        $(this).data("drpCorr", 0);
      });
      fDrgWrap.children(".drg").each(function () {
        drgData.push($(this).data("droppedAt"));
      });
      fDrgWrap.children(".drg").each(function () {
        var drpNmber = $(this).data("droppedAt");
        var drgNumber = $(this).data("drgnum");
        var _parentQue = $(this).parent().parent();
        var _dropper = $(this).data("dropper");
        var isUniq =
          drpNmber == 0 ? false : getOccurrence(drgData, drpNmber) == 1;
        var _icn = fIconWrap.find(".icon_" + drgNumber);
        _icn.find(".tick").remove();
        _icn.find(".cross").remove();
        if (drpNmber == drgNumber && isUniq) {
          _icn.append('<div class="tick" style="height:100%"></div>');
          _icn.data("corr", 1);
          if (_dropper != undefined && _dropper != null) {
            _dropper.data("drpCorr", 1);
            _dropper.css("opacity", 1);
            revertDrgPosition($(this));
          }
          if (_audio == "yes") {
            var fAudioWrap = _parentQue.find(".audio_wrap");
            fAudioWrap.find(".audio_" + drpNmber).removeClass("disabled");
          }
        } else {
          _icn.append('<div class="cross" style="height:100%"></div>');
          _icn.data("corr", 0);
        }
      });
      fDrpWrap.children(".drp").each(function () {
        var _parentQue = $(this).parent().parent();
        var _userTotal = _parentQue.data("usertotal");
        if ($(this).data("drpCorr") == 1) {
          _parentQue.data("usertotal", _userTotal + 1);
        }
      });
    });
    currentQObj.firstPart = 0;

    checkTotalsDragnDropObjs();
  }
  function getOccurrence(array, value) {
    var count = 0;
    array.forEach((v) => v === value && count++);
    return count;
  }
  function checkTotalsDragnDropObjs() {
    var fOptions = currentQObj.quePart.children(".options");
    var fUserScore = 0;
    var fUserNilScore = 0;
    fOptions.children(".que").each(function () {
      if ($(this).data("usertotal") == $(this).data("corrtotal")) {
        showDrgPanel(false, $(this).data("quenumber"));
        fUserScore++;
      } else {
        fUserNilScore++;
      }
    });

    if (fUserScore == currentQObj.numQuestions && fUserNilScore == 0) {
      resetZIndex();
      // showDrgPanel(false, 0);
      currentQObj.firstPart = 1;
      if (currentQObj.qPlusValidation == "no") {
        showFeedback(true, true);
        if (currentQObj.qPlus == "palette") {
          startColoring = false;
          resetMousePoint(false);
          $(".color_palette_wrap").data("visible", 0);
          setPalettePosition();
        }
      } else {
      }
    } else {
      if (currentQObj.autovalidate == "no") {
        showFeedback(true, false);
      }
    }
  }

  function initDragnDropObjects() {
    var fOptions = currentQObj.quePart.children(".options");
    currentQObj.numQuestions = fOptions.children(".que").length;

    fOptions.children(".que").each(function () {
      var fDrgWrap = $(this).find(".drag_wrap");
      var fDrpWrap = $(this).find(".drop_wrap");
      $(this).data("quenumber", $(this).index() + 1);
      $(this).data("corrtotal", fDrpWrap.children(".drp").length);
      $(this).data("usertotal", 0);
      $(this).data("iscorrect", 0);

      fDrgWrap.children(".drg").each(function () {
        $(this).data("originalLeft", $(this).css("left"));
        $(this).data("originalTop", $(this).css("top"));
        $(this).data("originalOpacity", 1);
        // $(this).css('z-index', '4');
        // $(this).data('originalZIndx', '4');
      });
      fDrpWrap.children(".drp").each(function () {
        $(this).data("haveDrg", []);
      });
    });
  }
  function revertDrgPosition(ob) {
    if (ob != null) {
      ob.css({
        left: ob.data("originalLeft"),
        top: ob.data("originalTop"),
        "z-index": ob.data("originalZIndx"),
        opacity: 0,
        cursor: "default",
      });
    }
  }
  function resetZIndex() {
    // var options = (currentQObj.quePart).children('.options');
    var fOptions = currentQObj.quePart.children(".options");
    fOptions.children(".que").each(function () {
      var fDrgWrap = $(this).find(".drag_wrap");
      fDrgWrap.children(".drg").each(function () {
        $(this).css("z-index", $(this).data("originalZIndx"));
      });
    });
    // var drgs = options.find('.drag_wrap');
    // drgs.children('.drg').each(function(){
    //     $(this).css('z-index', $(this).data('originalZIndx'));
    // });
  }
  function showDrgPanel(aBoo, aNum) {
    var fOptions = currentQObj.quePart.children(".options");
    fOptions.children(".que").each(function () {
      var fDrgWrap = $(this).find(".drag_wrap");
      if (aBoo) {
        fDrgWrap.show();
        fDrgWrap.css("opacity", 1);
      } else {
        if ($(this).data("quenumber") == aNum) {
          if (currentQObj.numQuestions > 1) {
            fDrgWrap.css("opacity", 0.5);
            //$(this).draggable( 'enable' );
            fDrgWrap.children(".drg").each(function () {
              $(this).draggable("disable");
              $(this).css("cursor", "default");
            });
          } else {
            fDrgWrap.hide();
          }
        }
      }
    });
    // aBoo ? options.find('.drag_wrap').show():options.find('.drag_wrap').hide();
  }
  function resetIcons() {
    var fOptions = currentQObj.quePart.children(".options");
    fOptions.children(".que").each(function () {
      var fIconWrap = $(this).find(".icon_wrap");
      fIconWrap.children(".icon").each(function () {
        if ($(this).data("corr") == 0) {
          $(this).find(".tick").remove();
          $(this).find(".cross").remove();
        }
      });
    });
  }

  function resetDragnDropObjects(num) {
    currentQObj.firstPart = 0;
    var quePart = activity.find("#activity" + num);
    var fOptions = quePart.children(".options");

    fOptions.children(".que").each(function () {
      var fDrgWrap = $(this).find(".drag_wrap");
      var fDrpWrap = $(this).find(".drop_wrap");
      var fIconWrap = $(this).find(".icon_wrap");
      var _audio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      $(this).data("usertotal", 0);
      $(this).data("iscorrect", 0);
      fDrgWrap.children(".drg").draggable({
        containment: "#activity" + currentQObj.qNum,
        scroll: false,
        stack: ".drag_wrap .drg",
        cursor: "pointer",
        revert: function (event, ui) {
          $(this).data("ui-draggable").originalPosition = {
            top: $(this).data("originalTop"),
            left: $(this).data("originalLeft"),
          };
          $(this).position.left = $(this).data("originalLeft");
          $(this).position.top = $(this).data("originalTop");
          // ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
          return !event;
        },
        drag: function (event, ui) {
          // ui.draggable.position( { of: $(this), my: 'left top', at: 5, 100 } );

          ui.helper.addClass("draggable");
          $(this).data("droppedAt", 0);
          $(this).data("dropper", null);
          resetIcons();
          // showDrgPanel(true);
        },
      });
      // revert: true,
      //     refreshPositions: true,
      fDrgWrap.children(".drg").each(function () {
        $(this).removeClass("correct");
        $(this).draggable("enable");
        $(this).data("droppedAt", 0);
        $(this).css({
          left: $(this).data("originalLeft"),
          top: $(this).data("originalTop"),
          opacity: $(this).data("originalOpacity"),
          cursor: "pointer",
        });
      });

      fDrpWrap.children(".drp").each(function () {
        $(this).droppable("enable");
        $(this).css("opacity", "0");
        $(this).data("drpCorr", 0);
        $(this).data("haveDrg", []);
        // var ic_wrp =  $(this).find('.icon_wrap');
        // ic_wrp.find('.tick').remove();
      });
      fIconWrap.children(".icon").each(function () {
        $(this).find(".tick").remove();
        $(this).find(".cross").remove();
        $(this).data("corr", 0);
      });
      if (_audio == "yes") {
        var fAudioWrap = $(this).find(".audio_wrap");
        fAudioWrap.children(".audioIcon").each(function () {
          $(this).addClass("disabled");
          if ($(this).hasClass(".on")) {
            $(this).removeClass(".on");
          }
          $(this).addClass(".off");
        });
      }
      if (currentQObj.qPlus == "palette") {
        resetColorPalette();
      }
      resetZIndex();
      showDrgPanel(true);
      showFeedback(false);
    });
  }
  // ------------ >>  mcq_advanced functions - starts here >> --------------
  $(".pick").click(function () {
    var _opt = $(this);
    var _theParent = _opt.parent();
    var _selType =
      _theParent.data("select") != undefined &&
      _theParent.data("select") != null
        ? _theParent.data("select")
        : "single";
    var _selShape =
      _theParent.data("selectshape") != undefined &&
      _theParent.data("selectshape") != null
        ? _theParent.data("selectshape")
        : "rect";
    var _bgColor =
      _theParent.data("bgcolor") != undefined &&
      _theParent.data("bgcolor") != null
        ? _theParent.data("bgcolor")
        : "none";
    var _initbgColor =
      _theParent.data("initbgcolor") != undefined &&
      _theParent.data("initbgcolor") != null
        ? _theParent.data("initbgcolor")
        : "none";
    _bgColor = _selShape == "cross" ? "none" : _bgColor;
    _theParent.find(".tick").remove();
    _theParent.find(".cross").remove();
    if (_selType == "single") {
      resetAllOptsMCQAdv(_theParent, _bgColor, _selShape);
      _opt.addClass("selected");
      _opt.data("sel", "1");
    } else {
      var _isSel = _opt.data("sel");
      _isSel = _isSel == "1" ? "0" : "1";
      if (_isSel == 0) {
        // _opt.css('background-color', 'rgba(255,255,255,0.05)');
        if (_initbgColor == "none") {
          _opt.css("background-color", "rgba(255,255,255,0.05)");
        } else {
          _opt.css("background-color", _initbgColor);
        }
        if (_bgColor == "none" || _selShape == "cross") {
          _opt.css("border-color", "transparent");
        } else if (_selShape == "svg") {
          _opt.find("svg").removeClass("fillBlue");
          _opt.find("svg").removeClass("fillRed");
          _opt.find("svg").removeClass("fillGreen");
          _opt.find("svg").addClass("fillWhite");
        }
        _opt.find(".selX").hide();
      }
      _opt.data("sel", _isSel);
    }
    if (_opt.data("sel") == 1) {
      if (_bgColor != "none") {
        _opt.css("background-color", _bgColor);
      }
      if (_selShape == "cross") {
        _opt.find(".selX").show();
        _opt.css("border-color", "transparent");
      } else if (_selShape == "svg") {
        _opt.find("svg").removeClass("fillWhite");
        _opt.find("svg").addClass("fillBlue");
      } else {
        _opt.css(
          "border-radius",
          _selShape == "circle"
            ? "50%"
            : _selShape == "rectangle"
            ? "0"
            : "10px"
        );
        if (_bgColor == "none") {
          _opt.css("border-color", "#0d89ca");
        }
      }
    }
    checkSelectedMCQAdv();
  });
  $(".audioIcon").click(function () {
    playThisAudio($(this));
  });
  $(".audioBox").click(function () {
    playThisAudio($(this));
  });
  function playThisAudio(aAudioObj) {
    stopPlaying();
    theAudio.src =
      aAudioObj.data("audio") != undefined && aAudioObj.data("audio") != null
        ? aAudioObj.data("audio")
        : "none";
    if (theAudio.src != "none") {
      try {
        if (typeof window.parent.stopHeaderAudio != "undefined") {
          window.parent.stopHeaderAudio();
        }
      } catch (err) {}
      theAudio.play();
      theCurrAudioObj = aAudioObj;
      if (aAudioObj.hasClass("audioIcon")) {
        switchAudioIcon("on", aAudioObj);
      } else {
        var fThisCss =
          aAudioObj.data("onaudioplay") != undefined &&
          aAudioObj.data("onaudioplay") != null
            ? aAudioObj.data("onaudioplay")
            : "none";
        if (fThisCss != "none") {
          var cssArr = fThisCss.toString().split("|");
          for (var css = 0; css < cssArr.length; css++) {
            var tmpCss = cssArr[css].split(":");
            var tstyle = aAudioObj.css(tmpCss[0]);
            aAudioObj.data(tmpCss[0], tstyle);
            aAudioObj.css(tmpCss[0], tmpCss[1]);
            // -- for all the child elements --
            if (aAudioObj[0].hasChildNodes()) {
              aAudioObj.find("*").each(function () {
                var tstyle1 = $(this).css(tmpCss[0]);
                $(this).data(tmpCss[0], tstyle1);
                $(this).css(tmpCss[0], tmpCss[1]);
              });
            }
          }
        }
      }
      theAudio.onended = function () {
        theCurrAudioObj = null;
        // switchAudioIcon('off', aAudioObj);
        if (aAudioObj.hasClass("audioIcon")) {
          switchAudioIcon("off", aAudioObj);
        } else {
          var fThisCss =
            aAudioObj.data("onaudioplay") != undefined &&
            aAudioObj.data("onaudioplay") != null
              ? aAudioObj.data("onaudioplay")
              : "none";
          if (fThisCss != "none") {
            var cssArr = fThisCss.toString().split("|");
            for (var css = 0; css < cssArr.length; css++) {
              var tmpCss = cssArr[css].split(":");
              var tstyle = aAudioObj.data(tmpCss[0]);
              aAudioObj.css(tmpCss[0], tstyle);
              // -- for all the child elements --
              if (aAudioObj[0].hasChildNodes()) {
                aAudioObj.find("*").each(function () {
                  var tstyle1 = $(this).data(tmpCss[0]);
                  $(this).css(tmpCss[0], tstyle1);
                });
              }
            }
          }
        }
      };
    }
  }
  function stopPlaying() {
    if (theAudio != undefined && theAudio != "none" && theAudio != null) {
      if (theAudio.isPlaying || !theAudio.paused || theAudio.currentTime > 0) {
        theAudio.pause();
        theAudio.currentTime = 0;
      }
    }

    if (theCurrAudioObj != undefined && theCurrAudioObj != null) {
      if (theCurrAudioObj.hasClass("audioIcon")) {
        switchAudioIcon("off", theCurrAudioObj);
      } else {
        var fThisCss1 =
          theCurrAudioObj.data("onaudioplay") != undefined &&
          theCurrAudioObj.data("onaudioplay") != null
            ? theCurrAudioObj.data("onaudioplay")
            : "none";
        if (fThisCss1 != "none") {
          var cssArr1 = fThisCss1.toString().split("|");
          for (var css1 = 0; css1 < cssArr1.length; css1++) {
            var tmpCss1 = cssArr1[css1].split(":");
            var tstyle = theCurrAudioObj.data(tmpCss1[0]);
            theCurrAudioObj.css(tmpCss1[0], tstyle);
            // -- for all the child elements --
            if (theCurrAudioObj[0].hasChildNodes()) {
              theCurrAudioObj.find("*").each(function () {
                var tstyle1 = $(this).data(tmpCss1[0]);
                $(this).css(tmpCss1[0], tstyle1);
              });
            }
          }
        }
      }
    }
  }
  function resetAllOptsMCQAdv(aOb, aBgColor, aSelShape) {
    if (aOb != null) {
      ct = 0;
      aOb.find(".pick").each(function () {
        $(this).data("sel", "0");
        $(this).removeClass("selected");
        $(this).css("background-color", "rgba(255,255,255,0.05)");
        var _theParent = $(this).parent();
        var _initbgColor =
          _theParent.data("initbgcolor") != undefined &&
          _theParent.data("initbgcolor") != null
            ? _theParent.data("initbgcolor")
            : "none";
        if (_initbgColor == "none") {
          $(this).css("background-color", "rgba(255,255,255,0.05)");
        } else {
          $(this).css("background-color", _initbgColor);
        }
        if (aBgColor == "none" || aSelShape == "cross") {
          $(this).css("border-color", "transparent");
        }
        if (aSelShape == "svg") {
          $(this).css("background-color", "transparent");
          $(this).find("svg").removeClass("fillBlue");
          $(this).find("svg").removeClass("fillGreen");
          $(this).find("svg").removeClass("fillRed");
          $(this).find("svg").addClass("fillWhite");
          ct++;
        }
        $(this).find(".selX").hide();
      });
    }
  }
  function checkSelectedMCQAdv() {
    var fsetCtrls = false;
    var options = currentQObj.quePart.children(".options");
    options.children(".que").each(function () {
      $(this)
        .find(".pick")
        .each(function () {
          if ($(this).data("sel") == "1") {
            if (!fsetCtrls) {
              fsetCtrls = true;
            }
          }
        });
    });
    if (fsetCtrls) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function validateMCQAdvanced() {
    showMCQAdvIcons(false);
    var fOptions = currentQObj.quePart.children(".options");
    var fCorrArr = [];
    var fCt = 0;
    var fAudioIfCorrect = [];
    fOptions.children(".que").each(function () {
      var fCorrAns = getIntArray($(this).data("answer"));
      var fCorrCount = 0;
      var fWrongCount = 0;
      var _selShape =
        $(this).data("selectshape") != undefined &&
        $(this).data("selectshape") != null
          ? $(this).data("selectshape")
          : "rect";
      var _bgColor =
        $(this).data("bgcolor") != undefined && $(this).data("bgcolor") != null
          ? $(this).data("bgcolor")
          : "none";
      var _needAudio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      _bgColor = _selShape == "cross" ? "none" : _bgColor;
      fAudioIfCorrect[fCt] = _needAudio == "yesifcorrect" ? 1 : 0;
      var theque = $(this).index();
      $(this)
        .find(".pick")
        .each(function () {
          var fThis = parseInt(
            $(this).attr("class").split(" ")[1].split("_")[1]
          );
          if ($(this).data("sel") == "1") {
            var isAns = $.inArray(fThis, fCorrAns) >= 0;
            if (isAns) {
              fCorrCount++;
              if (_bgColor != "none") {
                $(this).css("background-color", "#8cc63f");
              }
              if (_bgColor == "none" && _selShape != "svg") {
                $(this).css("border-color", "#8cc63f");
              }
              if (_selShape == "cross") {
                $(this).css("border-color", "#8cc63f");
                $(this).css("border-radius", "10px");
              } else if (_selShape == "svg") {
                $(this).find("svg").removeClass("fillBlue");
                $(this).find("svg").addClass("fillGreen");
              }
            } else {
              fWrongCount++;
              if (_bgColor != "none") {
                $(this).css("background-color", "#f53656");
              }
              if (_bgColor == "none" && _selShape != "svg") {
                $(this).css("border-color", "#f53656");
              }
              if (_selShape == "cross") {
                $(this).css("border-color", "#f53656");
                $(this).css("border-radius", "10px");
              } else if (_selShape == "svg") {
                $(this).find("svg").removeClass("fillBlue");
                $(this).find("svg").addClass("fillRed");
              }
            }
          }
        });
      fCorrArr[fCt] = fCorrCount == fCorrAns.length && fWrongCount == 0 ? 1 : 0;
      fCt++;
    });
    showMCQAdvIcons(true, fCorrArr);
    showMCQAdvAudio(true, fCorrArr, fAudioIfCorrect);
    var allCorrect =
      fCorrArr.join("").split("0")[0].length == currentQObj.numQuestions;
    showFeedback(true, allCorrect);
    if (allCorrect) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function showMCQAdvIcons(aShow, aArr) {
    var fOptions = currentQObj.quePart.children(".options");
    var fIconWrap;
    if (aShow) {
      for (var ii = 0; ii < aArr.length; ii++) {
        var _ob = fOptions.find(".que").eq(ii);
        fIconWrap = _ob.find(".icon_wrap");
        var fIcon = aArr[ii] == 1 ? "tick" : "cross";
        fIconWrap.append(
          '<div class="' +
            fIcon +
            '" style="top:8px;width:40px;height: 50px;"></div>'
        );
      }
    } else {
      fOptions.find(".que").each(function () {
        fIconWrap = $(this).find(".icon_wrap");
        fIconWrap.find(".tick").remove();
        fIconWrap.find(".cross").remove();
      });
    }
  }
  function showMCQAdvAudio(aShow, aArr, aIfCorrArr) {
    var fOptions = currentQObj.quePart.children(".options");
    var fAudioIcon;
    if (aShow) {
      for (var ii = 0; ii < aArr.length; ii++) {
        var _ob = fOptions.find(".que").eq(ii);
        fAudioIcon = _ob.find(".audioIcon");
        if (aArr[ii] == 1 && aIfCorrArr[ii] == 1) {
          fAudioIcon.removeClass("disabled");
        }
      }
    }
  }
  function resetMCQAdvanced() {
    var options = currentQObj.quePart.children(".options");
    options.children(".que").each(function () {
      var _bgColor =
        $(this).data("bgcolor") != undefined && $(this).data("bgcolor") != null
          ? $(this).data("bgcolor")
          : "none";
      var _selShape =
        $(this).data("selectshape") != undefined &&
        $(this).data("selectshape") != null
          ? $(this).data("selectshape")
          : "rect";
      var _needAudio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      var _initbgColor =
        $(this).data("initbgcolor") != undefined &&
        $(this).data("initbgcolor") != null
          ? $(this).data("initbgcolor")
          : "none";
      if (_needAudio == "yes" || _needAudio == "yesifcorrect") {
        $(this).find(".audioIcon").show();
        if (_needAudio == "yesifcorrect") {
          $(this).find(".audioIcon").addClass("disabled");
        }
        $(this).find(".audioIcon").addClass("off");
      } else {
        $(this).find(".audioIcon").hide();
      }
      $(this).find(".tick").remove();
      $(this).find(".cross").remove();
      $(this)
        .find(".pick")
        .each(function () {
          $(this).data("sel", "0");
          $(this).removeClass("selected");
          $(this).css("cursor", "pointer");
          if (_initbgColor == "none") {
            $(this).css("background-color", "rgba(255,255,255,0.05)");
          } else {
            $(this).css("background-color", _initbgColor);
          }

          if (_bgColor == "none" || _selShape == "cross") {
            $(this).css("border-color", "transparent");
          }
          if (_selShape == "svg") {
            $(this).css("background-color", "transparent");
            $(this).find("svg").removeClass("fillBlue");
            $(this).find("svg").removeClass("fillGreen");
            $(this).find("svg").removeClass("fillRed");
            $(this).find("svg").addClass("fillWhite");
          }
          $(this).find(".selX").hide();
        });
    });
    showMCQAdvIcons(false);
    showFeedback(false);
  }
  // ------------ >>  mcq_advanced functions - ends here >> --------------
  // ------------ >>  mcq functions - starts here >> --------------
  $(".roundRect").click(function () {
    if ($(this).css("cursor") == "pointer") {
      $(".roundRect").removeClass("selected");
      $(this).addClass("selected");

      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    }
  });
  function resetMCQ() {
    $(".roundRect").removeClass("selected");
    $(".roundRect").css("cursor", "pointer");
    $(".roundRect").find(".tick").remove();
    $(".roundRect").find(".cross").remove();
    showFeedback(false);
  }
  function validateMCQ() {
    var options = currentQObj.quePart.children(".options");
    options.children(".roundRect").each(function () {
      if ($(this).hasClass("selected")) {
        if ($(this).data("answer") > 0) {
          showFeedback(true, true);
          $(this).find(".icon_wrap").append('<div class="tick"></div>');
          $bodyContainer.find(".resetBtn").addClass("disabled");
        } else {
          $(this).find(".icon_wrap").append('<div class="cross"></div>');
          showFeedback(true, false);
        }
      }
    });
  }
  // ------------ >>  mcq functions - ends here >> --------------
  // ------------ >>  dad - line draw functions - starts here >> --------------
  var ctx;

  var startDraw = false;
  var points = {};
  points.x1 = 0;
  points.y1 = 0;
  points.x2 = 0;
  points.y2 = 0;
  points.isVisible = false;
  points.question = 0;
  points.answer = 0;
  points.qElement;
  points.aElement;
  points.startElement;
  points.color = currentQObj.color;

  var offset = 5;
  var curv = {};
  curv.XOffset = 20;
  curv.YOffset = 40;
  curv.join = "round";

  var myObjects = [];

  var _node = document.querySelectorAll(".node");

  function touchHandler(e) {
    var touchend = e.type == "touchend";
    if (event.touches) {
      var touch = event.touches[0];

      if (touch != undefined && touch != null) {
        var xcoord = touch.pageX;
        var ycoord = touch.pageY;
        var targetElement = document.elementFromPoint(xcoord, ycoord);

        if (targetElement.classList.contains("slide")) {
          if (!touchend) {
            if (currentQObj.qType == "dad_line") {
              if (startDraw) {
                points.x2 = touch.pageX;
                points.y2 = touch.pageY;
                resetMousePoint(true);
                drawIt();
              }
            } else if (
              currentQObj.qType == "color_palette" ||
              currentQObj.qPlus == "palette"
            ) {
              if (startColoring) {
                $(".mousePoint").css("top", e.pageY + 5);
                $(".mousePoint").css("left", e.pageX - 15);
              }
            } else if (currentQObj.qType == "wordsearch") {
            }
          }
        } else {
          if (
            targetElement.classList.contains("dropPoint") ||
            targetElement.classList.contains("dragPoint")
          ) {
            var thisNode = targetElement.classList.contains("dropPoint")
              ? "dropPoint"
              : "dragPoint";
            if (startDraw) {
              var fIdArr = targetElement.id.split("_");
              var fParentId = "d_" + currentQObj.qNum + "_" + fIdArr[2];
              var fNode = $("#" + targetElement.id);
              var fParent = $("#" + fParentId); //document.getElementById(fParentId);
              var allowConnect =
                currentQObj.connectType == "single"
                  ? fNode.data("connected") == ""
                  : true;
              var connectCond =
                points.startElement == "dragPoint"
                  ? thisNode == "dropPoint"
                  : thisNode == "dragPoint";
              if (
                fNode.css("cursor") == "pointer" &&
                connectCond &&
                allowConnect
              ) {
                points.x2 = fNode.offset().left + offset;
                points.y2 = fNode.offset().top + offset;

                if (thisNode == "dragPoint") {
                  points.question = fParent.data("question");
                  points.qElement = fNode;
                } else {
                  points.answer = fParent.data("answer");
                  points.aElement = fNode;
                }
                updateConnectedStatus(points);
                drawIt();
                myObjects.push(points);
                startDraw = false;
                resetMousePoint(false);
                $bodyContainer.find(".checkBtn").removeClass("disabled");
                $bodyContainer.find(".resetBtn").removeClass("disabled");
              }
            }
          } else if (targetElement.classList.contains("col")) {
            if (currentQObj.qType == "wordsearch") {
              wordSearch.cellMove(targetElement.classList.value);
            }
          }
        }
      } else {
        if (touchend) {
          if (currentQObj.qType == "dad_line") {
            startDraw = false;
            resetMousePoint(false);
            redrawAll(myObjects);
          } else if (currentQObj.qType == "wordsearch") {
            wordSearch.cellTouchEnd();
          }
        }
      }
    } else {
    }
  }
  // document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend" || "touchcancel", touchHandler, true);

  if (_node.length > 0) {
    for (var i = 0; i < _node.length; i++) {
      _node[i].addEventListener("touchstart", function (evt) {
        var allowConnect =
          currentQObj.connectType == "single"
            ? $(this).data("connected") == ""
            : true;
        var thisNode = $(this).attr("class").split(" ")[1];

        if ($(this).css("cursor") == "pointer" && allowConnect) {
          startDraw = true;
          points = {};
          points.x1 = $(this).offset().left + offset;
          points.y1 = $(this).offset().top + offset;
          points.isVisible = true;
          points.color = currentQObj.color;
          points.startElement = thisNode;
          if (thisNode == "dragPoint") {
            points.question = $(this).parent().data("question");
            points.qElement = $(this);
          } else {
            points.answer = $(this).parent().data("answer");
            points.aElement = $(this);
          }
          // resetMousePoint(true);
          drawIt();
        } else {
          startDraw = false;
        }
      });
    }
  }

  $(".node").mousedown(function () {
    var allowConnect =
      currentQObj.connectType == "single"
        ? $(this).data("connected") == ""
        : true;
    var thisNode = $(this).attr("class").split(" ")[1];
    if ($(this).css("cursor") == "pointer" && allowConnect) {
      startDraw = true;
      points = {};
      points.x1 = $(this).offset().left + offset;
      points.y1 = $(this).offset().top + offset;
      points.isVisible = true;
      points.color = currentQObj.color;
      points.startElement = thisNode;
      if (thisNode == "dragPoint") {
        points.question = $(this).parent().data("question");
        points.qElement = $(this);
      } else {
        points.answer = $(this).parent().data("answer");
        points.aElement = $(this);
      }
      // resetMousePoint(true);
      drawIt();
    } else {
      startDraw = false;
    }
  });
  $(".slides").mousemove(function (e) {
    if (currentQObj.qType == "dad_line") {
      if (startDraw) {
        points.x2 = e.pageX;
        points.y2 = e.pageY;
        resetMousePoint(true);
        drawIt();
      }
    } else if (
      currentQObj.qType == "color_palette" ||
      currentQObj.qPlus == "palette"
    ) {
      if (startColoring) {
        $(".mousePoint").css("top", e.pageY + 5);
        $(".mousePoint").css("left", e.pageX - 15);
      }
    }
  });
  $(".slides").mouseup(function (e) {
    if (currentQObj.qType == "dad_line") {
      startDraw = false;
      resetMousePoint(false);
      redrawAll(myObjects);
    }
  });
  $bodyContainer.on("mouseup", ".mousePoint", function (e) {
    if (currentQObj.qType == "dad_line") {
      startDraw = false;
      resetMousePoint(false);
      redrawAll(myObjects);
    }
  });

  $(".node").mouseup(function () {
    var allowConnect =
      currentQObj.connectType == "single"
        ? $(this).data("connected") == ""
        : true;
    var thisNode = $(this).attr("class").split(" ")[1];
    if (startDraw) {
      var connectCond =
        points.startElement == "dragPoint"
          ? thisNode == "dropPoint"
          : thisNode == "dragPoint";
      if ($(this).css("cursor") == "pointer" && connectCond && allowConnect) {
        points.x2 = $(this).offset().left + offset;
        points.y2 = $(this).offset().top + offset;

        if (thisNode == "dragPoint") {
          points.question = $(this).parent().data("question");
          points.qElement = $(this);
        } else {
          points.answer = $(this).parent().data("answer");
          points.aElement = $(this);
        }
        updateConnectedStatus(points);
        drawIt();
        myObjects.push(points);
        startDraw = false;
        resetMousePoint(false);

        $bodyContainer.find(".checkBtn").removeClass("disabled");
        $bodyContainer.find(".resetBtn").removeClass("disabled");
      }
    }
  });
  function updateConnectedStatus(aObj) {
    aObj.qElement.data("connected", "1");
    var tpa = aObj.aElement.data("connected");
    tpa +=
      aObj.aElement.data("connected") == ""
        ? aObj.question
        : "," + aObj.question;
    aObj.aElement.data("connected", tpa);
  }
  function initDrawCanvas() {
    ctx = document.getElementById("mycanvas").getContext("2d");
  }
  function drawIt() {
    if (startDraw && ctx != undefined) {
      ctx.strokeStyle = points.color;
      ctx.lineWidth = currentQObj.thick;
      ctx.lineJoin = curv.join;
      redrawAll(myObjects);
      ctx.beginPath();
      ctx.moveTo(points.x1, points.y1);
      if (currentQObj.connectPath == "curve") {
        ctx.bezierCurveTo(
          points.x1 + curv.XOffset,
          points.y1 - curv.YOffset,
          points.x2 - curv.XOffset,
          points.y2 + curv.YOffset,
          points.x2,
          points.y2
        );
      } else {
        ctx.lineTo(points.x2, points.y2);
      }
      $(".mousePoint").css("top", points.y2 - offset);
      $(".mousePoint").css("left", points.x2 - offset);
      ctx.stroke();
    }
  }

  function drawLinePath(aObj) {
    if (ctx != undefined) {
      ctx.save();
      ctx.translate(0.5, 0.5);
      ctx.beginPath();
      ctx.strokeStyle = aObj.color;
      ctx.lineWidth = currentQObj.thick;
      ctx.lineJoin = curv.join;
      ctx.moveTo(aObj.x1, aObj.y1);
      if (currentQObj.connectPath == "curve") {
        ctx.bezierCurveTo(
          aObj.x1 + curv.XOffset,
          aObj.y1 - curv.YOffset,
          aObj.x2 - curv.XOffset,
          aObj.y2 + curv.YOffset,
          aObj.x2,
          aObj.y2
        );
      } else {
        ctx.lineTo(aObj.x2, aObj.y2);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  function redrawAll(myObjects) {
    if (ctx != undefined) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      if (myObjects.length > 0) {
        for (var i = 0; i < myObjects.length; i++) {
          if (myObjects[i].isVisible) {
            myObjects[i].color =
              myObjects[i].color == currentQObj.color
                ? "black"
                : myObjects[i].color;
            drawLinePath(myObjects[i]);
          }
        }
      }
    }
  }
  function resetDADLine() {
    connections = [];
    myObjects = [];
    redrawAll(myObjects);
    resetMousePoint(false);
    // $( '.node' ).css( "cursor", "pointer" );
    // $( '.node' ).data( "connected", '' );
    var fQNum = currentQObj.qNum;
    if (currentQObj.qType == "dad_line") {
      var fOptions = currentQObj.quePart.children(".options");
      fOptions.find(".drag").each(function () {
        var id = $(this).index();
        $(this).attr("id", "d_" + fQNum + "_" + id);
        $(this)
          .find(".dragPoint")
          .attr("id", "pt_" + fQNum + "_" + id);
        $(this).find(".dragPoint").css("cursor", "pointer");
        $(this).find(".dragPoint").data("connected", "");
      });
      fOptions.find(".drop").each(function () {
        var id = $(this).index();
        $(this).find(".tick").remove();
        $(this).find(".cross").remove();
        $(this).find(".dropPoint").data("isCorr", "");

        $(this).attr("id", "d_" + fQNum + "_" + id);
        $(this)
          .find(".dropPoint")
          .attr("id", "pt_" + fQNum + "_" + id);
        $(this).find(".dropPoint").css("cursor", "pointer");
        $(this).find(".dropPoint").data("connected", "");
      });
    }

    showFeedback(false);
  }
  function resetMousePoint(aBool) {
    if (!aBool) {
      $(".mousePoint").css("top", 0);
      $(".mousePoint").css("left", 0);
    }
    aBool
      ? $(".mousePoint").css("opacity", 1)
      : $(".mousePoint").css("opacity", 0);
  }
  function validateDADLine() {
    var correctCount = 0;
    // ----- checking the line objects ---- //
    if (myObjects.length > 0) {
      for (var i = 0; i < myObjects.length; i++) {
        var tObj = myObjects[i];
        myObjects[i].isCorrect = false;
        var tq = Number(tObj.question);
        var isAns = $.inArray(tq, getIntArray(tObj.answer)) >= 0;
        var isConnected =
          $.inArray(tq, getIntArray(tObj.aElement.data("connected"))) >= 0;
        if (isAns && isConnected) {
          myObjects[i].isCorrect = true;
          myObjects[i].color = "green";
        } else {
          myObjects[i].color = "red";
        }
      }
    }
    // ----- checking the drop point connections ---- //
    var fOptions = currentQObj.quePart.children(".options");
    fOptions.find(".drop").each(function () {
      //$('.dropPoint').each(function () {
      var thisAns = getIntArray($(this).data("answer"));
      var _drpPt = $(this).find(".dropPoint");
      var thisConn =
        _drpPt.data("connected").length > 0
          ? getIntArray(_drpPt.data("connected"))
          : [];

      var thisIsCorr = compareArrays(thisAns, thisConn);
      _drpPt.data("isCorr", thisIsCorr);
      if (thisIsCorr) {
        correctCount++;
        if (currentQObj.icon == "both") {
          $(this)
            .find(".icon_wrap")
            .append('<div class="tick" style="width:100%"></div>');
        }
      } else {
        if (currentQObj.icon == "both" || currentQObj.icon == "cross") {
          $(this)
            .find(".icon_wrap")
            .append('<div class="cross" style="width:100%"></div>');
        }
      }
    });
    showFeedback(true, correctCount == currentQObj.numDrops);
    if (correctCount == currentQObj.numDrops) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
    redrawAll(myObjects);
  }
  function compareArrays(a, b) {
    var isEq = false;
    var isIn = 0;
    var isNotIn = 0;
    if (a.length == b.length) {
      $.each(a, function (i, val) {
        var result = $.inArray(val, b);
        if (result != -1) {
          isIn++;
        } else {
          isNotIn++;
        }
      });
      isEq = isIn == b.length && isNotIn == 0;
    }
    return isEq;
  }

  // ------------ >>  dad - line draw functions - ends here >> --------------
  // ------------ >>  order (pictures in order) functions - starts here >> --------------
  // $('.numberBox').find('input').keyup(function () {
  $(".numberBox")
    .find("input")
    .on("input", function () {
      var v = this.value;
      $(this).css("color", "black");
      var fIconWrap = $(this).parent().parent().find(".icon_wrap");
      if ($.isNumeric(v) === false) {
        this.value = this.value.slice(0, -1);
      } else {
        $bodyContainer.find(".resetBtn").removeClass("disabled");
        $bodyContainer.find(".checkBtn").removeClass("disabled");
      }
      fIconWrap.find(".tick").remove();
      fIconWrap.find(".cross").remove();
    });
  function resetOrder() {
    var options = currentQObj.quePart.children(".options");
    options.children(".pic").each(function () {
      //$( this ).find('input').val('');
      var fIconWrap = $(this).find(".icon_wrap");
      var _txtBx = $(this).find("input");
      if ((_txtBx.attr("readonly") || _txtBx.attr("disabled")) == undefined) {
        _txtBx.val("");
        $(this).find("input").prop("disabled", false);
        $(this).find("input").css("color", "black");
      }
      fIconWrap.find(".tick").remove();
      fIconWrap.find(".cross").remove();
    });
    $("input[type='text']:enabled").first().focus();
    if (currentQObj.qPlus == "palette") {
      resetColorPalette();
    }
    currentQObj.firstPart = 0;
    //$('form :input:text:visible:not(input[class*=filter]):first').focus();
  }
  function validateOrder() {
    currentQObj.firstPart = 0;
    var correctCount = 0;
    var options = currentQObj.quePart.children(".options");
    options.children(".pic").each(function () {
      var ans =
        $(this).data("answer") !== undefined &&
        $(this).data("answer") !== null &&
        $(this).data("answer") > 0
          ? $(this).data("answer")
          : 1;
      var userAns = "";
      var _txtBx = $(this).find("input");
      var isInput =
        (_txtBx.attr("readonly") || _txtBx.attr("disabled")) == undefined;
      if ($(this).find("input").val().length > 0) {
        if ($(this).find("input").val() != " ") {
          userAns = parseInt($(this).find("input").val());
        }
      }
      var fIconWrap = $(this).find(".icon_wrap");
      if (isInput) {
        if (ans == userAns) {
          correctCount++;
          $(this).find("input").css("color", "green");
          $(this).find("input").val(userAns);
          $(this).data("correct", 1);
          fIconWrap.append(
            '<div class="tick" style="width:35px;height: 40px;"></div>'
          );
        } else {
          $(this).find("input").css("color", "red");
          $(this).find("input").val(userAns);
          $(this).data("correct", 0);
          fIconWrap.append(
            '<div class="cross" style="width:35px;height: 40px;"></div>'
          );
        }
      } else {
        correctCount++;
      }
    });
    if (currentQObj.qPlus == "none") {
      showFeedback(true, correctCount == currentQObj.numOptions);
      if (correctCount == currentQObj.numOptions) {
        $bodyContainer.find(".resetBtn").addClass("disabled");
      }
    } else {
      if (currentQObj.qPlusValidation == "yes") {
        if (correctCount == currentQObj.numOptions) {
          currentQObj.firstPart = 1;
        }
      }
    }
  }
  // ------------ >>  order (pictures in order) functions - ends here >> --------------
  // ------------ >>  Tick Activity functions - ends here >> --------------
  $(".opt_set").click(function () {
    var selTyp = $(this).parent().parent().data("select");
    var isVis = $(this).find(".tickBox").children().length > 0 ? 0 : 1;
    $(this).find(".tickBox").removeClass("green");
    $(this).find(".tickBox").removeClass("red");
    if (selTyp == "single") {
      $(this).parent().find(".tickBox").empty();
      $(this).parent().find(".opt_set").data("selected", 0);
      $(this).data("selected", isVis);
    } else if (selTyp == "multiple") {
      $(this).data("selected", isVis);
    }
    setTick($(this), isVis);
    setValues($(this).parent());
    checkForControls();
  });
  function setTick(aObj, aVis) {
    if (aVis == 1) {
      aObj
        .find(".tickBox")
        .append(
          '<i class="fa fa-check fa-2x" aria-hidden="true" style="padding-top: 10px;"></i>'
        );
    } else {
      aObj.find(".tickBox").empty();
    }
  }
  function setValues(aObj) {
    var arr = [];
    var notSel = 0;
    aObj.children(".opt_set").each(function () {
      if ($(this).data("selected") == 1) {
        arr.push($(this).index());
      } else {
        notSel++;
      }
    });

    if (notSel == aObj.children().length) {
      aObj.data("selOpt", []);
    } else {
      aObj.data("selOpt", arr);
    }
  }
  function checkForControls() {
    var options = currentQObj.quePart.children(".options");
    var isVal = false;
    options.children(".opt_grp").each(function () {
      if ($(this).data("selOpt").length > 0) {
        if (!isVal) {
          isVal = true;
        }
      }
    });
    if (isVal) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function validateTickSelect() {
    var options = currentQObj.quePart.children(".options");
    var correctCount = options.length;
    var isCorrect = [];
    for (var cc = 0; cc < correctCount; cc++) {
      isCorrect[cc] = 0;
    }
    var count = 0;
    options.each(function () {
      var opt_grp = $(this).find(".opt_grp");
      var corr_ans = $(this).data("answer");
      if ($(this).data("select") == "single") {
        if (opt_grp.data("selOpt").length > 0) {
          var indx = parseInt(opt_grp.data("selOpt"));
          var theObj = opt_grp.find(".opt_set").eq(indx).find(".tickBox");
          if (corr_ans == indx + 1) {
            theObj.addClass("green");
            isCorrect[count] = 1;
          } else {
            theObj.empty();
            theObj.addClass("red");
            theObj.append(
              '<i class="fa fa-times fa-2x" aria-hidden="true" style="padding-top: 10px;"></i>'
            );
          }
        }
      } else if ($(this).data("select") == "multiple") {
        if (opt_grp.data("selOpt").length > 0) {
          var userAnsArr = opt_grp.data("selOpt");
          var corrAnsArr = getIntArray(corr_ans);
          var tmpCorr = 0;
          var tmpWrong = 0;
          for (var i = 0; i < userAnsArr.length; i++) {
            var tmp = userAnsArr[i] + 1;
            var inArr = $.inArray(tmp, corrAnsArr);
            var theObj = opt_grp
              .find(".opt_set")
              .eq(tmp - 1)
              .find(".tickBox");
            if (inArr != -1) {
              theObj.addClass("green");
              tmpCorr++;
            } else {
              tmpWrong++;
              theObj.empty();
              theObj.addClass("red");
              theObj.append(
                '<i class="fa fa-times fa-2x" aria-hidden="true" style="padding-top: 10px;"></i>'
              );
            }
          }
          if (tmpCorr == corrAnsArr.length && tmpWrong == 0) {
            isCorrect[count] = 1;
          }
        }
      }
      count++;
    });
    var allCorrect = isCorrect.join("").split("0")[0].length == correctCount;
    showFeedback(true, allCorrect);
    if (allCorrect) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function resetTickSelect() {
    $(".opt_set").css("cursor", "pointer");
    $(".opt_set").data("selected", 0);
    $(".opt_grp").data("selOpt", []);
    $(".tickBox").empty();
    $(".tickBox").removeClass("green");
    $(".tickBox").removeClass("red");
    var options = currentQObj.quePart.children(".options");
    options.each(function () {
      var _needAudio =
        $(this).data("audio") != undefined && $(this).data("audio") != null
          ? $(this).data("audio")
          : "no";
      if (_needAudio == "yes") {
        $(this).find(".audioIcon").show();
      } else {
        $(this).find(".audioIcon").hide();
      }
    });
  }
  // ------------ >>  Tick Activity functions - ends here >> --------------
  // ------------ >>  Drop down functions - starts here >> ----------------
  function initiateDropDown() {
    var sel = $(".choice");
    sel.empty();
    $.each(currentQObj.selOptions, function (value, key) {
      sel.append('<option value="' + value + '">' + key + "</option>");
    });
  }
  $(".choice").change(function () {
    var thisVal = $(this).children("option:selected").val();
    $(this).parent().find(".res_icon").empty();
    if (thisVal) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    }
  });
  function validateDropDowns() {
    var correctAns = getIntArray(currentQObj.quePart.data("answer"));
    var correctCount = 0;
    for (var dd = 1; dd <= currentQObj.numOptions; dd++) {
      var _thisDrpDown = currentQObj.quePart.find("#choice_" + dd);
      var tp = _thisDrpDown.children("option:selected").val();
      var resultBox = _thisDrpDown.parent().find(".res_icon");
      resultBox.removeClass("green");
      resultBox.removeClass("red");
      resultBox.empty();
      if (correctAns[dd - 1] == parseInt(tp)) {
        correctCount++;
        resultBox.append(
          '<div class="tick" style="right: -8px;top: 0;width: 35px;height: 50px;"></div>'
        );
      } else {
        resultBox.append(
          '<div class="cross" style="right: -8px;top: 0;width: 35px;height: 40px;"></div>'
        );
      }
    }
    showFeedback(true, correctCount == correctAns.length);
    if (correctCount == correctAns.length) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function resetDropDowns() {
    $(".choice")[0].selectedIndex = 0;
    for (var dd = 1; dd <= currentQObj.numOptions; dd++) {
      currentQObj.quePart.find("#choice_" + dd)[0].selectedIndex = 0;
    }
    $(".res_icon").empty();
  }
  // ------------ >>  Drop down functions - ends here >> --------------
  // ------------ >>  color_select functions - starts here >> --------------
  $(".face").click(function () {
    var isSelected = 1;
    if (
      $(this).find("circle:first-child").hasClass("fillBlue") ||
      $(this).find("circle:first-child").hasClass("fillRed") ||
      $(this).find("circle:first-child").hasClass("fillGreen")
    ) {
      isSelected = 0;
    }
    clearColors($(this).parent());
    if (isSelected == 1) {
      $(this).find("circle:first-child").addClass("fillBlue");
    }
    $(this).parent().find(".face").data("selected", 0);
    $(this).data("selected", isSelected);
    setColorSelectValues($(this).parent().parent());
    $(this).parent().parent().find(".tick").remove();
    $(this).parent().parent().find(".cross").remove();
    showControls();
  });
  function setColorSelectValues(aObj) {
    var arr = [];
    var notSel = 0;
    var colorIt = aObj.find(".svgs");
    colorIt.children(".face").each(function () {
      if ($(this).data("selected") == 1) {
        arr.push($(this).index());
      } else {
        notSel++;
      }
    });
    if (notSel == colorIt.children(".face").length) {
      aObj.data("selOpt", []);
    } else {
      aObj.data("selOpt", arr);
    }
  }
  function showControls() {
    var options = currentQObj.quePart.children(".options");
    var isVal = false;
    options.children(".colorIt").each(function () {
      if ($(this).data("selOpt").length > 0) {
        if (!isVal) {
          isVal = true;
        }
      }
    });
    if (isVal) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function clearColors(aObj) {
    aObj.children(".face").each(function () {
      $(this).find("circle:first-child").removeClass("fillBlue");
      $(this).find("circle:first-child").removeClass("fillGreen");
      $(this).find("circle:first-child").removeClass("fillRed");
    });
  }
  function validateColorSelect() {
    var options = currentQObj.quePart.children(".options");
    var correctCount = options.find(".colorIt").length;
    var isCorrect = [];
    for (var cc = 0; cc < correctCount; cc++) {
      isCorrect[cc] = 0;
    }
    var count = 0;
    options.children(".colorIt").each(function () {
      var corr_ans = $(this).data("answer");
      var svgs = $(this).find(".svgs");
      if ($(this).data("selOpt").length > 0) {
        var indx = parseInt($(this).data("selOpt")[0]);
        var theObj = svgs.find(".face").eq(indx).find("circle:first-child");
        // theObj.removeClass('fillBlue');
        if (corr_ans == indx + 1) {
          // theObj.addClass('fillGreen');
          isCorrect[count] = 1;
          $(this)
            .find(".icon_wrap")
            .append("<div class='tick' style='width:100%;'></div>");
        } else {
          theObj.empty();
          // theObj.addClass('fillRed');
          $(this)
            .find(".icon_wrap")
            .append("<div class='cross' style='width:100%;'></div>");
        }
      } else {
        $(this)
          .find(".icon_wrap")
          .append("<div class='cross' style='width:100%;'></div>");
      }

      count++;
    });
    var allCorrect = isCorrect.join("").split("0")[0].length == correctCount;
    showFeedback(true, allCorrect);
    if (allCorrect) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function resetColorSelect() {
    $(".face").data("selected", 0);
    $(".face").find("circle").removeClass("fillBlue");
    $(".face").find("circle").removeClass("fillGreen");
    $(".face").find("circle").removeClass("fillRed");
    $(".colorIt").data("selOpt", []);
    $(".colorIt").find(".tick").remove();
    $(".colorIt").find(".cross").remove();
  }
  // ------------ >>  color_select functions - ends here >> --------------
  // ------------ >>  coloring functions - starts here >> --------------
  $(".shape").click(function () {
    var options = currentQObj.quePart.children(".options");
    var selTyp = $(this).parent().parent().data("select");
    var isBlue = $(this).hasClass("fillBlue") ? 0 : 1;
    if (selTyp == "multiple") {
      if ($(this).hasClass("fillGreen") || $(this).hasClass("fillRed")) {
        isBlue = 0;
      }
      $(this).removeClass("fillGreen");
      $(this).removeClass("fillRed");
      $(this).removeClass("fillBlue");
      $(this).data("colored", isBlue);
      if (isBlue == 1) {
        $(this).addClass("fillBlue");
      }
      if (currentQObj.qType == "coloring") {
        options.find(".tc_icons").hide();
      }
    } else if (selTyp == "single") {
      $(this).parent().find(".shape").removeClass("fillGreen");
      $(this).parent().find(".shape").removeClass("fillRed");
      $(this).parent().find(".shape").removeClass("fillBlue");
      $(this).parent().find(".shape").data("colored", 0);
      $(this).data("colored", isBlue);
      if (isBlue == 1) {
        $(this).addClass("fillBlue");
      }

      $(this).parent().parent().find(".tick").remove();
      $(this).parent().parent().find(".cross").remove();
    }
    setColoredShapeValues($(this).parent());
    checkCtrlsForColoring();
    if (currentQObj.qType == "color_answer") {
      var options = currentQObj.quePart.children(".options1");
      var tickBox = options.find(".txtBox");
      tickBox.find(".tick").remove();
      tickBox.find(".cross").remove();
    }
  });
  function setColoredShapeValues(aObj) {
    var arr = [];
    var notSel = 0;
    aObj.children(".shape").each(function () {
      if ($(this).data("colored") == 1) {
        arr.push($(this).index());
      } else {
        notSel++;
      }
    });

    if (notSel == aObj.children().length) {
      aObj.parent().data("selShapes", []);
    } else {
      aObj.parent().data("selShapes", arr);
    }
  }
  function checkCtrlsForColoring() {
    var options = currentQObj.quePart.children(".options");
    var isVal = false;
    options.children(".que").each(function () {
      if ($(this).data("selShapes").length > 0) {
        if (!isVal) {
          isVal = true;
        }
      }
    });
    if (isVal) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function validateColoringActivity() {
    var options = currentQObj.quePart.children(".options");
    var correctCount = options.find(".que").length;
    var isCorrect = [];
    for (var cc = 0; cc < correctCount; cc++) {
      isCorrect[cc] = 0;
    }
    var count = 0;
    currentQObj.numUserColored = 0;
    currentQObj.coloredRight = false;
    currentQObj.txtRight = false;
    var theIcons = options.find(".tickCross_icons");
    options.children(".que").each(function () {
      var selTyp = $(this).data("select");
      var corr_ans = $(this).data("answer");
      var theSvg = $(this).find("svg");

      if (selTyp == "multiple") {
        var shapesCount = theSvg.find(".shape").length;
        // if($(this).data('selShapes').length > 0){
        var userAnsArr = $(this).data("selShapes");
        var corrAnsArr = getIntArray(corr_ans);
        var tmpCorr = 0;
        var tmpWrong = 0;
        for (var i = 0; i < shapesCount; i++) {
          var inUserArr = $.inArray(i, userAnsArr);
          var inArr = $.inArray(i + 1, corrAnsArr);
          var theObj = theSvg.find(".s_" + (i + 1));
          var _icn = theIcons.find(".i_" + (i + 1));
          if (inArr != -1) {
            if (inUserArr != -1) {
              _icn.find(".cross").hide();
              _icn.find(".tick").show();
              currentQObj.numUserColored++;
              tmpCorr++;
            } else {
              tmpWrong++;
              _icn.find(".cross").show();
              _icn.find(".tick").hide();
            }
          } else {
            if (inUserArr == -1) {
              _icn.find(".cross").hide();
              _icn.find(".tick").show();
            } else {
              tmpWrong++;
              _icn.find(".cross").show();
              _icn.find(".tick").hide();
            }
          }
        }
        theIcons.find(".tc_icons").show();
        if (tmpCorr == corrAnsArr.length && tmpWrong == 0) {
          isCorrect[count] = 1;
        }
        // }
      } else if (selTyp == "single") {
        if ($(this).data("selShapes").length > 0) {
          //for(var i=0;i<correctCount; i++){
          var indx = parseInt($(this).data("selShapes")[0]);
          var theObj = theSvg.find(".shape").eq(indx);
          // var theIcon = $(this).find('.icon_wrap');
          if (corr_ans == indx + 1) {
            // theObj.addClass('fillGreen');
            $(this).find(".icon_wrap").append('<div class="tick"></div>');
            isCorrect[count] = 1;
          } else {
            $(this).find(".icon_wrap").append('<div class="cross"></div>');
            // theObj.addClass('fillRed');
          }
        } else {
          $(this).find(".icon_wrap").append('<div class="cross"></div>');
        }
      }
      count++;
    });
    var allCorrect = isCorrect.join("").split("0")[0].length == correctCount;
    if (currentQObj.qType == "coloring") {
      showFeedback(true, allCorrect);
      if (allCorrect) {
        $bodyContainer.find(".resetBtn").addClass("disabled");
      }
    } else if (currentQObj.qType == "color_answer") {
      currentQObj.coloredRight = allCorrect;
    }
  }
  function validateColoring() {
    var options = currentQObj.quePart.children(".options");
    var correctCount = options.find(".que").length;
    var isCorrect = [];
    for (var cc = 0; cc < correctCount; cc++) {
      isCorrect[cc] = 0;
    }
    var count = 0;
    currentQObj.numUserColored = 0;
    currentQObj.coloredRight = false;
    currentQObj.txtRight = false;
    options.children(".que").each(function () {
      var selTyp = $(this).data("select");
      var corr_ans = $(this).data("answer");
      var theSvg = $(this).find("svg");
      if (selTyp == "multiple") {
        if ($(this).data("selShapes").length > 0) {
          var userAnsArr = $(this).data("selShapes");
          var corrAnsArr = getIntArray(corr_ans);
          var tmpCorr = 0;
          var tmpWrong = 0;
          for (var i = 0; i < userAnsArr.length; i++) {
            var tmp = userAnsArr[i] + 1;
            var inArr = $.inArray(tmp, corrAnsArr);
            // var theObj = (theSvg.find('.shape').eq(tmp-1));
            var theObj = theSvg.find(".s_" + tmp);
            theObj.removeClass("fillBlue");
            if (inArr != -1) {
              theObj.addClass("fillGreen");
              currentQObj.numUserColored++;
              tmpCorr++;
            } else {
              tmpWrong++;
              theObj.addClass("fillRed");
            }
          }
          if (tmpCorr == corrAnsArr.length && tmpWrong == 0) {
            isCorrect[count] = 1;
          }
        }
      } else if (selTyp == "single") {
        if ($(this).data("selShapes").length > 0) {
          var indx = parseInt($(this).data("selShapes")[0]);
          var theObj = theSvg.find(".shape").eq(indx);
          if (corr_ans == indx + 1) {
            theObj.addClass("fillGreen");
            isCorrect[count] = 1;
          } else {
            theObj.addClass("fillRed");
          }
        }
      }
      count++;
    });
    var allCorrect = isCorrect.join("").split("0")[0].length == correctCount;
    if (currentQObj.qType == "coloring") {
      showFeedback(true, allCorrect);
      if (allCorrect) {
        $bodyContainer.find(".resetBtn").addClass("disabled");
      }
    } else if (currentQObj.qType == "color_answer") {
      currentQObj.coloredRight = allCorrect;
    }
  }
  function resetColoring() {
    $(".shape").data("colored", 0);
    $(".shape").removeClass("fillBlue");
    $(".shape").removeClass("fillGreen");
    $(".shape").removeClass("fillRed");
    $(".que").data("selShapes", []);
    var options = currentQObj.quePart.children(".options");
    options.find(".tc_icons").hide();
    options.children(".que").each(function () {
      var selTyp = $(this).data("select");
      if (selTyp == "single") {
        var theIcon = $(this).find(".icon_wrap");
        theIcon.find(".tick").remove();
        theIcon.find(".cross").remove();
      }
    });
  }
  // ------------ >>  coloring functions - ends here >> --------------
  // ------------ >>  color_answer functions - starts here >> --------------
  $(".txtBox")
    .find("input")
    .keyup(function () {
      var v = this.value;
      $(this).css("color", "black");
      var _typ =
        $(this).parent().data("type") != undefined
          ? $(this).parent().data("type")
          : "number";
      if (_typ == "number") {
        if ($.isNumeric(v) === false) {
          this.value = this.value.slice(0, -1);
        } else {
          $bodyContainer.find(".resetBtn").removeClass("disabled");
          $bodyContainer.find(".checkBtn").removeClass("disabled");
        }
      } else if (_typ == "text") {
        if (this.value.length > 0) {
          $bodyContainer.find(".resetBtn").removeClass("disabled");
          $bodyContainer.find(".checkBtn").removeClass("disabled");
        }
      }
      if (currentQObj.qType == "fill_in") {
        $(this).parent().parent().find(".tick").remove();
        $(this).parent().parent().find(".cross").remove();
      }
    });
  function validateTxtAnswers() {
    var options = currentQObj.quePart.children(".options1");
    var txtBox = options.find(".txtBox");
    txtBox.find(".tick").remove();
    txtBox.find(".cross").remove();
    var userAns =
      txtBox.find("input").val().length > 0
        ? parseInt(txtBox.find("input").val())
        : " ";
    if (userAns != " ") {
      if (userAns == currentQObj.numUserColored) {
        currentQObj.txtRight = true;
        txtBox.find("input").css("color", "green");
        txtBox.append(
          '<div class="tick" style="top:8px;width:40px;height: 50px;"></div>'
        );
      } else {
        txtBox.find("input").css("color", "red");
        txtBox.append(
          '<div class="cross" style="top:8px;width:40px;height: 50px;"></div>'
        );
      }
    }

    showFeedback(true, currentQObj.txtRight && currentQObj.coloredRight);
    if (currentQObj.txtRight && currentQObj.coloredRight) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function resetTxtAnswers() {
    var options = currentQObj.quePart.children(".options1");
    var txtBox = options.find(".txtBox");
    txtBox.find("input").val(" ");
    txtBox.find("input").css("color", "black");
    txtBox.find(".tick").remove();
    txtBox.find(".cross").remove();
    $(".shape").data("colored", 0);
    $(".que").data("selShapes", []);
  }
  // ------------ >>  color_answer functions - ends here >> --------------
  // ------------ >>  color_palette functions - starts here >> --------------
  var chosenColor = "";
  var startColoring = false;
  function buildpalette() {
    var _palette = currentQObj.quePart.find(".color_palette_wrap");
    _palette.find(".palette").empty();
    var colorArr = getStrArray(
      _palette.find(".palette").data("colors"),
      "activity"
    );
    if (colorArr.length > 0) {
      var htmlStmt = "";
      for (var cp = 0; cp < colorArr.length; cp++) {
        htmlStmt +=
          '<div class="colorBox" style="background-color:' +
          colorArr[cp] +
          '">';
        htmlStmt +=
          colorArr[cp] == "#ffffff"
            ? '<i class="fa fa-times red" aria-hidden="true" style="padding-top: 10px;"></i>'
            : "";
        htmlStmt += "</div>";
      }
      $(".palette").append(htmlStmt);
    }
    _palette.css("opacity", 0);
    _palette.data("visible", 0);
    setPalettePosition();
  }
  $(".palette_icon").click(function () {
    var _palette = currentQObj.quePart.find(".color_palette_wrap");
    var togglePalette = _palette.data("visible") == 1 ? 0 : 1;
    _palette.data("visible", togglePalette);
    setPalettePosition();
  });

  function setPalettePosition() {
    var right = 0;
    var _palette = currentQObj.quePart.find(".color_palette_wrap");
    if (_palette.data("visible") == 1) {
      right = 10;
      _palette.find(".right_aro").show();
      _palette.find(".left_aro").hide();
    } else {
      right = -(_palette.find(".palette").outerWidth() - 5);
      _palette.find(".right_aro").hide();
      _palette.find(".left_aro").show();
    }
    _palette.animate({ right: right + "px" }, 200);
  }

  $(".palette").on("click", ".colorBox", function (e) {
    chosenColor = $(this).css("background-color");
    startColoring = true;
    $(".mousePoint").css("background-color", chosenColor);
    rgb2hex(chosenColor);
    resetMousePoint(true);
  });

  $(".colorShape").click(function () {
    if (startColoring && chosenColor != "") {
      $(this).css("fill", chosenColor);
      $(this).data("colored", 1);
      chosenColor = "";
      resetMousePoint(false);
    }
    $(".tc_icons").hide();
    checkCtrlsForColorPalette();
  });
  $(".colorThis").click(function () {
    if (startColoring && chosenColor != "") {
      var svg = $(this).find("svg");
      svg.find(".colorShape").css("fill", chosenColor);
      chosenColor = "";
      resetMousePoint(false);
    }
  });

  function rgb2hex(rgb) {
    var hexArr = rgb
      .substr(4, rgb.indexOf(")") - 4)
      .split(",")
      .map((color) => parseInt(color).toString(16));
    var hexCode = "#";
    for (var r = 0; r < hexArr.length; r++) {
      if (hexArr[r].length < 2) {
        hexArr[r] = "0" + hexArr[r];
      }
      hexCode += hexArr[r];
    }
    return hexCode;
    //return ('#' + rgb.substr(4, rgb.indexOf(')') - 4).split(',').map((color) => parseInt(color).toString(16)).join(''));
  }
  function checkCtrlsForColorPalette() {
    var options = currentQObj.quePart.children(".options");
    var showCtrls = false;
    var svg = options.find("svg");
    svg.find(".colorShape").each(function () {
      if (!showCtrls) {
        showCtrls = $(this).data("colored") == 1;
      }
    });
    if (showCtrls) {
      $bodyContainer.find(".resetBtn").removeClass("disabled");
      $bodyContainer.find(".checkBtn").removeClass("disabled");
    } else {
      $bodyContainer.find(".resetBtn").addClass("disabled");
      $bodyContainer.find(".checkBtn").addClass("disabled");
    }
  }
  function validateColorPalette() {
    startColoring = false;
    resetMousePoint(false);
    $(".color_palette_wrap").data("visible", 0);
    setPalettePosition();
    var options = currentQObj.quePart.children(".options");
    var isCorrect = [];
    var count = 0;
    var theIcons = options.find(".tickCross_icons");
    var svg = options.find("svg");
    svg.find(".colorShape").each(function () {
      isCorrect[count] = 0;
      var ind = parseInt($(this).attr("class").split(" ")[1].split("_")[1]);
      var _icon = theIcons.find(".i_" + ind);
      var thisColr = rgb2hex($(this).css("fill"));
      var _colr = thisColr == $(this).data("color");
      if ($(this).data("colored") == 1) {
        //var _ans = (($.inArray( ($(this).index())+1, correctAns)) != -1);
        if (_colr) {
          _icon.find(".cross").hide();
          _icon.find(".tick").show();
          isCorrect[count] = 1;
        } else {
          _icon.find(".cross").show();
          _icon.find(".tick").hide();
        }
      } else {
        if (_colr) {
          _icon.find(".cross").hide();
          _icon.find(".tick").show();
          isCorrect[count] = 1;
        } else {
          _icon.find(".cross").show();
          _icon.find(".tick").hide();
        }
      }
      count++;
    });
    $(".tc_icons").show();

    var allCorrect = isCorrect.join("").split("0")[0].length == count;
    //if(currentQObj.qType == 'dad_objects' && currentQObj.qPlusValidation == 'yes' && currentQObj.qPlus == 'palette'){

    if (currentQObj.qPlus == "none") {
      showFeedback(true, allCorrect);
      if (allCorrect) {
        $bodyContainer.find(".resetBtn").addClass("disabled");
      }
    } else {
      if (
        currentQObj.qPlusValidation == "yes" &&
        currentQObj.qPlus == "palette"
      ) {
        if (currentQObj.firstPart == 1) {
          showFeedback(true, allCorrect);
          if (allCorrect) {
            $bodyContainer.find(".resetBtn").addClass("disabled");
          }
        } else {
          showFeedback(true, false);
        }
      }
    }
  }
  function resetColorPalette() {
    var _palette = currentQObj.quePart.find(".color_palette_wrap");
    var options = currentQObj.quePart.children(".options");
    _palette.data("visible", 0);
    setPalettePosition();
    options.find(".colorShape").data("colored", 0);
    options.find(".colorShape").css("fill", "white");
    _palette.css("opacity", 1);
    options.find(".tc_icons").hide();
    resetMousePoint(false);
  }
  // ------------ >>  color_palette functions - ends here >> --------------
  // ------------ >>  fill in functions - starts here >> --------------
  function decodeEntities(encodedString) {
    var textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
  }

  function validatefillIn() {
    var options = currentQObj.quePart.children(".options");
    var numOfFillIns = options.find(".que").length;
    var allCorrect = false;
    var resultArr = [];
    options.children(".que").each(function () {
      var _indx = $(this).index();
      var iconWrap = $(this).find(".icon_wrap");
      iconWrap.find(".tick").remove();
      iconWrap.find(".cross").remove();
      var _case =
        $(this).data("strictcase") != undefined &&
        $(this).data("strictcase") != null
          ? $(this).data("strictcase").toLowerCase()
          : "no";

      var _cAns = getStrArray($(this).data("answer"), "activity");
      var _uAns = [];
      var _corr = 0;
      var _wrong = 0;
      if ($(this).find("input").length > 0) {
        var fCt = 0;
        for (var ua = 0; ua < $(this).find("input").length; ua++) {
          var _tInput = $(this).find("input").eq(ua);
          if (
            (_tInput.attr("readonly") || _tInput.attr("disabled")) == undefined
          ) {
            if (_tInput.val().length > 0) {
              _uAns[fCt] =
                _case == "yes" ? _tInput.val() : _tInput.val().toLowerCase();
            } else {
              _uAns[fCt] = " ";
            }
            fCt++;
          }
        }
      }
      if (_cAns.length == _uAns.length) {
        for (var cc = 0; cc < _cAns.length; cc++) {
          _cAns[cc] = _case == "yes" ? _cAns[cc] : _cAns[cc].toLowerCase();
          if (_cAns[cc].indexOf("#") > -1) {
            _cAns[cc] = _cAns[cc].replace(/\#/g, ",");
          }
          _cAns[cc] = _cAns[cc].replace(/\s/g, "");
          _uAns[cc] = _uAns[cc].replace(/\s/g, "");
          if (_cAns[cc] == _uAns[cc]) {
            _corr++;
            $(this).find("input").eq(cc).css("color", "green");
          } else {
            _wrong++;
            $(this).find("input").eq(cc).css("color", "red");
          }
        }
      }
      if (_corr == _uAns.length && _wrong == 0) {
        resultArr[_indx] = 1;
        iconWrap.append(
          '<div class="tick" style="top:8px;width:40px;height: 50px;"></div>'
        );
      } else {
        resultArr[_indx] = 0;
        iconWrap.append(
          '<div class="cross" style="top:8px;width:40px;height: 50px;"></div>'
        );
      }
    });

    allCorrect = resultArr.join("").split("0")[0].length == numOfFillIns;

    //--- audio functions // ----------
    if (currentQObj.audioQue == "yes") {
      enableAudioIcons(resultArr);
    }
    //--- /audio functions // ----------
    showFeedback(true, allCorrect);
    if (allCorrect) {
      $bodyContainer.find(".resetBtn").addClass("disabled");
    }
  }
  function enableAudioIcons(aArr) {
    var options = currentQObj.quePart.children(".options");
    if (aArr.length > 0) {
      options.find(".que").each(function () {
        var _findx = $(this).index();
        var _fIcon;
        if (aArr[_findx] == 1) {
          $(this).find(".audioIcon").removeClass("disabled");
        }
      });
    }
  }
  function switchAudioIcon(val, control) {
    var options = currentQObj.quePart.children(".options");
    if (currentQObj.audioQue == "yes") {
      options.find(".que").each(function () {
        $(this).find(".audioIcon").removeClass("on").addClass("off");
      });
    }
    val = val !== undefined ? val : "off";
    var toRemove = val == "on" ? "off" : "on";
    if (control) {
      if ($(control).hasClass(toRemove)) {
        $(control).removeClass(toRemove);
      }
      $(control).addClass(val);
    }
  }
  function resetFillIn() {
    var options = currentQObj.quePart.children(".options");
    options.children(".que").each(function () {
      $(this).find("input").css("color", "black");
      if ($(this).find("input").length > 0) {
        for (var ua = 0; ua < $(this).find("input").length; ua++) {
          var _txtBx = $(this).find("input").eq(ua);
          if (
            (_txtBx.attr("readonly") || _txtBx.attr("disabled")) == undefined
          ) {
            _txtBx.val("");
          }
        }
      }
      $(this).find(".tick").remove();
      $(this).find(".cross").remove();
      if (currentQObj.audioQue == "yes") {
        $(this).find(".audioIcon").show();
        $(this).find(".audioIcon").addClass("disabled");
      } else {
        $(this).find(".audioIcon").hide();
      }
    });
  }
  // ------------ >>  fill in functions - ends here >> --------------
  // ------------ >>  initial call activity >> --------------
  setActivityArea();
  initActivity(currentSlide, "init");
  // -------- [ activity ends here ]-------------------------
}.call(this));
//--------------[ Common functions ]---------------------------
