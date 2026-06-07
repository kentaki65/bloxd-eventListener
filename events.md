```JS
/**
 * Frozen object containing all event name constants used with addEventListener.
 *
 * @example
 * player.addEventListener(EVENT_NAMES.JUMP, (e) => { ... });
 */
const EVENT_NAMES = Object.freeze({
  /** Fired on the attacker when they deal damage. */
  ATTACK: "attack",
  /** Fired on the target when they receive damage. */
  DAMAGE: "damage",
  /** Fired on the killer when they get a kill. */
  KILL: "kill",
  /** Fired on the entity when they die. */
  DEATH: "death",

  /** Fired on the potential victim before death is confirmed. Can be cancelled. */
  ATTEMPT_KILL: "attemptKill",
  /** Fired on the attacker before their kill is confirmed. Can be cancelled. */
  ATTEMPT_DEATH: "attemptDeath",
  /** Fired on a mob before it despawns. Can be cancelled. */
  ATTEMPT_DESPAWN: "attemptDespawn",

  /** Fired when the player sends a chat message. */
  CHAT: "chat",
  /** Fired when the player drops an item. */
  DROP: "drop",
  /** Fired when the player picks up an item. */
  PICKUP: "pickup",
  /** Fired when the player attempts to craft an item. */
  CRAFT: "craft",
  /** Fired when the player clicks. */
  CLICK: "click",
  /** Fired when the player releases a click. */
  CLICK_UP: "clickUp",

  /** Fired when the player leaves the world. */
  LEAVE: "leave",
  /** Fired when the player jumps. */
  JUMP: "jump",
  /** Fired when the player requests a respawn. */
  RESPAWN: "respawn",

  /** Fired when the player enters a command. */
  COMMAND: "command",
  /** Fired when the player applies a potion effect. */
  EFFECT: "effect",
  /** Fired when the player changes a block. */
  BLOCK_CHANGE: "blockChange",
  /** Fired when the player attempts to open a chest. */
  OPEN_CHEST: "openChest",
  /** Fired when the player attempts to spawn a mob. */
  SPAWN_MOB: "spawnMob",
  /** Fired when the player selects an inventory slot. */
  SELECT_SLOT: "selectSlot",
  /** Fired when the player's inventory is updated. */
  INVENTORY_UPDATE: "inventoryUpdate",
  /** Fired when the player starts charging an item. */
  CHARGE_START: "chargeStart",
  /** Fired when the player finishes charging an item. */
  CHARGE_END: "chargeEnd",
  /** Fired when the player throws a throwable item. */
  USED_THROWABLE: "usedThrowable",
  /** Fired when a throwable item thrown by the player hits terrain. */
  THROWABLE_TERRAIN_HIT: "throwableTerrainHit",
  /** Fired when the player completes a QTE. */
  FINISH_QTE: "finishQTE",
});
```

```js
/**
 * Adapter layer that converts raw game engine callbacks into an addEventListener-based event system.
 * Use PlayerListener / MobListener instances to subscribe to events via addEventListener.
 *
 * @example
 * const player = new PlayerListener(playerId);
 * player.addEventListener(EVENT_NAMES.JUMP, (e) => {
 *   console.log(e.playerId);
 * });
 */

// ============================================================
// PlayerListener Events
// ============================================================

/**
 * @event PlayerListener#leave
 * @description Fired when the player leaves the world.
 * @type {object}
 * @property {string} playerId
 */

/**
 * @event PlayerListener#jump
 * @description Fired when the player jumps.
 * @type {object}
 * @property {string} playerId
 */

/**
 * @event PlayerListener#respawn
 * @description Fired when the player requests a respawn.
 * @type {object}
 * @property {string} playerId
 */

/**
 * @event PlayerListener#pickup
 * @description Fired when the player picks up an item.
 * @type {object}
 * @property {string} playerId
 * @property {string} itemName
 * @property {number} itemAmount
 */

/**
 * @event PlayerListener#selectSlot
 * @description Fired when the player selects an inventory slot.
 * @type {object}
 * @property {string} playerId
 * @property {number} slotIndex
 */

/**
 * @event PlayerListener#inventoryUpdate
 * @description Fired when the player's inventory is updated.
 * @type {object}
 * @property {string} playerId
 */

/**
 * @event PlayerListener#click
 * @description Fired when the player clicks.
 * @type {object}
 * @property {string}  playerId
 * @property {boolean} wasAltClick   - Whether it was a right-click (alt click).
 * @property {number}  x
 * @property {number}  y
 * @property {number}  z
 * @property {string}  block         - Name of the block that was clicked.
 * @property {string}  targetEId     - ID of the clicked entity, or null if none.
 */

/**
 * @event PlayerListener#clickUp
 * @description Fired when the player releases a click.
 * @type {object}
 * @property {string}  playerId
 * @property {boolean} wasAltClick
 * @property {number}  x
 * @property {number}  y
 * @property {number}  z
 * @property {string}  block
 * @property {string}  targetEId
 */

/**
 * @event PlayerListener#effect
 * @description Fired on the initiator when a potion effect is applied.
 * @type {object}
 * @property {string} initiatorId  - ID of the player who triggered the effect.
 * @property {string} targetEId    - ID of the entity that received the effect.
 * @property {string} effectName
 */

/**
 * @event PlayerListener#usedThrowable
 * @description Fired when the player throws a throwable item.
 * @type {object}
 * @property {string} playerId
 * @property {string} throwableName
 * @property {string} thrownEntityId
 */

/**
 * @event PlayerListener#throwableTerrainHit
 * @description Fired when a throwable thrown by the player hits terrain.
 * @type {object}
 * @property {string} playerId
 * @property {string} throwableName
 * @property {string} thrownEntityId
 */

/**
 * @event PlayerListener#chargeStart
 * @description Fired when the player starts charging an item.
 * @type {object}
 * @property {string} playerId
 * @property {string} itemName
 */

/**
 * @event PlayerListener#chargeEnd
 * @description Fired when the player finishes charging an item.
 * @type {object}
 * @property {string}  playerId
 * @property {boolean} used      - Whether the charge was consumed.
 * @property {string}  itemName
 * @property {number}  duration  - Charge duration in milliseconds.
 */

/**
 * @event PlayerListener#finishQTE
 * @description Fired when the player completes a QTE (Quick Time Event).
 * @type {object}
 * @property {string} playerId
 * @property {string} qteId
 * @property {*}      result    - Result of the QTE.
 */

/**
 * @event PlayerListener#command
 * @description Fired when the player enters a command.
 * Set `e.trueCommand = false` to invalidate the command.
 * @type {object}
 * @property {string}  playerId
 * @property {string}  cmd           - The command string entered by the player.
 * @property {boolean} trueCommand   - Set to false to cancel the command. (default: true)
 */

/**
 * @event PlayerListener#chat
 * @description Fired when the player sends a chat message.
 * Set `e.isBroadcast = false` to suppress the message, or set `e.prefix` to prepend a prefix.
 * @type {object}
 * @property {string}      playerId
 * @property {string}      message
 * @property {string}      channelName
 * @property {boolean}     isBroadcast  - Set to false to cancel the broadcast. (default: true)
 * @property {string|null} prefix       - Prefix to prepend to the message. (default: null)
 */

/**
 * @event PlayerListener#craft
 * @description Fired when the player attempts to craft an item.
 * Set `e.preventCraft = true` to cancel the craft.
 * @type {object}
 * @property {string}  playerId
 * @property {string}  itemName
 * @property {number}  craftingIdx
 * @property {number}  craftTimes
 * @property {boolean} preventCraft  - Set to true to cancel the craft. (default: false)
 */

/**
 * @event PlayerListener#openChest
 * @description Fired when the player attempts to open a chest.
 * Set `e.preventOpen = true` to cancel the opening.
 * @type {object}
 * @property {string}  playerId
 * @property {number}  x
 * @property {number}  y
 * @property {number}  z
 * @property {boolean} isMoonstoneChest
 * @property {boolean} isIronChest
 * @property {boolean} preventOpen      - Set to true to cancel the opening. (default: false)
 */

/**
 * @event PlayerListener#spawnMob
 * @description Fired when the player attempts to spawn a mob.
 * Set `e.preventSpawn = true` to cancel the spawn.
 * @type {object}
 * @property {string}  playerId
 * @property {string}  mobType
 * @property {number}  x
 * @property {number}  y
 * @property {number}  z
 * @property {boolean} preventSpawn  - Set to true to cancel the spawn. (default: false)
 */

/**
 * @event PlayerListener#drop
 * @description Fired when the player drops an item.
 * Set `e.preventDrop = true` to cancel the drop entirely,
 * or set `e.allowButNoDroppedItemCreated = true` to allow the drop but skip creating the item entity.
 * @type {object}
 * @property {string}  playerId
 * @property {number}  x
 * @property {number}  y
 * @property {number}  z
 * @property {string}  itemName
 * @property {number}  itemAmount
 * @property {number}  fromIdx                    - Inventory slot index the item was dropped from.
 * @property {boolean} preventDrop                - Set to true to cancel the drop. (default: false)
 * @property {boolean} allowButNoDroppedItemCreated - Set to true to drop without creating an item entity. (default: false)
 */

/**
 * @event PlayerListener#attack
 * @description Fired on the attacker when they deal damage to another player or mob.
 * Set `e.preventDamage = true` to cancel the damage, or modify `e.damage` to override the damage amount.
 * @type {object}
 * @property {string}  [attackingPlayer]  - ID of the attacking player (PvP only).
 * @property {string}  [playerId]         - ID of the attacking player (Player vs Mob only).
 * @property {string}  [damagedPlayer]    - ID of the damaged player (PvP only).
 * @property {string}  [mobId]            - ID of the damaged mob (Player vs Mob only).
 * @property {number}  damageDealt        - Original damage amount.
 * @property {number}  damage             - Actual damage to apply. Modify this to override. (default: damageDealt)
 * @property {string}  withItem           - Name of the item used.
 * @property {string}  [bodyPartHit]      - Body part hit (PvP only).
 * @property {string}  damagerDbId
 * @property {boolean} preventDamage      - Set to true to cancel the damage. (default: false)
 */

/**
 * @event PlayerListener#damage
 * @description Fired on the target when they receive damage from a player.
 * Set `e.preventDamage = true` to cancel the damage, or modify `e.damage` to override the damage amount.
 * @type {object}
 * @property {string}  [attackingPlayer]  - ID of the attacking player (PvP only).
 * @property {string}  [playerId]         - ID of the attacking player (Player vs Mob only).
 * @property {string}  [damagedPlayer]    - ID of the damaged player (PvP only).
 * @property {string}  [mobId]            - ID of the damaged mob (Player vs Mob only).
 * @property {number}  damageDealt
 * @property {number}  damage
 * @property {string}  withItem
 * @property {string}  [bodyPartHit]
 * @property {string}  damagerDbId
 * @property {boolean} preventDamage      - Set to true to cancel the damage. (default: false)
 */

/**
 * @event PlayerListener#attemptDeath
 * @description Fired on the player before death is confirmed.
 * Set `e.preventDeath = true` to cancel the death.
 * @type {object}
 * @property {string}  killedPlayer       - ID of the player about to die.
 * @property {string}  attackingLifeform  - ID of the attacker (player or mob).
 * @property {boolean} preventDeath       - Set to true to cancel the death. (default: false)
 */

/**
 * @event PlayerListener#kill
 * @description Fired on the killer when they get a kill (PvP, Player vs Mob).
 * Set `e.keepInventory = true` to preserve the victim's inventory (PvP only),
 * or set `e.preventDrop = true` to suppress item drops (Player vs Mob only).
 * @type {object}
 * @property {string}  [attackingPlayer]  - ID of the killer (PvP only).
 * @property {string}  [playerId]         - ID of the killer (Player vs Mob only).
 * @property {string}  [killedPlayer]     - ID of the killed player (PvP only).
 * @property {string}  [mobId]            - ID of the killed mob (Player vs Mob only).
 * @property {number}  damageDealt
 * @property {string}  withItem
 * @property {boolean} [keepInventory]    - Set to true to keep the victim's inventory (PvP only, default: false).
 * @property {boolean} [preventDrop]      - Set to true to suppress item drops (Player vs Mob only, default: false).
 */

/**
 * @event PlayerListener#death
 * @description Fired on the player when they die.
 * Set `e.keepInventory = true` to preserve their inventory.
 * @type {object}
 * @property {string}  [attackingPlayer]  - ID of the killer (PvP only).
 * @property {string}  [attackingMob]     - ID of the killer mob (Mob vs Player only).
 * @property {string}  killedPlayer
 * @property {number}  damageDealt
 * @property {string}  withItem
 * @property {boolean} keepInventory      - Set to true to keep the inventory. (default: false)
 */

/**
 * @event PlayerListener#blockChange
 * @description Fired when the player changes a block.
 * Use `e.preventChange`, `e.preventDrop`, or `e.droppedItemPosition` to control behavior.
 * @type {object}
 * @property {string}        playerId
 * @property {number}        x
 * @property {number}        y
 * @property {number}        z
 * @property {string}        fromBlock             - Block name before the change.
 * @property {string}        toBlock               - Block name after the change.
 * @property {string}        droppedItem           - Name of the item that would be dropped.
 * @property {object}        fromBlockInfo
 * @property {object}        toBlockInfo
 * @property {boolean}       preventChange         - Set to true to cancel the block change. (default: false)
 * @property {boolean}       preventDrop           - Set to true to suppress the item drop. (default: false)
 * @property {number[]|null} droppedItemPosition   - Override drop position as [x, y, z]. (default: null)
 */

// ============================================================
// MobListener Events
// ============================================================

/**
 * @event MobListener#attemptDespawn
 * @description Fired on the mob before it despawns.
 * Set `e.preventDespawn = true` to cancel the despawn.
 * @type {object}
 * @property {string}  mobId
 * @property {boolean} preventDespawn  - Set to true to cancel the despawn. (default: false)
 */

/**
 * @event MobListener#damage
 * @description Fired on the mob when it receives damage.
 * Set `e.preventDamage = true` to cancel the damage, or modify `e.damage` to override the amount.
 * @type {object}
 * @property {string}  [attackingPlayer]  - ID of the attacking player (Player vs Mob only).
 * @property {string}  [attackingMob]     - ID of the attacking mob (Mob vs Mob only).
 * @property {string}  mobId              - ID of the damaged mob.
 * @property {number}  damageDealt
 * @property {number}  damage
 * @property {string}  withItem
 * @property {string}  damagerDbId
 * @property {boolean} preventDamage      - Set to true to cancel the damage. (default: false)
 */

/**
 * @event MobListener#kill
 * @description Fired on the mob when it gets a kill.
 * Set `e.keepInventory = true` to preserve the victim's inventory (Mob vs Player only),
 * or set `e.preventDrop = true` to suppress item drops (Mob vs Mob only).
 * @type {object}
 * @property {string}  attackingMob      - ID of the killer mob.
 * @property {string}  [killedPlayer]    - ID of the killed player (Mob vs Player only).
 * @property {string}  [killedMob]       - ID of the killed mob (Mob vs Mob only).
 * @property {number}  damageDealt
 * @property {string}  withItem
 * @property {boolean} [keepInventory]   - Set to true to keep the victim's inventory (Mob vs Player only, default: false).
 * @property {boolean} [preventDrop]     - Set to true to suppress item drops (Mob vs Mob only, default: false).
 */

/**
 * @event MobListener#death
 * @description Fired on the mob when it dies.
 * Set `e.preventDrop = true` to suppress item drops.
 * @type {object}
 * @property {string}  [playerId]      - ID of the killer player (Player vs Mob only).
 * @property {string}  [attackingMob]  - ID of the killer mob (Mob vs Mob only).
 * @property {string}  mobId           - ID of the dead mob.
 * @property {number}  damageDealt
 * @property {string}  withItem
 * @property {boolean} preventDrop     - Set to true to suppress item drops. (default: false)
 */

/**
 * @event MobListener#attemptKill
 * @description Fired on the attacker (player or mob) before their kill is confirmed.
 * Set `e.preventDeath = true` to cancel the kill.
 * @type {object}
 * @property {string}  killedPlayer       - ID of the player about to die.
 * @property {string}  attackingLifeform  - ID of the attacker.
 * @property {boolean} preventDeath       - Set to true to cancel the kill. (default: false)
 */
 ```
