class CheckBox extends AbstractComponent
{
  constructor()
  {
    super();
    window.addEventListener("message", this.onMessage.bind(this), false);
    this.checkSet = new Set();
  }

  static get observedAttributes(){return [];}

  connectedCallback()
  {
    this.render();
    this.#showLabel();
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    return;
  }

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "CHECK_ALERT_DATE":
              this.#showLabel(true);
              if(this.#addCheckSet(event.data.data)) this.#appendCheckCard();
            break;
            case "CHECKED_ALERT":
              this.#showLabel();
              this.#deleteCheckSet(event.data.data);
              this.#appendCheckCard();

            break;
        }
    }
  }

  #addCheckSet(data)
  {
    if(this.#isNotChecked(data.action.data.id, data.alertTime))
    {
      const checkData = {"actionId":data.action.data.id,"alertDate":data.alertTime}

      this.checkSet.forEach(item=>{
        if(item.actionId === checkData.actionId) this.checkSet.delete(item);
      });
      this.checkSet.add(checkData);
      return true;
    }
    else return false;
  }

  #deleteCheckSet(id)
  {
    this.checkSet.forEach(item=>{
      if(item.actionId === id) this.checkSet.delete(item);
    }); 
  }

  #appendCheckCard()
  {
    {
      const _wrapper = this.querySelector('.wrapper');
      _wrapper.innerHTML = '';

      const swiper_div = document.createElement('div');
      swiper_div.classList.add("swiper", "checkSwiper");
      _wrapper.appendChild(swiper_div);

      const swiper_wrapper = document.createElement('div');
      swiper_wrapper.classList.add("swiper-wrapper");

      swiper_div.appendChild(swiper_wrapper);

      this.checkSet.forEach(item=>{
        const checkCard =  new CheckCard(item);
        checkCard.classList.add('swiper-slide');
        swiper_wrapper.appendChild(checkCard);
      });

      this.#makeSwiper();
    }
  }

  #makeSwiper()
  {
    setTimeout(() => {
      const _swiper = this.querySelector('.checkSwiper');
      if(this.swiper) this.swiper.init(_swiper);
      const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
      this.swiper = new Swiper(_swiper, swiper_option);
    }, 30);
  }

  #isNotChecked(actionId, lastAlertDate)
  {
    if(!globalThis.data.checkedMap.size === 0) return true;
    const checkedAction = globalThis.data.checkedMap.get(actionId);
    if(!checkedAction) return true;
    if(checkedAction.alertDate !== lastAlertDate) return true;
    else return false;
  }
  

  #showLabel(flag = false)
  {
    const count = this.querySelectorAll('check-card').length;
    if(count === 0) this.querySelector('label').style.display = 'none';
    if(flag) this.querySelector('label').style.display = 'block';
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <section class="check-box">
          <label>Check</label>
          <div class="wrapper">
          </div>
      </section>    
      `;  
      return tempalate;
  }
}
customElements.define("check-box", CheckBox);

