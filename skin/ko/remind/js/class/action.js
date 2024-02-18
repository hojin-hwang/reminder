class Action
{
    constructor(data)
    {
        this.data = data;
        this.intervalID = null;
        this.setData("groundTitle", this.#getGroundData().title);
        this.setData("itemTitle", this.#getItemData().title);
        setTimeout(() => {
            this.#checkAlertDate();
        }, 200);

        // const intervalID = setInterval(()=>{
        //     window.postMessage({msg:"UPDATE_ACTION_DATA", data:this.data});
        // }, 1000);
    }

    setData(key, value)
    {
        this.data[key] = value;
        window.postMessage({msg:"UPDATE_ACTION_DATA", data:this.data});
    }
    getData(key)
    {
        return this.data[key];
    }

    updateExp()
    {
        const exp_point = this.#getExpPoint();
        let current_exp = parseInt(this.data["exp"]);
        current_exp = current_exp + exp_point;
        if(current_exp >= 100)
        {
            this.setData("exp", current_exp - 100);
            this.setData("level", parseInt(this.data["level"])+1)
        }
        else
        {
            this.setData("exp", current_exp);
        }
    }

    #getGroundData()
    {
        return globalThis.config.groundMap.getGround(this.data.groundId);
    }

    #getItemData()
    {
        return globalThis.config.itemMap.getItem(this.data.itemId);
    }

    #getExpPoint()
    {
        let point = 0;
        switch(this.data["interval"])
        {
            
            case "day":
                point = 5;
            break; 
            case "week":
                point = 22;
            break; 
            case "one-week":
                point = 33;
            break;   
            default:
                point = 5;
            break;   
        }
        return point;
    }

    #checkAlertDate()
    {
      clearInterval(this.intervalID);
  
      setTimeout(() => {
        if(this.#isPassAlertDate()) 
          {
              this.#changeAlertDate();
          }
      }, 500);
  
      this.intervalID = setInterval(()=>{
          if(this.#isPassAlertDate()) 
          {
              this.#changeAlertDate();
          }
      }, 10000);
    }
    
    #isPassAlertDate()
    {
        const alertDate = new Date(this.getData("alertDate"));
        return (alertDate.getTime() > new Date().getTime())? false : true;
    }

    #changeAlertDate()
    {
        let lastAlertTime = new Date(this.getData("alertDate"));
        let _nextDate = this.#setAlertDateByInterval(this.getData("alertDate"), 120)

        while(_nextDate < new Date().getTime())
        {
            lastAlertTime = new Date(_nextDate); 
            _nextDate = this.#setAlertDateByInterval(_nextDate, 120)      
        }

        const _lastAlertTime = util.actionDateFormat(lastAlertTime);
        const checkMessage = {action:this, alertTime:_lastAlertTime};
        
        window.postMessage({msg:"CHECK_ALERT_DATE", data:checkMessage}, location.origin);
        
        this.setData("alertDate", util.actionDateFormat(new Date(_nextDate)));
        //this.#changeNextAlertDate();
    }

    #setAlertDateByInterval(dateTime, interval)
    {
        //매일, 매주, 매달, 매년 
        const _nextDate = new Date(dateTime).setSeconds( new Date(dateTime).getSeconds() + interval);
        return _nextDate; 
    }
}