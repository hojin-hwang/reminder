class VoidCard extends AbstractComponent
{
  constructor(action = null)
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

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
        <style>
          .illustration .card-body{    background-color: wheat;}
        </style>
        <div class="card illustration flex-fill">
            <div class="card-body p-0 d-flex flex-fill">
                <div class="row g-0 w-100">
                    <div class="col-6">
                        <div class="illustration-text p-3 m-1">
                            <h4 class="illustration-text">새로운 액션으로 시작보세요</h4>
                            <p class="mb-0">아래 추천 액션에서 골라보세요</p>
                        </div>
                    </div>
                    <div class="col-6 align-self-end text-end">
                        <img src="/skin/ko/remind/images/customer-support.png" alt="Customer Support" class="img-fluid illustration-img">
                    </div>
                </div>
            </div>
        </div>
      `;  
      return tempalate;
  }
}
customElements.define("void-card", VoidCard);



