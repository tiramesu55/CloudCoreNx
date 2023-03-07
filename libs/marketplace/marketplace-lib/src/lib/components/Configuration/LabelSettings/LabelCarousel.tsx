import { useContext, useMemo, useState } from 'react';
import { Box, CircularProgress, Grid, } from "@mui/material"
import Carosel from '../../Carousel/Carosel';
import data from "./data"
import {
  ConfigCtx,
  IConfig,
  useClaimsAndSignout,
} from '@cloudcore/okta-and-config';
import { getLabelSettings, selectIndex } from 'libs/redux-store/src/lib/marketplace/labelSettings/LabelSettingsSlice'
import {
  marketplaceStore,
} from '@cloudcore/redux-store';
import { useAppSelector, useAppDispatch } from 'libs/redux-store/src/lib/store-marketplace';
export interface ILabelData {
  success: boolean;
  responseMessage: string;
  data: {
    associations: IAssociations[]
  }
}

export interface IAssociations {
  associationId: number;
  associationName: string;
  fileDetails: IFileDetails[]
}

export interface IFileDetails {
  labelType: string;
  fileStream: string;
  mimeType: string;
  fileName: string;
}

const LabelCarousel = () => {

  const [labels, setLabels] = useState<ILabelData>()
  const config: IConfig = useContext(ConfigCtx)!


  const okt = useClaimsAndSignout()

  const params = {
    FacilityId: 100,
    PharmacyId: 100
  }


  const dispath = useAppDispatch()
  const index = useAppSelector((state) => state.label.activeIndex)

  useMemo(() => {
    const token = okt?.token
    dispath(
      getLabelSettings({
        url: config.functionAppBaseUrl,
        token: token,
        params: params
      })
    )
      .unwrap()
      .then(
        (res: any) => {
          console.log(res.data)
          setLabels(res.data);
        }
      )
      .catch((err) => {
        console.log(err);
      });
  }, [])

  //This will be for if the images are selected ('active) make one for each image



  return (
    <>
      {labels?.success &&
        < Grid container spacing={2} sx={{ marginBottom: '50px' }}>
          <Grid item xs={2}>
            <Carosel data={labels!.data.associations[0].fileDetails!} currentContent={index} />
          </Grid>
          <Grid item xs={10}>
            <Box sx={{
              height: "75%",
              width: "75%",
              backgroundImage: `url(data:image/png;base64,${labels!.data.associations[0].fileDetails[index].fileStream!})`,
              backgroundSize: "cover",
              padding: "25px",
              margin: "25px",
              border: "4px solid #6513F0"
            }}></Box>
          </Grid>
        </Grid >
      }
      {!labels?.success &&
        <CircularProgress sx={{ marginLeft: '50%', marginTop: '10%', marginBottom: '10%' }} />
      }
    </>
  );
}
export default LabelCarousel;