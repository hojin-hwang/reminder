class RecommandPanel extends HTMLElement
{
  constructor(data = null)
  {
    super();
    this.addEventListener('click', this.handleClick);
    if(data) this.data = data;
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
      if(node.className.match(/command-add-recommand-action/))
      {
        const makeCard = new MakeCard(this.data);
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
        recommand-panel{position:fixed; top:0; left:0; right:0; height:100vh;z-index:200; background-color:white;overflow: scroll;}
        recommand-panel .command-close-window{position: fixed;top: 12px;right: 12px;z-index:1024;}
        recommand-panel .command-add-recommand-action{position: fixed; bottom: 0px;right: 0px;left:0px; z-index:1024;border-radius: unset;}
        .recommand-panel{display: flex;flex-direction: column;padding-bottom: 48px;}
      </style>
      <button class="btn-close command-close-window right-close" type="button">
        <span class="" aria-hidden="true"></span>
      </button>
      <section class="recommand-panel">
        <article class="card">
          <img class="card-img-top" src="https://picsum.photos/240/160" alt="action Character">
          <div class="card-header">
            <h5 class="card-title mb-0">10K 달리기</h5>
            <div>
              <span class="badge bg-info">스포츠</span>
              <span class="badge bg-success">10K 달리기</span>
              <span> 12,034명이 참여</span>
            </div>

            <div>다음은 <strong class="alert-date">2024-01-20 20:04</strong>이며<br> 간격은<strong>매일</strong> 입니다.</div>
          </div>

          
        </article>

        <div style="padding: 12px;display: flex;flex-direction: column;gap: 12px;">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">달리기 도움이 되는 영상</h5>
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
              <h5 class="card-title mb-0">달리기에 도움이 되는 블로그</h5>
            </div>
            <div class="card-body">
              <p class="card-text">달리기는 어떻게 하는지 보여주는 네이버 블로그</p>
              <a href="#" class="card-link">Card link</a>
            </div>
          </div>

          <div class="card">
            <img class="card-img-top" src="/images/unsplash-3.jpg" alt="Unsplash">
            <div class="card-header">
              <h5 class="card-title mb-0">달리기에 도움이 되는 운동화</h5>
            </div>
            <div class="card-body">
              <p class="card-text">당신의 달리기에 최적의 운동화를 소개합니다.</p>
              <a href="#" class="card-link">Shop link</a>
            </div>
          </div>
        </div>

        <button type="button" class="btn btn-primary command-add-recommand-action">추가후 수정하기</button>
      </section>
      `;  
      return tempalate;
  }
}
customElements.define("recommand-panel", RecommandPanel);

