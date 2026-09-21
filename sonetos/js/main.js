import { SonnetModel, loadSonnets } from '../data/main.js';
import { loadHeader } from './header.js';

// VISTA: actualización del DOM.
// La vista es la única capa que conoce el DOM. CSS responde a aria-current y disabled.
class SonnetView {
  constructor(root=document) { this.root=root; this.list=root.querySelector('[data-poem-list]'); this.article=root.querySelector('#poem'); }
  buildCollection(items) {
    this.list.replaceChildren(...items.map((item,index)=>{
      const li=document.createElement('li'), button=document.createElement('button');
      button.type='button'; button.className='poem-choice'; button.dataset.id=item.id;
      const number=document.createElement('span'); number.className='choice-number'; number.textContent=String(index+1).padStart(2,'0'); number.setAttribute('aria-hidden','true');
      const text=document.createElement('span');
      for(const [className,value] of [['choice-title',item.title],['choice-author',item.author]]) {const span=document.createElement('span');span.className=className;span.textContent=value;text.append(span);}
      button.append(number,text);li.append(button);return li;
    }));
  }
  bind({select,previous,next}) {
    this.list.addEventListener('click',event=>{const button=event.target.closest('button[data-id]');if(button)select(button.dataset.id);});
    this.root.querySelector('[data-previous]').addEventListener('click',previous);
    this.root.querySelector('[data-next]').addEventListener('click',next);
  }
  render(item,index,total,{focus=false}={}) {
    this.root.querySelector('#poem-title').textContent=item.title;
    this.root.querySelector('[data-author]').textContent=item.author;
    this.root.querySelector('[data-poem-label]').textContent=item.label;
    this.root.querySelector('[data-position]').textContent=`${String(index+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
    this.root.querySelector('[data-stanzas]').replaceChildren(...item.stanzas.map(lines=>{
      const p=document.createElement('p');p.className='stanza';
      lines.forEach((line,i)=>{const span=document.createElement('span');span.className='verse';span.textContent=line;p.append(span);if(i<lines.length-1)p.append(document.createTextNode('\n'));});return p;
    }));
    this.root.querySelector('[data-source]').href=item.source;
    this.list.querySelectorAll('button').forEach(button=>button.setAttribute('aria-current',String(button.dataset.id===item.id)));
    this.root.querySelector('[data-previous]').disabled=index===0;
    this.root.querySelector('[data-next]').disabled=index===total-1;
    document.title=`${item.title} · Sonetos`;
    if(focus){this.article.focus({preventScroll:true});this.article.scrollIntoView({block:'start',behavior:'instant'});this.root.querySelector('[data-status]').textContent=`Soneto ${index+1} de ${total}: ${item.title}, de ${item.author}.`;}
  }
}

// CONTROLADOR: eventos y selección.
class SonnetController {
  constructor(model,view) { this.model=model;this.view=view; }
  start() {
    this.view.buildCollection(this.model.items);
    this.view.bind({select:id=>{if(this.model.select(id))this.update(true);},previous:()=>this.move(-1),next:()=>this.move(1)});
    this.update(false);
  }
  move(delta){if(this.model.move(delta))this.update(true);}
  update(focus){this.view.render(this.model.current,this.model.index,this.model.items.length,{focus});}
}

// Inicialización: el módulo se ejecuta después de analizar el HTML.
void loadHeader();
const loading = document.querySelector('[data-loading]');
try {
  const items = await loadSonnets();
  new SonnetController(new SonnetModel(items), new SonnetView()).start();
  document.querySelector('.reading-pane').hidden = false;
  loading.hidden = true;
} catch (error) {
  loading.setAttribute('role', 'alert');
  loading.textContent = `${error.message} Ejecuta el servidor desde ipo2627_bolivia_sonetos y abre /sonetos/.`;
}
