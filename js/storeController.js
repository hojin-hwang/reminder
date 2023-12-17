// globalThis.store.cardMap = new Map();
// globalThis.store.scheduledList = [];
// globalThis.store.checkingMap  = new Map();

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
            this.#appendCardInfo(event.data.data)
          break;
          case "REQUEST_NEW_SCHEDULED_LIST_DATA":
            this.#appendScheduledList(event.data.data)
          break;
          case "REQUEST_NEW_CHACKING_DATA":
            this.#appendCheckgingData(event.data.data)
          break;
          case "SEND_QUERY_MESSAGE":
          break;            
        }
      }
    }

    #appendCardInfo(info)
    {
      //apend Card Map 
      globalThis.store.cardMap.set(info.id, info);
      //스토리지를 업데이트 하고
      const _cardList = [];
      for (let card of globalThis.store.cardMap.values()) {
        _cardList.push(card);
      }
      util.setLocalStorageForArray("cardList", _cardList);
      //업데이트되었음을 알린다.
      window.postMessage({msg:"DONE_APPEND_CARD_DATA", data:info}, location.origin);
    }

    #appendScheduledList(list)
    {
      //스케줄 리스트를 등록하고
      list.forEach(element => {
        globalThis.store.scheduledList.push(element)
      });
      //스토리지를 업데이트 하고
      util.setLocalStorageForArray("scheduledList", globalThis.store.scheduledList);
      //업데이트되었음을 알린다.
      window.postMessage({msg:"DONE_UPDATE_SCHEDULED_LIST_DATA", data:null}, location.origin);
    }

    #appendCheckgingData(info)
    {
      if(!info) return;
      //체킹 Map Set
      globalThis.store.checkingMap.set(info.cardId, info)
      //스토리지를 업데이트 하고
      const _checkingList = [];
      for (let checingInfo of globalThis.store.checkingMap.values()) {
        _checkingList.push(checingInfo);
      }
      util.setLocalStorageForArray("checkingList", _checkingList);

      //업데이트되었음을 알린다.
      window.postMessage({msg:"DONE_UPDATE_CHECHING_LIST_DATA", data:null}, location.origin);
    }

}