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
    this.list.forEach(item => {
      const action = globalThis.class.actionMap.get(item[0]);
      const actionCard = new ActionCard(action);
      _box.appendChild(actionCard);
    });

    const _swiper = this.querySelector('.actionSwiper');
    const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
    new Swiper(_swiper, swiper_option);
  }

  #sortData()
  {
    const mapToArray = [...globalThis.class.actionMap];
    return mapToArray.sort((a, b) => new Date(a[1].alertDate) - new Date(b[1].alertDate));
  }

  addActionCard(data)
  {
    data.type = "user";
    data.alertDate = util.actionDateFormat(new Date());
    const newAction  = new Action(data);
    globalThis.class.actionMap.set(data.id, newAction);
    this.showAction();
  }

  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <section>
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

