import { useState, useEffect, useMemo } from "react";
import moment from 'moment-timezone'
import { useSelector } from "react-redux";

interface MaintenanceDetails {
  maintenanceStartDate: string,
  maintenanceEndDate: string,
  maintenanceReason: string,
  maintenanceDisplayStartDate: string,
  maintenanceDisplayEndDate: string,
  fullLockout: boolean,
}


export const useMaintenance = (appName: string, currentDate: Date) => {
  const [displayMaintenance, setDisplayMaintenance] = useState(false);
  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [disableBackdrop, setDisableBackdrop] = useState(false);

  const appDetails = useSelector((state: any) => state.maintenance.appsMaintenance).
    filter((app: any) => app.name === appName)[0];

  const maintenanceDetails : MaintenanceDetails = {
    maintenanceStartDate: appDetails?.maintenanceStartDate,
    maintenanceEndDate: appDetails?.maintenanceEndDate,
    maintenanceDisplayStartDate: appDetails?.maintenanceDisplayStartDate,
    maintenanceDisplayEndDate: appDetails?.maintenanceDisplayEndDate,
    fullLockout: appDetails?.fullLockout,
    maintenanceReason: appDetails?.maintenanceReason
  }

  const isBypassUser = useSelector((state: any) => state.maintenance.bypassUser);

  const handleDisplayMaintenanceDialog = (value: boolean) => {
    setDisplayMaintenance(value);
    setDisableBackdrop(true)
  };

  // converting EST to local
  const convertEstToLocal = (date: any) => {
    const formattedDate = (date !== null && date !== undefined) ? date.split(/\D/) : [];
    const localDate = new Date(
      Date.UTC(
        formattedDate[0],
        formattedDate[1] - 1,
        formattedDate[2],
        formattedDate[3],
        formattedDate[4],
        formattedDate[5]
      )
    );
    localDate.setUTCMinutes(localDate.getUTCMinutes() - -300);
    return moment(localDate).format('MM/DD/YYYY hh:mm A');
  };
  // converting EST to local

  const modifiedMaintenanceDetails = useMemo(() => {
    return {
      maintenanceStartDate: convertEstToLocal(
        maintenanceDetails.maintenanceStartDate
      ),
      maintenanceEndDate: convertEstToLocal(
        maintenanceDetails.maintenanceEndDate
      ),
      maintenanceReason: maintenanceDetails.maintenanceReason,
      maintenanceDisplayStartDate: convertEstToLocal(
        maintenanceDetails.maintenanceDisplayStartDate
      ),
      maintenanceDisplayEndDate: convertEstToLocal(
        maintenanceDetails.maintenanceDisplayEndDate
      ),
      fullLockout: maintenanceDetails.fullLockout,
    };
  }, [
    maintenanceDetails.fullLockout, maintenanceDetails.maintenanceStartDate,
    maintenanceDetails.maintenanceDisplayStartDate, maintenanceDetails.maintenanceEndDate,
    maintenanceDetails.maintenanceReason
  ]);


  useEffect(() => {

    if (maintenanceDetails.maintenanceDisplayStartDate !== undefined) {
      if (new Date(modifiedMaintenanceDetails.maintenanceDisplayStartDate).getTime() > currentDate.getTime()) {
        setLoadData(true)
      }
    }
  }, [maintenanceDetails.maintenanceDisplayStartDate])

  useEffect(() => {

    const maintenanceDisplayTimeout = setTimeout(
      () => {
        if (maintenanceDetails.maintenanceDisplayStartDate !== undefined && maintenanceDetails.maintenanceDisplayStartDate !== null) {
          setLoadData(true);
          setDisplayMaintenance(true);
        } else if (maintenanceDetails.maintenanceStartDate === null) {
          setLoadData(true);
        }
      }, new Date(modifiedMaintenanceDetails.maintenanceDisplayStartDate).getTime() - currentDate.getTime()
    )

    const underMaintenanceTimeout = setTimeout(
      () => {
        if (maintenanceDetails.maintenanceStartDate !== undefined && maintenanceDetails.maintenanceStartDate !== null) {
          const load = isBypassUser
            ? true
            : (modifiedMaintenanceDetails.fullLockout === undefined || modifiedMaintenanceDetails.fullLockout === true)
              ? false
              : true;
          setDisplayMaintenance(true);
          setUnderMaintenance(true);
          setLoadData(load);
        } else if (maintenanceDetails.maintenanceStartDate === null) {
          setLoadData(true);
        }
      }, new Date(modifiedMaintenanceDetails.maintenanceStartDate).getTime() - currentDate.getTime()
    )

    const endMaintenanceTimeout = setTimeout(
      () => {
        if (modifiedMaintenanceDetails.maintenanceEndDate !== undefined && maintenanceDetails.maintenanceEndDate !== null) {
          setDisplayMaintenance(false);
          setUnderMaintenance(false);
          setLoadData(true);
        } else if (maintenanceDetails.maintenanceEndDate === null) {
          setLoadData(true);
        }
      }, new Date(modifiedMaintenanceDetails.maintenanceEndDate).getTime() - currentDate.getTime()
    )

    return () => {
      clearInterval(maintenanceDisplayTimeout);
      clearInterval(underMaintenanceTimeout);
      clearInterval(endMaintenanceTimeout);
    }
  }, [
    modifiedMaintenanceDetails.maintenanceDisplayStartDate,
    modifiedMaintenanceDetails.maintenanceStartDate,
    modifiedMaintenanceDetails.maintenanceEndDate,
    modifiedMaintenanceDetails.fullLockout,
    modifiedMaintenanceDetails.maintenanceReason,
    isBypassUser
  ])

  return {
    displayMaintenance,
    underMaintenance,
    maintenanceStartDate: modifiedMaintenanceDetails.maintenanceStartDate,
    maintenanceEndDate: modifiedMaintenanceDetails.maintenanceEndDate,
    maintenanceReason: modifiedMaintenanceDetails.maintenanceReason,
    fullLockout: modifiedMaintenanceDetails.fullLockout,
    handleDisplayMaintenanceDialog,
    isBypassUser,
    loadData,
    disableBackdrop
  }
}