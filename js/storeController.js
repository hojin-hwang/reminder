// 로컬스토리지 또는 데이터 베이스에 저장하는 역할을 수행합니다.

class StoreController{
    constructor()
    {
        window.addEventListener("message", this.onMessage.bind(this), false);
    }

    onMessage(event)
    {
      const window_url = window.location.hostname;
      if(event.origin.indexOf(window_url) < 0) return;
      if(event.data.msg)
      {
        switch(event.data.msg)
        {
          case "REQUEST_NEW_CARD_DATA":
          break;
          case "DONE_APPEND_CARD_DATA":
          break;            
        }
      }
    }

    
}