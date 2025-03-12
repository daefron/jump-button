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

local jumpSound

local function createSound()
    jumpSound = createObject("SFXEmitter")
    jumpSound.fileName = String('/art/sound/tire_burst.ogg') -- desired sound effect
    jumpSound.isLooping = false
    jumpSound:registerObject('jumpSound' .. math.random())

    -- set position of sound under player car
    local playerPosition = be:getPlayerVehicle(0):getPosition()
    jumpSound:setPosition(vec3(playerPosition.x, playerPosition.y, playerPosition.z))
end

local currentSettings = {
    strength = 100,
    delay = 60
}

local function storeSettings(updatedStrength, updatedDelay)
    currentSettings = {
        strength = updatedStrength,
        delay = updatedDelay
    }
end

local function sendSettings()
    guihooks.trigger('RetrieveSettings', currentSettings)
end

M.onExtensionLoaded = extensionLoaded
M.onExtensionUnloaded = extensionUnloaded

M.createDust = createDust
M.removeDust = removeDust

M.createSound = createSound

M.storeSettings = storeSettings
M.sendSettings = sendSettings

return M
