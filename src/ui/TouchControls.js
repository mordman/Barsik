export class TouchControls {
  constructor(bus) {
    if (!matchMedia('(pointer:coarse)').matches) return;
    const el = document.createElement('div');
    el.id = 'touch';
    el.innerHTML = `
      <button id="btnSleep">💤</button>
      <button id="btnMeow">Мяу</button>
      <button id="btnAct">E</button>`;
    document.body.appendChild(el);
    el.querySelector('#btnMeow').onclick = () => bus.emit('input:meow');
    el.querySelector('#btnAct').onclick = () => bus.emit('input:interact');
    el.querySelector('#btnSleep').onclick = () => bus.emit('ui:sleep');
  }
}