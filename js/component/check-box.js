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
            case "CHECKED_ALERT":
              this.#showLabel();
              this.querySelectorAll('check-card').forEach((item)=>{
                if(item.getActionId() === event.data.data) item.remove();
              });
            break;
        }
    }
  }

  #appendCheckCard(data)
  {
    if(this.#isNotChecked(data.action.data.id, data.alertTime))
    {
      //make check-data
      const checkData = {"actionId":data.action.data.id,"alertDate":data.alertTime}
      const checkCard =  new CheckCard(checkData);
      checkCard.classList.add('swiper-slide');
      
      //기존에 카드가 있는지 확인
      const oldCheckCard = this.#hasCheckCard(data.action.data.id);
      if(oldCheckCard) oldCheckCard.remove();
      
      this.#showLabel(true);
      
      //append check card 
      this.querySelector('.swiper-wrapper').appendChild(checkCard)

      const _swiper = this.querySelector('.checkSwiper');
      const swiper_option = {sliderPerView:'auto', spaceBetween:12,}
      this.swiper = new Swiper(_swiper, swiper_option);
    }
  }

  #isNotChecked(actionId, lastAlertDate)
  {
    if(!globalThis.data.checkedMap.size === 0) return true;
    const checkedAction = globalThis.data.checkedMap.get(actionId);
    if(!checkedAction) return true;
    if(checkedAction.alertDate !== lastAlertDate) return true;
    else return false;
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

