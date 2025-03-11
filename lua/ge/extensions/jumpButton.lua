local M = {}

local function extensionLoaded()
    log("D", "extensionLoaded", "Called")
end

local function extensionUnloaded()
    log("D", "extensionUnloaded", "Called")
end

local jumpDust

local function createDust()
    jumpDust = createObject("ParticleEmitterNode")
    jumpDust.emitter = scenetree.findObject("BNGP_34") -- desired particle effect
    jumpDust.dataBlock = scenetree.findObject("lightExampleEmitterNodeData1")
    jumpDust.emitter.ejectionPeriodMS = 200 -- stops dust lasting too long
    jumpDust:registerObject('jumpDust' .. math.random())

    -- set position of dust under player car
    local playerPosition = be:getPlayerVehicle(0):getPosition()
    jumpDust:setPosition(vec3(playerPosition.x, playerPosition.y, playerPosition.z))
end

local function removeDust()
    jumpDust.active = false
end

M.onExtensionLoaded = extensionLoaded
M.onExtensionUnloaded = extensionUnloaded

M.createDust = createDust
M.removeDust = removeDust

return M
