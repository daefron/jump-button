local M = {}

local player

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
    local playerPosition = vec3(player:getPosition())
    jumpDust:setPosition(playerPosition)
end

local function removeDust()
    jumpDust.active = false
end

local jumpSound

local function createSound()
    jumpSound = createObject("SFXEmitter")
    jumpSound.fileName = String('/art/sound/tire_burst.ogg') -- desired sound effect
    jumpSound.isLooping = false
    jumpSound:registerObject('jumpSound' .. math.random())

    -- set position of sound under player car
    local playerPosition = vec3(player:getPosition())
    jumpSound:setPosition(playerPosition)
end

local currentSettings = {
    strength = 100,
    delay = 60
}

local function storeSettings(updatedStrength, updatedDelay)
    currentSettings.strength = updatedStrength
    currentSettings.delay = updatedDelay
end

local function sendSettings()
    guihooks.trigger('RetrieveJumpSettings', currentSettings)
end

local resetTimer = 0
local resetTimerActive

local delayTimer = 0
local delayTimerActive

local function onUpdate(dt)
    -- timer for resetting effects after jump
    if (resetTimerActive) then
        resetTimer = resetTimer + dt
        if (resetTimer >= 0.1) then
            removeDust()
            resetTimer = 0
            resetTimerActive = false
        end
    end
    -- timer for stopping player from jumping while delay active
    if (delayTimerActive) then
        delayTimer = delayTimer + dt
        guihooks.trigger('RetrieveJumpTime', delayTimer)
        if (delayTimer >= currentSettings.delay / 60) then
            delayTimer = 0
            delayTimerActive = false
        end
    end
end

local function activateJump()
    if (delayTimerActive) then
        return
    end

    resetTimerActive = true
    delayTimerActive = true

    player = be:getPlayerVehicle(0)
    local rot = quatFromDir(-vec3(player:getDirectionVector()), vec3(player:getDirectionVectorUp()))
    local force = vec3(0, 0, currentSettings.strength / 15):rotated(rot)
    player:applyClusterVelocityScaleAdd(player:getRefNodeId(), 1, force.x, force.y, force.z)

    createDust()
    createSound()
end

M.onExtensionLoaded = extensionLoaded
M.onExtensionUnloaded = extensionUnloaded

M.storeSettings = storeSettings
M.sendSettings = sendSettings

M.activateJump = activateJump

M.onUpdate = onUpdate

return M
