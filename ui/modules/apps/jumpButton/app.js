angular.module("beamng.apps").directive("jumpButton", [
  function () {
    return {
      templateUrl: "/ui/modules/apps/jumpButton/app.html",
      replace: true,
      scope: true,
      restrict: "EA",
      link: function (scope) {
        // gets previous UI values from Lua
        bngApi.engineLua("extensions.jumpButton.sendSettings()");
        scope.$on("RetrieveSettings", function (_, data) {
          scope.jumpStrength = data.strength;
          scope.cooldown.maxTime = data.delay;
        });

        // updates value used for delay animation
        scope.$on("RetrieveTime", function (_, data) {
          scope.cooldown.delayTime = data;
        });

        // sends current UI values to Lua on input change
        scope.storeSettings = function () {
          const currentSettings = [scope.jumpStrength, scope.cooldown.maxTime];
          bngApi.engineLua(
            "extensions.jumpButton.storeSettings(" + currentSettings + ")"
          );
        };

        // gives cooldown animation an initial value
        scope.cooldown = {
          boxShadow: "inset 5000px 0px rgba(255, 255, 255, 0.3)",
        };

        // used when user presses jump key
        scope.$on("ActivateJump", function () {
          // gets window width for box-shadow percentage
          const windowWidth = document.getElementById("jumpButton").offsetWidth;

          if (scope.cooldown.delayTime >= scope.cooldown.maxTime / 120) {
            scope.cooldown.delayTime = 0;
          }

          // loop for jump cooldown
          const readyLoop = setInterval(() => {
            // values for cooldown animation
            const percentage =
              scope.cooldown.delayTime / (scope.cooldown.maxTime / 120);
            const sizeValue = Math.round(percentage * windowWidth) + "px 0px ";
            const colorValue = "rgba(255, 255, 255, " + percentage * 0.25;

            // async allows ui updates to be in high fps
            scope.$applyAsync(function () {
              scope.cooldown.boxShadow =
                "inset " + sizeValue + colorValue + ")";
            });

            if (scope.cooldown.delayTime >= scope.cooldown.maxTime / 120) {
              clearInterval(readyLoop);
            }

            scope.cooldown.currentTime++;
          }, 16.666); //makes loop run at 60fps
        });
      },
    };
  },
]);
