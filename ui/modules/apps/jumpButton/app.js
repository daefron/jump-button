angular.module("beamng.apps").directive("jumpButton", [
  function () {
    return {
      templateUrl: "/ui/modules/apps/jumpButton/app.html",
      replace: true,
      scope: true,
      restrict: "EA",
      link: function (scope, element, attrs) {
        scope.jumpStrength = 100;
        scope.cooldown = {
          maxTime: 100,
          jumpReady: "Ready",
          color: { color: "rgb(0,255,0)" },
          boxShadow:
            "inset 5000px 0px rgba(0, 255, 0, 0.2)",
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
          scope.cooldown.jumpReady = "Not Ready";
          scope.cooldown.color = { color: "rgb(255,0,0)" };

          const windowWidth = document.getElementById("jumpButton").offsetWidth;
          scope.cooldown.boxShadow = "inset 0px 0px rgba(50, 50, 50, 0.2);";
          scope.cooldown.currentTime = 0;
          const readyLoop = setInterval(() => {
            scope.$applyAsync(function () {
              if (scope.cooldown.currentTime >= scope.cooldown.maxTime) {
                scope.cooldown.waiting = false;
                scope.cooldown.jumpReady = "Ready";
                scope.cooldown.color = { color: "rgb(0,255,0)" };
                clearInterval(readyLoop);
              }
              scope.cooldown.currentTime++;
              const percentage =
                scope.cooldown.currentTime / scope.cooldown.maxTime;
              const boxShadowValue = percentage * windowWidth;
              const boxShadowColor =
                (1 - percentage) * 255 + ", " + percentage * 255;
              scope.cooldown.boxShadow =
                "inset " +
                boxShadowValue +
                "px 0px rgba(" +
                boxShadowColor +
                ", 50, 0.2)";
            });
          }, 10);

          bngApi.activeObjectLua("obj:setGravity(" + scope.jumpStrength + ")");
          setTimeout(() => {
            bngApi.activeObjectLua("obj:setGravity(-9.81)");
          }, 50);
        }
      },
    };
  },
]);
