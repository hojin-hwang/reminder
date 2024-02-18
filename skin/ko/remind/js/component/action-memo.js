class ActionMemo extends AbstractComponent
{
  constructor(data = null)
  {
    super();
    if(data) this.data;
    this.addEventListener('click', this.handleClick);
 }

  static get observedAttributes(){return [];}

  handleClick(e) {
    e.composedPath().find((node)=>{
      if(node.nodeName === 'A') 
      {
        globalThis.open(node.href, "_blank");
        return;
      }
      if(node.nodeName === 'svg' || node.nodeName === 'path') return false;
      if(typeof(node.className) === 'object' || !node.className || !node.className?.match(/command/)) return false;
      if(node.className.match(/command-add-memo/))
      {
        this.#appendMessage();
        
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
            case "CHECK_ALERT_DATE":
              //this.#checkAlertDate();
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
    return;
  }

  #appendMessage()
  {
    const message = this.querySelector('input[name=my_message]').value;
    this.querySelector('input[name=my_message]').value = "";
    const messageBox = document.createElement('div');
    messageBox.classList.add("chat-message-right", "pb-4")
    messageBox.innerHTML = `<div>
                              <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                              <div class="text-muted small text-nowrap mt-2">${util.formatDateTime(new Date())}</div>
                            </div>
                            <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                              ${message} <br> ${util.formatDateDay(new Date())}
                            </div>`
    this.querySelector('.chat-messages').prepend(messageBox);               
  }

  #getTemplate()
  {
      const tempalate = document.createElement('template');
      tempalate.innerHTML = `
      <style>
        .chat-messages{
          height: 200px;
          overflow-y: scroll;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .chat-message-right {
            flex-direction: row-reverse;
            margin-left: auto;
        }

        .chat-message-left, .chat-message-right {
            display: flex;
            flex-shrink: 0;
        }
      </style>
      <div class="col-12 mt-4">
        <div class="px-4"><label>메모</label></div>
        <div class="position-relative">
          <div class="chat-messages p-4">
            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:33 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:34 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.
              </div>
            </div>

            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:35 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Cum ea graeci tractatos.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:36 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultricies placerat imperdiet. Morbi varius
                quam ac venenatis tempus.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:37 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Cras pulvinar, sapien id vehicula aliquet, diam velit elementum orci.
              </div>
            </div>

            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:38 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:39 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.
              </div>
            </div>

            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:40 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Cum ea graeci tractatos.
              </div>
            </div>

            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:41 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Morbi finibus, lorem id placerat ullamcorper, nunc enim ultrices massa, id dignissim metus urna eget purus.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:42 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultricies placerat imperdiet. Morbi varius
                quam ac venenatis tempus.
              </div>
            </div>

            <div class="chat-message-right pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar.jpg" class="rounded-circle me-1" alt="Chris Wood" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:43 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 me-3">
                Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.
              </div>
            </div>

            <div class="chat-message-left pb-4">
              <div>
                <img src="/skin/ko/remind/images/avatars/avatar-3.jpg" class="rounded-circle me-1" alt="Bertha Martin" width="40" height="40">
                <div class="text-muted small text-nowrap mt-2">2:44 am</div>
              </div>
              <div class="flex-shrink-1 bg-light rounded py-2 px-3 ms-3">
                <div class="fw-bold mb-1">Bertha Martin</div>
                Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.
              </div>
            </div>

          </div>
        </div>

        <div class="flex-grow-0 py-3 px-2 border-top">
          <div class="input-group">
            <input type="text" name="my_message" class="form-control" placeholder="Type your message">
            <button type="button" class="btn btn-primary command-add-memo">Send</button>
          </div>
        </div>

      </div>
      `;  
      return tempalate;
  }
}
customElements.define("action-memo", ActionMemo);

