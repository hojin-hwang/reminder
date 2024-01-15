class CheckBox extends HTMLElement
{
  constructor()
  {
    super();
    window.addEventListener("message", this.onMessage.bind(this), false);
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
    //if(this.list.length === 0) console.log("make new action")
    //else this.showAction();

    
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
              this.#appendCheckCard(event.data.data);
            break;
        }
    }
  }

  #appendCheckCard(data)
  {
    if(this.#isNotChecked(data.action.id, data.alertTime))
    {
      //make check-data
      const checkData = {"actionId":data.action.id,"alertDate":data.alertTime}
      const checkCard =  new CheckCard(checkData);
      checkCard.classList.add('swiper-slide');
      
      //기존에 카드가 있는지 확인
      const oldCheckCard = this.#hasCheckCard(data.action.id);
      if(oldCheckCard) oldCheckCard.remove();
      
      //append check card 
      this.querySelector('.swiper-wrapper').appendChild(checkCard)
      console.log(data.action.id)

      const _swiper = this.querySelector('.checkSwiper');
      const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
      new Swiper(_swiper, swiper_option);

    }
  }

  #isNotChecked(actionId, lastAlertDate)
  {
    if(!globalThis.data.checkedList) return true;
    const checkedAction = globalThis.data.checkedList.find(element => element.actionId === actionId && element.alertDate === lastAlertDate);
    return (checkedAction)? false:true;
  }
  
  #hasCheckCard(actionId)
  {
    const _list = this.querySelectorAll('check-card');
    if(_list.length > 0)
    {
      let oldCheckCard = null;
      _list.forEach(element => {
        if(element.getActionId() === actionId) oldCheckCard = element;
      });
      return oldCheckCard;
    }
    else return null;
  }


  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <section class="check-box">
          <label>Check</label>
          <div class="wrapper">
            <div class="swiper checkSwiper">
              <div class="swiper-wrapper">
              </div>
            </div>
          </div>
      </section>    
      `;  
      return tempalate;
  }
}
customElements.define("check-box", CheckBox);

