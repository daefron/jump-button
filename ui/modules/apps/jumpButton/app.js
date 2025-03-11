angular.module("beamng.apps").directive("jumpButton", [
  function () {
    return {
      templateUrl: "/ui/modules/apps/jumpButton/app.html",
      replace: true,
      scope: true,
      restrict: "EA",
      link: function (scope, element, attrs) {
        scope.jumpStrength = 100; //arbitrary value
        scope.cooldown = {
          maxTime: 60, // 60 per second
          boxShadow: "inset 5000px 0px rgba(255, 255, 255, 0.3)",
        };

        // used when user presses jump key
        scope.$on("activateJump", function (_, data) {
          activateJump();
        });

        function activateJump() {
          if (scope.cooldown.waiting) {
            return;
          }
          scope.cooldown.waiting = true;

          // gets window width for box-shadow percentage
          const windowWidth = document.getElementById("jumpButton").offsetWidth;

          // loop for jump cooldown
          scope.cooldown.currentTime = 0;
          const readyLoop = setInterval(() => {
            if (scope.cooldown.currentTime >= scope.cooldown.maxTime) {
              scope.cooldown.waiting = false;
              clearInterval(readyLoop);
            }

            // values for box-shadow animation
            const percentage =
              scope.cooldown.currentTime / scope.cooldown.maxTime;
            const sizeValue = Math.round(percentage * windowWidth) + "px 0px ";
            const colorValue = "rgba(255, 255, 255, " + percentage * 0.25;

            // allows ui updates to be in high fps
            scope.$applyAsync(function () {
              scope.cooldown.boxShadow =
                "inset " + sizeValue + colorValue + ")";
            });

            scope.cooldown.currentTime++;
          }, 16.666); //makes loop run in 60fps

          // creates jump particle effect
          bngApi.engineLua("extensions.jumpButton.createDust()");

          // sets gravity to desired strength
          bngApi.activeObjectLua("obj:setGravity(" + scope.jumpStrength + ")");

          // resets gravity and stops dust after delay
          setTimeout(() => {
            bngApi.engineLua("extensions.jumpButton.removeDust()");
            bngApi.activeObjectLua("obj:setGravity(-9.81)"); //default gravity
            //TODO: use saved previous gravity if not on standard
          }, 50);
        }
      },
    };
  },
]);
