class ActionBox extends HTMLElement
{
  constructor()
  {
    super();
  }

  static get observedAttributes(){return [];}

  connectedCallback()
  {
    this.render();
    
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    return;
  }

  showAction()
  {
    const _box = this.querySelector('.swiper-wrapper');
    _box.innerHTML = '';
    this.list = this.#sortData();
    
    this.list.forEach(element => {
      const actionCard = new ActionCard(element);
      _box.appendChild(actionCard);
    });

    const _swiper = this.querySelector('.actionSwiper');
    const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
    new Swiper(_swiper, swiper_option);
  }

  #sortData()
  {
    return globalThis.data.actionList;
  }

  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <section class="action-box">
        <label>내 액션</label>
        <div class="wrapper">
          <div class="swiper actionSwiper">
            <div class="swiper-wrapper">
              
            </div>
          </div>
        </div>
      </section>   
      `;  
      return tempalate;
  }
}
customElements.define("action-box", ActionBox);

