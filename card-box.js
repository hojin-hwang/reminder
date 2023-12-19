
class CardBox extends HTMLElement
{
  constructor()
  {
      super();
      this.addEventListener('click', this.handleClick);
      window.addEventListener("message", this.onMessage.bind(this), false);
  }

  static get observedAttributes() {return ['type']; }

  handleClick(e) {
      e.composedPath().find((node) => 
      {
          if (!node.className || !node.className.match(/command/)) return false;
      });
  }

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "DONE_APPEND_CARD_DATA":
              const _card = new CardMission(event.data.data);
              this.querySelector('.card-list').appendChild(_card);
            break;
        }
    }
  }

  connectedCallback() {
      this.#render();
  }
      
  disconnectedCallback(){
      console.log("disconnectedCallback");
      window.removeEventListener("message", this.onMessage);
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
      console.log('Media Card element attributes changed.'); 
  }

  #render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true)); 
  }

  appendCardList()
  {
    for (let cardIfo of globalThis.store.cardMap.values()) {
      const _card = new CardMission(cardIfo);
      this.querySelector('.card-list').appendChild(_card);
    }
  }

  #getTemplate()
  {
    const tempalate = document.createElement('template');
    tempalate.innerHTML = `
    <section class="card-box">
      <header></header>
      <div class="card-list">
      
      </div>
    </section>
    `;  
    return tempalate;
  }
}
customElements.define('card-box', CardBox);





 


