import { createContext, useEffect, useState } from "react";
import { IConfig } from "./models/config";
import service from "./services/service";


const ConfigCtx = createContext<IConfig | null>(null);

// Provider in your app

const ConfigContext = ({ children } : any ) => {
  const [config, setConfig] = useState<IConfig | null>(null);

  useEffect(() => {
    const getData = async () => {
        try {
            const configData = await service.GetConfig();
            setConfig(configData)
        } catch(err){
            console.log(err)
        }
    } 
    getData();
  }, [])

  return <ConfigCtx.Provider value={config}>{children}</ConfigCtx.Provider>
};
export {
    ConfigContext,
    ConfigCtx
}
