// globalThis.store.cardMap = new Map();
// globalThis.store.scheduledList = [];
// globalThis.store.checkingMap  = new Map();

class StoreController{
    constructor()
    {
        window.addEventListener("message", this.onMessage.bind(this), false);
        globalThis.store.cardMap = new Map();
        globalThis.store.scheduledList = [];
        globalThis.store.checkingMap  = new Map();
        
        this.#getCardMapFromStorage();
        if(globalThis.store.cardMap.size === 0)
        {
          util.removeStorageByKey('scheduledList');
          util.removeStorageByKey('checkingList');
        }
        else
        {
          this.#getcheckingMapStorage();
        }
        this.#init();
        
    }

    #init()
    {
      //setting Card Box
      document.querySelector('card-box').appendCardList();
      //체크 스케줄, 세팅 리마인드 박스
      
      const _list = util.getLocalStorageForArray('scheduledList');
      const _newList = [];
      _list.forEach(data=>{
        if( util.isFutureDate(data.scheduledDate))
        {
          _newList.push(data);
        }
      })
      console.log(_list)
      console.log(_newList)
      this.#makeScheduledMetaData(_list)
      //세팅 체킹 박스
    }

    #makeScheduledMetaData(_list)
    {
      //scheduledMetaData = { cardId :{ lastScheduleDate, interval, index,  checktime} }
      const scheduledMetaData = {};       
      _list.forEach(data => {
        scheduledMetaData[data.cardId] = {}
        scheduledMetaData[data.cardId]['interval'] = globalThis.store.cardMap.get(data.cardId).interval;
        scheduledMetaData[data.cardId]['checktime'] = globalThis.store.cardMap.get(data.cardId).checktime;
        scheduledMetaData[data.cardId]['index'] = 0;
        const _lastTime = (scheduledMetaData[data.cardId]['lastScheduleDate'])? scheduledMetaData[data.cardId]['lastScheduleDate'] : 0;
        if(_lastTime < data.scheduledDate) scheduledMetaData[data.cardId]['lastScheduleDate'] = data.scheduledDate; 
      })
      console.log(scheduledMetaData)
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

    #getCardMapFromStorage(){
      const _list = util.getLocalStorageForArray('cardList');
      
      if(!_list || _list.length === 0) return;
      
      _list.forEach(item=>{
        globalThis.store.cardMap.set(item.id, item);
      });
    }

    #getcheckingMapStorage(){
      const _list = util.getLocalStorageForArray('checkingList');
      if(!_list || _list.length === 0) return;
      _list.forEach(item=>{
        globalThis.store.checkingMap.set(item.id, item);
      });
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
      const beforeOrderList = [...globalThis.store.scheduledList];
      list.forEach(element => {
        beforeOrderList.push(element)
      });
      
      const _reOrderByData = beforeOrderList.sort(function(a,b){
        return a.scheduledDate - b.scheduledDate;
     })

     globalThis.store.scheduledList = [..._reOrderByData];
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