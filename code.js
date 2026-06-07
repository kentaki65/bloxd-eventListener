const mobMap = new Map();
const playerMap = new Map();
const exclusion = new Set([

]);

const EVENT_NAMES = Object.freeze({
  ATTACK: "attack",
  DAMAGE: "damage",
  KILL: "kill",
  DEATH: "death",

  ATTEMPT_KILL: "attemptKill",
  ATTEMPT_DEATH: "attemptDeath",
  ATTEMPT_DESPAWN: "attemptDespawn",

  CHAT: "chat",
  DROP: "drop",
  PICKUP: "pickup",
  CRAFT: "craft",
  CLICK: "click",
  CLICK_UP: "clickUp",

  LEAVE: "leave",
  JUMP: "jump",
  RESPAWN: "respawn",

  COMMAND: "command",
  EFFECT: "effect",
  BLOCK_CHANGE: "blockChange",
  OPEN_CHEST: "openChest",
  SPAWN_MOB: "spawnMob",
  SELECT_SLOT: "selectSlot",
  INVENTORY_UPDATE: "inventoryUpdate",
  CHARGE_START: "chargeStart",
  CHARGE_END: "chargeEnd",
  USED_THROWABLE: "usedThrowable",
  THROWABLE_TERRAIN_HIT: "throwableTerrainHit",
  FINISH_QTE: "finishQTE",
});

const playerEventHandlers = [
  {
    handler: 'onPlayerLeave',
    event: 'leave',
    args: ['playerId'],
    extra: (player) => player?.destroy(),
  },
  {
    handler: 'onPlayerJump',
    event: EVENT_NAMES.JUMP,
    args: ['playerId'],
  },
  {
    handler: 'onRespawnRequest',
    event: EVENT_NAMES.RESPAWN,
    args: ['playerId'],
  },
  {
    handler: 'onPlayerPickedUpItem',
    event: EVENT_NAMES.PICKUP,
    args: ['playerId', 'itemName', 'itemAmount'],
  },
  {
    handler: 'onPlayerSelectInventorySlot',
    event: EVENT_NAMES.SELECT_SLOT,
    args: ['playerId', 'slotIndex'],
  },
  {
    handler: 'onInventoryUpdated',
    event: EVENT_NAMES.INVENTORY_UPDATE,
    args: ['playerId'],
  },
  {
    handler: 'onPlayerClick',
    event: EVENT_NAMES.CLICK,
    args: ['playerId', 'wasAltClick', 'x', 'y', 'z', 'block', 'targetEId'],
  },
  {
    handler: 'onPlayerClickUp',
    event: EVENT_NAMES.CLICK_UP,
    args: ['playerId', 'wasAltClick', 'x', 'y', 'z', 'block', 'targetEId'],
  },
  {
    handler: 'onPlayerPotionEffect',
    event: EVENT_NAMES.EFFECT,
    args: ['initiatorId', 'targetEId', 'effectName'],
  },
  {
    handler: 'onPlayerUsedThrowable',
    event: EVENT_NAMES.USED_THROWABLE,
    args: ['playerId', 'throwableName', 'thrownEntityId'],
  },
  {
    handler: 'onPlayerThrowableHitTerrain',
    event: EVENT_NAMES.THROWABLE_TERRAIN_HIT,
    args: ['playerId', 'throwableName', 'thrownEntityId'],
  },
  {
    handler: 'onPlayerStartChargingItem',
    event: EVENT_NAMES.CHARGE_START,
    args: ['playerId', 'itemName'],
  },
  {
    handler: 'onPlayerFinishChargingItem',
    event: EVENT_NAMES.CHARGE_END,
    args: ['playerId', 'used', 'itemName', 'duration'],
  },
  {
    handler: 'onPlayerFinishQTE',
    event: EVENT_NAMES.FINISH_QTE,
    args: ['playerId', 'qteId', 'result'],
  },
  {
    handler: 'playerCommand',
    event: EVENT_NAMES.COMMAND,
    args: ['playerId', 'cmd'],
    defaults: { trueCommand: true },
    returnIf: (d) => !d.trueCommand && false,
  },
  {
    handler: 'onPlayerChat',
    event: EVENT_NAMES.CHAT,
    args: ['playerId', 'message', 'channelName'],
    defaults: { isBroadcast: true, prefix: null },
    returnIf: (d) => !d.isBroadcast ? false : d.prefix ?? null,
  },
  {
    handler: 'onPlayerAttemptCraft',
    event: EVENT_NAMES.CRAFT,
    args: ['playerId', 'itemName', 'craftingIdx', 'craftTimes'],
    defaults: { preventCraft: false },
    returnIf: (d) => d.preventCraft && 'preventCraft',
  },
  {
    handler: 'onPlayerAttemptOpenChest',
    event: EVENT_NAMES.OPEN_CHEST,
    args: ['playerId', 'x', 'y', 'z', 'isMoonstoneChest', 'isIronChest'],
    defaults: { preventOpen: false },
    returnIf: (d) => d.preventOpen && 'preventOpen',
  },
  {
    handler: 'onPlayerAttemptSpawnMob',
    event: EVENT_NAMES.SPAWN_MOB,
    args: ['playerId', 'mobType', 'x', 'y', 'z'],
    defaults: { preventSpawn: false },
    returnIf: (d) => d.preventSpawn && 'preventSpawn',
  },
  {
    handler: 'onPlayerDropItem',
    event: EVENT_NAMES.DROP,
    args: ['playerId', 'x', 'y', 'z', 'itemName', 'itemAmount', 'fromIdx'],
    defaults: { preventDrop: false, allowButNoDroppedItemCreated: false },
    returnIf: (d) => d.preventDrop ? 'preventDrop' : d.allowButNoDroppedItemCreated && 'allowButNoDroppedItemCreated',
  },
];

const handlers = Object.fromEntries(
  playerEventHandlers.map(({ handler, event, args, defaults, extra, returnIf }) => [
    handler,
    (...rawArgs) => {
      const player = playerMap.get(rawArgs[0]);
      const data = {
        ...Object.fromEntries(args.map((key, i) => [key, rawArgs[i]])),
        ...defaults,
      };
      player?.dispatchEvent(event, data);
      extra?.(player);
      if (returnIf) {
        const result = returnIf(data);
        if (result !== undefined) return result;
      }
    },
  ])
);

const register = {
  onWorldAttemptDespawnMob: (...args) => {
    const [ mobId ] = args;
    const target = mobMap.get(mobId);
    const data = { mobId, preventDespawn: false };

    target?.dispatchEvent("attemptDespawn", data);

    if(data.preventDespawn){
      return "preventDespawn";
    }
  },

  onPlayerDamagingOtherPlayer: (...args) => {
    const [attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId] = args;
    const attacked = playerMap.get(attackingPlayer);
    const damaged = playerMap.get(damagedPlayer);

    const data = { attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId, preventDamage: false, damage: damageDealt};

    attacked?.dispatchEvent(EVENT_NAMES.ATTACK, data);
    damaged?.dispatchEvent(EVENT_NAMES.DAMAGE, data);

    if (data.preventDamage) {
      return "preventDamage";
    }

    if (data.damage !== damageDealt) {
      return data.damage;
    }
  },

  onPlayerDamagingMob: (...args) => {
    const [ playerId, mobId, damageDealt, withItem, damagerDbId ] = args;
    const player = playerMap.get(playerId);
    const mob = mobMap.get(mobId);

    const data = {playerId, mobId, damageDealt, withItem, damagerDbId, preventDamage: false, damage: damageDealt};

    player?.dispatchEvent(EVENT_NAMES.ATTACK, data);
    mob?.dispatchEvent(EVENT_NAMES.DAMAGE, data);

    if (data.preventDamage) {
      return "preventDamage";
    }

    if (data.damage !== damageDealt) {
      return data.damage;
    }
  },

  onAttemptKillPlayer: (...args) => {
    const [killedPlayer, attackingLifeform] = args;
    const player = playerMap.get(killedPlayer);
    let attacker;
    if(playerMap.has(attackingLifeform)){
      attacker = playerMap.get(attackingLifeform);
    }else if(mobMap.has(attackingLifeform)){
      attacker = mobMap.get(attackingLifeform);
    }else{
      return;
    }

    const data = { killedPlayer, attackingLifeform, preventDeath: false };
    player?.dispatchEvent(EVENT_NAMES.ATTEMPT_DEATH, data);
    attacker?.dispatchEvent(EVENT_NAMES.ATTEMPT_KILL, data);

    if (data.preventDeath) {
      return "preventDeath";
    }
  },

  onPlayerKilledOtherPlayer: (...args) => {
    const [attackingPlayer, killedPlayer, damageDealt, withItem] = args;
    const attacked = playerMap.get(attackingPlayer);
    const killed = playerMap.get(killedPlayer);

    const data = { attackingPlayer, killedPlayer, damageDealt, withItem, keepInventory: false};
    attacked?.dispatchEvent(EVENT_NAMES.KILL, data);
    killed?.dispatchEvent(EVENT_NAMES.DEATH, data);
    
    if (data.keepInventory) {
      return "keepInventory";
    }
  },

  onMobKilledPlayer: (...args) => {
    const [attackingMob, killedPlayer, damageDealt, withItem] = args;
    const attacked = mobMap.get(attackingMob);
    const killed = playerMap.get(killedPlayer);

    const data = { attackingMob, killedPlayer, damageDealt, withItem, keepInventory: false};

    attacked?.dispatchEvent(EVENT_NAMES.KILL, data);
    killed?.dispatchEvent(EVENT_NAMES.DEATH, data);
    
    if (data.keepInventory) {
      return "keepInventory";
    }
  },

  onPlayerKilledMob: (...args) => {
    const [playerId, mobId, damageDealt, withItem] = args;
    const attacker = playerMap.get(playerId);
    const killed = mobMap.get(mobId);

    const data = { playerId, mobId, damageDealt, withItem, preventDrop: false};
    attacker?.dispatchEvent(EVENT_NAMES.KILL, data);
    killed?.dispatchEvent(EVENT_NAMES.DEATH, data);
    
    if (data.preventDrop) {
      return "preventDrop";
    }
  },

  onMobKilledOtherMob: (...args) => {
    const [ attackingMob, killedMob, damageDealt, withItem ] = args;
    const attacked = mobMap.get(attackingMob);
    const killed = mobMap.get(killedMob);

    const data = { attackingMob, killedMob, damageDealt, withItem, preventDrop: false};
    attacked?.dispatchEvent(EVENT_NAMES.KILL, data);
    killed?.dispatchEvent(EVENT_NAMES.DEATH, data);
    
    if (data.preventDrop) {
      return "preventDrop";
    } 
  },
  onPlayerChangeBlock: (...args) => {
    const [playerId, x, y, z, fromBlock, toBlock, droppedItem, fromBlockInfo, toBlockInfo] = args;
    const player = playerMap.get(playerId);
    
    const data = { playerId, x, y, z, fromBlock, toBlock, droppedItem, fromBlockInfo, toBlockInfo, preventChange: false, preventDrop: false, droppedItemPosition: null};

    player?.dispatchEvent(EVENT_NAMES.BLOCK_CHANGE, data);

    if(data.preventChange){
      return "preventChange";
    }

    if(data.preventDrop){
      return "preventDrop";
    }

    if(data.droppedItemPosition && Array.isArray(data.droppedItemPosition)){
      return data.droppedItemPosition;
    }
  },
  ...handlers
};

Object.entries(register).forEach(([name, callback]) => {
  if(exclusion.has(name)){
    globalThis[name] = function() {
      return callback(...arguments);
    };
  }
});

class EventTarget {
  constructor() {
    this._listeners = {};
  }

  addEventListener(type, callback, options = {}) {
    (this._listeners[type] ??= []).push({
      callback,
      once: !!options.once,
      priority: options.priority ?? 0
    });

    this._listeners[type].sort(
      (a, b) => b.priority - a.priority
    );
  }

  dispatchEvent(type, e) {
    const list = this._listeners[type];
    if (!list) return;

    for (let i = 0; i < list.length; i++) {
      const listener = list[i];

      listener.callback(e);

      if (listener.once) {
        list.splice(i--, 1);
      }
    }
  }

  removeEventListener(type, callback) {
    const list = this._listeners[type];
    if (!list) return;

    const idx = list.findIndex(v => v.callback === callback);
    if (idx !== -1) {
      list.splice(idx, 1);
    }
  }
}

class MobListener extends EventTarget {
  constructor(id) {
    super();
    this.id = id;
    mobMap.set(this.id, this);
  }

  destroy() {
    mobMap.delete(this.id);
  }
}

class PlayerListener extends EventTarget {
  constructor(id) {
    super();
    this.id = id;
    playerMap.set(this.id, this);
  }

  destroy(){
    playerMap.delete(this.id);
  }
}

onPlayerJoin = playerId => {
  const player = new PlayerListener(playerId);
  player.addEventListener("click", e => {
    api.log("クリック開始!");
    player.addEventListener("clickUp", e => {
      api.log("クリック終了!");
    }, {
      once: true
    })
  })
}
