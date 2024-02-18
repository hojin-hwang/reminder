class ActionPanel extends AbstractComponent
{
  constructor(action = null)
  {
    super();
    this.addEventListener('click', this.handleClick);
    if(action) this.action = action;
    this.avatar = globalThis.config.avatarMap.getAvatar(this.action.data.avatar);
    this.classList.add('action-modal');
 }

  static get observedAttributes(){return [];}

  onMessage(event)
  {
    const window_url = window.location.hostname;
    if(event.origin.indexOf(window_url) < 0) return;
    if(event.data.msg)
    {
        switch(event.data.msg)
        {
            case "CHECK_ALERT_DATE":
              //this.#checkAlertDate();
            break;
        }
    }
  }

  handleClick(e) {
    //e.preventDefault();
    e.composedPath().find((node)=>{
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-close-window/))
      {
        this.remove();  
      }
      if(node.className.match(/command-modify-action-card/))
      {
        const makeCard = new MakeCard(this.action);
        document.querySelector('main').appendChild(makeCard);
        this.remove();
      }
    });
  }

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

  
  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <style>
        action-panel{position:fixed; top:0; left:0; right:0; height:100vh;z-index:200; background-color:white;overflow: scroll;}
        action-panel .command-close-window{position: fixed;top: 12px;left: 12px;z-index:1024;}
        .action-panel{display: flex;flex-direction: column;}
      </style>
      <button class="btn-close command-close-window right-close" type="button">
        <span class="" aria-hidden="true"></span>
      </button>
      <section class="action-panel">
        <article class="card">
        <img class="card-img-top" src="/images/avatars/${this.avatar.filePrefix}${this.action.getData("level")}.${this.avatar.fileExtend}" alt="action Character">
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-2 pb-4">
              <p class="mb-2 fw-bold">현재 ${this.action.getData("level")}단계입니다. <span class="float-end">${this.action.getData("exp")}</span></p>
              <div class="progress progress-sm">
                <div class="progress-bar" role="progressbar" aria-valuenow="${this.action.getData("exp")}" aria-valuemin="0" aria-valuemax="100" style="width: ${this.action.getData("exp")}%;">
                </div>
              </div>
            </li>
          </ul>
          <div class="card-header">
            <div class="card-actions float-end">
              <div class="dropdown position-relative">
                <a href="#" data-bs-toggle="dropdown" data-bs-display="static" aria-expanded="true" class="show">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal align-middle"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </a>
                <div class="dropdown-menu dropdown-menu-end" data-bs-popper="static">
                  <a class="dropdown-item command-modify-action-card" href="#">수정</a>
                </div>
              </div>
            </div>
            <h5 class="card-title mb-0">${this.action.getData("title")}</h5>

            <div>
              <span class="badge bg-info">${this.action.getData("groundTitle")}</span>
              <span class="badge bg-success">${this.action.getData("itemTitle")}</span>
              <span> 12,034명이 참여</span>
            </div>

            <div>다음은 <strong class="alert-date">${this.action.getData("alertDate")}</strong>이며<br> 간격은<strong>${this.action.getData("interval")}</strong> 입니다.</div>
          </div>

          
        </article>

        <div style="padding: 12px;display: flex;flex-direction: column;gap: 12px;">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">${this.action.getData("itemTitle")} 도움이 되는 영상</h5>
              <h6 class="card-subtitle text-muted">21:9 aspect ratio</h6>
            </div>
            <div class="card-body pt-0" style="padding:0;">
              <div class="ratio ratio-21x9">
                <iframe src="https://www.youtube.com/embed/hi4pzKvuEQM?autohide=0&amp;showinfo=0&amp;controls=0"></iframe>
              </div>
            </div>
          </div>

          <div class="card">
            <img class="card-img-top" src="/images/unsplash-2.jpg" alt="Unsplash">
            <div class="card-header">
              <h5 class="card-title mb-0">${this.action.getData("itemTitle")} 도움이 되는 블로그</h5>
            </div>
            <div class="card-body">
              <p class="card-text">블로그 제목</p>
              <a href="#" class="card-link">Card link</a>
            </div>
          </div>

          <div class="card">
            <img class="card-img-top" src="/images/unsplash-3.jpg" alt="Unsplash">
            <div class="card-header">
              <h5 class="card-title mb-0">${this.action.getData("itemTitle")} 도움이 되는 상품들</h5>
            </div>
            <div class="card-body">
              <p class="card-text">${this.action.getData("itemTitle")}과 관련된 아이템을 소개합니다.</p>
              <a href="#" class="card-link">Shop link</a>
            </div>
          </div>
        </div>

              
        <action-memo></action-memo>
      </section>
      `;  
      return tempalate;
  }
}
customElements.define("action-panel", ActionPanel);

