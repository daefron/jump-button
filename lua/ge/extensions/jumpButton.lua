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
    local playerPosition = player:getPosition()
    jumpDust:setPosition(vec3(playerPosition.x, playerPosition.y, playerPosition.z))
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
    local playerPosition = player:getPosition()
    jumpSound:setPosition(vec3(playerPosition.x, playerPosition.y, playerPosition.z))
end

local currentSettings = {
    strength = 100,
    delay = 60,
}

local function storeSettings(updatedStrength, updatedDelay)
    currentSettings.strength = updatedStrength
    currentSettings.delay = updatedDelay
end

local function sendSettings()
    guihooks.trigger('RetrieveSettings', currentSettings)
end

local resetTimer = 0
local resetTimerActive

local delayTimer = 0
local delayTimerActive

local function onGuiUpdate()
    -- timer for resetting gravity/effects after jump
    if (resetTimerActive) then
        resetTimer = resetTimer + 1
        if (resetTimer >= 3) then
            removeDust()
            resetTimer = 0
            resetTimerActive = false
        end
    end
    -- timer for stopping player from jumping while delay active
    if (delayTimerActive) then
        delayTimer = delayTimer + 1
        if (delayTimer >= currentSettings.delay / 2) then
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
    player:applyClusterVelocityScaleAdd(player:getRefNodeId(), 1, 0, 0, currentSettings.strength / 20)
    createDust()
    createSound()
    guihooks.trigger('ActivateJump') -- makes UI run animation
end

M.onExtensionLoaded = extensionLoaded
M.onExtensionUnloaded = extensionUnloaded

M.storeSettings = storeSettings
M.sendSettings = sendSettings

M.activateJump = activateJump

M.onGuiUpdate = onGuiUpdate

return M
