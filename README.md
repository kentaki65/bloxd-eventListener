# bloxd-eventListener
This code allows you to register events for players and mobs.

### \<Usage>
```js
const player = new PlayerListener(playerId);

player.addEventListener(“jump", (e) => {
  api.log(`${e.playerId} jumped`);
});
```
### \<Options>
- `once`: Set to `true` to trigger the event only once (Boolean)
- `priority`: The higher the number, the sooner it executes (Number)

```js
// Trigger once
player.addEventListener("jump", handler, { once: true });

// With priority (executes before other listeners)
player.addEventListener(“damage", handler, { priority: 10 });
```
## \<Removing Listeners>
```js
// You must store the arrow function in a variable
player.removeEventListener(“damage", handler);
```
