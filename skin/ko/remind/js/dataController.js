//서비스에 사용하는 데이터를 획득하거나 세팅합니다.
//데이터가 변경되면 postMessage를 통해 storeController 과 Module, component에 전달합니다.

class DataController{
    constructor()
    {
        console.log("called DataController!!");
        this.getSetupData();
    }

    getSetupData()
    {
       globalThis.config.groundMap = new GroupMap();
       globalThis.config.itemMap = new ItemMap();
       globalThis.config.avatarMap = new AvatarMap();
       const recommandBox = document.querySelector('recommand-box')
       const result = util.promiseAjax('GET','/skin/ko/remind/js/data/setup-data.json'); 
       result.then(data=>{
        globalThis.config.groundMap.setList(data.grounds);
        globalThis.config.itemMap.setList(data.items);
        globalThis.config.avatarMap.setList(data.avatars);
        recommandBox.showRecommandAction(data.recommands);
        setTimeout(() => {
            this.getActionList();
            this.getCheckedList();
        }, 20);
       })
    }

    getActionList()
    {
       globalThis.class.actionMap = new Map();

       const localData = localStorage.getItem('actionList');
       const _list = (localData)? JSON.parse(localData) : [];

       _list.forEach(item => {
          globalThis.class.actionMap.set(item.id, new Action(item));
       });

       const actionBox = document.querySelector('action-box');
       actionBox.showActionList(_list);
       
       return;
     }

    addAction(data)
    {
        const newAction  = new Action(data);
        globalThis.class.actionMap.set(data.id, newAction);
        this.#saveActionList();
    }

    #saveActionList()
    {
        const _list = [];
        globalThis.class.actionMap.forEach(value => _list.push(value.data));
        this.#setLocalStorageSet('actionList', JSON.stringify(_list))
    }

    #setLocalStorageSet(key, value)
    {
        localStorage.setItem(key, value);
    }

    getCheckedList()
    {
        globalThis.data.checkedMap = new Map();
    }

    getAvatarList()
    {

    }

    getUserInfo()
    {
       //DB에서 user data를 가져온다.
    }

    setUserInfo()
    {

    }

    setAvatarInfo()
    {
        
    }



}