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
          maxTime: 1000,
          waiting: false,
          jumpReady: "Ready",
          color: { color: "rgb(0,255,0)" },
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

          setTimeout(() => {
            scope.cooldown.waiting = false;
            scope.cooldown.jumpReady = "Ready";
            scope.cooldown.color = { color: "rgb(0,255,0)" };
          }, scope.cooldown.maxTime);

          bngApi.activeObjectLua("obj:setGravity(" + scope.jumpStrength + ")");
          setTimeout(() => {
            bngApi.activeObjectLua("obj:setGravity(-9.81)");
          }, 50);
        }
      },
    };
  },
]);
