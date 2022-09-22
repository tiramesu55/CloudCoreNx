import { createContext, useEffect, useState } from "react";
import { IConfig } from "./interfaces";
import service from "./getGonfig";


const ConfigCtx = createContext<IConfig | null>(null);

// Provider in your app

const ConfigContext = ({ children } : any ) => {
  const [config, setConfig] = useState<IConfig | null>(null);

  useEffect(() => {
    const getConfigData = async () => {
        try {
            const configData = await service.GetConfig();
            setConfig(configData)
        } catch(err){
            console.log(err)
        }
    } 
    getConfigData();
  }, [])

  return <ConfigCtx.Provider value={config}>{children}</ConfigCtx.Provider>
};
export {
    ConfigContext,  //context creator vunction
    ConfigCtx
}
