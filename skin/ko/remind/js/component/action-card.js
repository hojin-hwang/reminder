class ActionCard extends AbstractComponent
{
  constructor(action = null)
  {
    super();
    this.action = action;
    this.id = this.action.getData("id");
    window.addEventListener("message", this.onMessage.bind(this), false);
    this.addEventListener('click', this.handleClick);

    this.imageSize = util.randomImageSize();
    this.imageCardSize = util.randomImageCardSize();
    this.avatar = globalThis.config.avatarMap.getAvatar(this.action.data.avatar);
  }

  static get observedAttributes(){return [];}

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-show-action-panel/))
      {
        const actionPanel = new ActionPanel(this.action);
        document.querySelector('main').appendChild(actionPanel)
      }
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
            case "CHECKED_ALERT":
              this.innerHTML = '';
              this.render();
            break;
            case "UPDATE_ACTION_DATA":
              if(event.data.data.id === this.id)
              {
                this.innerHTML = '';
                this.render();
               }
            break;
            
        }
    }
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    const template = this.#getTemplate();
    if(template) this.appendChild(template.content.cloneNode(true));
    this.classList.add('swiper-slide');
    return;
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style>
          .nav-icon {
            color: #6c757d;
            display: block;
            font-size: 1.5rem;
            line-height: 1.4;
            padding: 0.1rem 0.8rem;
            transition: background .1s ease-in-out,color .1s ease-in-out;
          }
          .indicator {
            background: #3f80ea;
            border-radius: 50%;
            box-shadow: 0 0.1rem 0.2rem rgba(0,0,0,.05);
            color: #fff;
            display: block;
            font-size: .675rem;
            height: 18px;
            padding: 1px;
            position: absolute;
            right: -8px;
            text-align: center;
            top: 0;
            transition: top .1s ease-out;
            width: 18px;
          }
        </style>
        <article class="card swiper-slide command-show-action-panel" id="${this.action.getData("id")}">
          <img class="card-img-top" src="/skin/ko/remind/images/avatars/${this.avatar.filePrefix}${this.action.getData("level")}.${this.avatar.fileExtend}" alt="action Character">
          <div class="card-header px-2 pt-2">
            <h5 class="card-title mb-0">${this.action.getData("title")}</h5>
            <div>
              <span class="badge bg-info">${this.action.getData("groundTitle")}</span>
              <span class="badge bg-success">${this.action.getData("itemTitle")}</span>
              <span> 12,034명이 참여</span>
            </div>
          </div>
          <div class="card-body px-2 pt-2">
            <div>다음은 <strong class="alert-date">${this.action.getData("alertDate")}</strong>이며 <strong>20시간</strong> 남았습니다.</div>
            
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-2 pb-4">
              <p class="mb-2 fw-bold">현재 ${this.action.getData("level")}단계입니다. <span class="float-end">${this.action.getData("exp")}</span></p>
              <div class="progress progress-sm">
                <div class="progress-bar" role="progressbar" aria-valuenow="${this.action.getData("exp")}" aria-valuemin="0" aria-valuemax="100" style="width: ${this.action.getData("exp")}%;">
                </div>
              </div>
            </li>
          </ul>
        </article>
      `;  
      return tempalate;
  }
}
customElements.define("action-card", ActionCard);

