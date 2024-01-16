//서비스에 사용하는 데이터를 획득하거나 세팅합니다.
//데이터가 변경되면 postMessage를 통해 storeController 과 Module, component에 전달합니다.

class DataController{
    constructor()
    {
        console.log("called DataController!!");
        this.getGroundList();
        this.getMissionList();
        this.getRecommandList();
        this.getActionList();
        this.getCheckedList();
    }

    getGroundList()
    {
       globalThis.data.groundList = [];
       const result = util.promiseAjax('GET','/js/data/ground-list.json'); 
       result.then(list=>{
        list.forEach(item => {
            globalThis.data.groundList.push(item)
        });
       })
    }

    getMissionList()
    {
       globalThis.data.itemList = [];
       const result = util.promiseAjax('GET','/js/data/item-list.json'); 
       result.then(list=>{
        list.forEach(item => {
            globalThis.data.itemList.push(item)
        });
       });
    }

    getRecommandList()
    {
        const result = util.promiseAjax('GET','/js/data/recommand-list.json'); 
        result.then(list=>{
         list.forEach(item => {
             //globalThis.data.recommandList.push(item)
         });
         const recommandBox = document.querySelector('recommand-box');
         recommandBox.showRecommandAction(list);
        });

    }

    getActionList()
    {
       globalThis.data.actionList = [];
       globalThis.data.actionMap = new Map();
       const result = util.promiseAjax('GET','/js/data/action-list.json'); 
       result.then(list=>{
        list.forEach(item => {
            globalThis.data.actionList.push(item);
            globalThis.data.actionMap.set(item.id, item);
        });
        const actionBox = document.querySelector('action-box');
        actionBox.showAction(list)
       });
    }

    addActionList(item)
    {
        globalThis.data.actionList.push(item);
        const actionBox = document.querySelector('action-box');
        actionBox.showAction();
    }

    getCheckedList()
    {
        globalThis.data.checkedMap = new Map();
        const result = util.promiseAjax('GET','/js/data/checked-list.json'); 
        result.then(list=>
        {
            list.forEach(item => {
                globalThis.data.checkedMap.set(item.actionId, item);
            });
        });
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