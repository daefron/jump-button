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
          boxShadow: "inset 5000px 0px rgba(0, 180, 0, 0.2)",
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
          //changes box-shadow to create the "charging" animation
          scope.cooldown.boxShadow = "inset 0px 0px rgba(0, 0, 0, 0.2);";
          
          // loop for jump cooldown
          scope.cooldown.currentTime = 0;
          const readyLoop = setInterval(() => {
            scope.$applyAsync(function () { // allows ui to run at high fps
              if (scope.cooldown.currentTime >= scope.cooldown.maxTime) {
                scope.cooldown.waiting = false;
                clearInterval(readyLoop);
              }
              scope.cooldown.currentTime++;

              // values for box-shadow animation
              const percentage =
                scope.cooldown.currentTime / scope.cooldown.maxTime;
              const boxShadowValue = percentage * windowWidth;
              const boxShadowColor =
                (1 - percentage) * 180 + ", " + percentage * 180;
              scope.cooldown.boxShadow =
                "inset " +
                boxShadowValue +
                "px 0px rgba(" +
                boxShadowColor +
                ", 0, 0.2)";
            });
          }, 16.666); //makes loop run in 60fps

          bngApi.activeObjectLua("obj:setGravity(" + scope.jumpStrength + ")");
          setTimeout(() => {
            bngApi.activeObjectLua("obj:setGravity(-9.81)"); //default gravity
            //TODO: use saved previous gravity if not on standard
          }, 50);
        }
      },
    };
  },
]);
