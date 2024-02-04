class ActionBox extends AbstractComponent
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

  showActionList()
  {
    const _box = this.querySelector('.swiper-wrapper');
    _box.innerHTML = '';
    
    this.list = this.#sortData();
    if(this.list.length === 0)
    {
      this.#showVoidCard();
      return;
    }

    this.list.forEach(item => {
      const action = globalThis.class.actionMap.get(item[0]);
      const actionCard = new ActionCard(action);
      _box.appendChild(actionCard);
    });

    this.#makeSwiper()
  }

  #makeSwiper()
  {
    setTimeout(() => {
      const _swiper = this.querySelector('.actionSwiper');
      if(this.swiper) this.swiper.init(_swiper);
      const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
      this.swiper = new Swiper(_swiper, swiper_option);
    }, 30);
  }

  #showVoidCard()
  {
    this.querySelector('.void-card').appendChild(new VoidCard());
  }

  cleanVoidCard()
  {
    this.querySelector('.void-card').innerHTML = '';
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
    globalThis.data.controll.addAction(data)
    this.showActionList();
    this.cleanVoidCard();
  }

  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <section>
        <label>내 액션</label>
        <div class="void-card"></div>
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

