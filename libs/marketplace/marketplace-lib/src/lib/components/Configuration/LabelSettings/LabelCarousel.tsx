//import '@splidejs/splide/css';
import { useState } from 'react';
//import { Splide, SplideSlide } from '@splidejs/react-splide';
import LabelImage from "../../../assets/lable_img_01.png"
//import '@splidejs/react-splide/css/core';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { ListItem, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
<link rel="stylesheet" href="path-to-the-file/splide.min.css"></link>


function LabelCarousel() {
  //This will be for if the images are selected ('active) make one for each image
  const [active, setActive] = useState(true)

  return (

    <Box sx={{ flexGrow: 2, }}>
      <Grid container spacing={2}>
        <Grid xs={2}>
          {/* <ListItem sx={{ display: "flex", justifyContent: "center" }}>
            <Splide
              options={{
                rewind: true,
                type: "slide",
                gap: '-4em',
                direction: "ttb",

                heightRatio: 5.5,
                perPage: 4,

                // Custom arrows must be in svg format as below 

                // arrowPath: "M63.328911,112.332520 C86.184731,89.466156 108.812096,66.864952 131.401398,44.225780 C136.826736,38.788479 136.774094,38.725010 142.190811,44.143200 C174.587906,76.549110 206.983231,108.956818 239.372787,141.370255 C240.293106,142.291260 241.450729,143.055222 241.809784,145.086029 C172.090424,145.086029 102.491661,145.086029 32.892899,145.086029 C32.663742,144.715790 32.434586,144.345551 32.205425,143.975296 C42.499115,133.511459 52.792805,123.047607 63.328911,112.332520 z",
                arrows: true,
                pagination: false,
                padding: { top: 55, bottom: 55 },

              }}

            >
              <SplideSlide onClick={() => {
                setActive(true)

              }}>
                {active === true ? <img src={LabelImage} style={{ height: "3em", width: "5em", cursor: "pointer", border: "1.5pt solid #6513F0" }} alt="Image 1" />
                  : <img src={LabelImage} style={{ height: "3em", width: "5em", cursor: "pointer" }} alt="Image 1" />}


                <br />
                <Typography sx={{ fontSize: "8pt", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Vial Label</Typography>
              </SplideSlide>
              <SplideSlide>
                <img src={LabelImage} style={{ height: "3em", width: "5em" }} alt="Image 2" />
                <br />
                <Typography sx={{ fontSize: "8pt", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Package Label</Typography>
              </SplideSlide>
              <SplideSlide>
                <img src={LabelImage} style={{ height: "3em", width: "5em" }} alt="Image 3" />
                <br />
                <Typography sx={{ fontSize: "8pt", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Shipping Manifest</Typography>
              </SplideSlide>
              <SplideSlide>
                <img src={LabelImage} style={{ height: "3em", width: "5em" }} alt="Image 3" />
                <br />
                <Typography sx={{ fontSize: "8pt", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Bag</Typography>
              </SplideSlide>
              <SplideSlide>
                <img src={LabelImage} style={{ height: "3em", width: "5em" }} alt="Image 3" />
                <br />
                <Typography sx={{ fontSize: "8pt", fontWeight: "bold", display: "flex", justifyContent: "center" }}>Package Label</Typography>
              </SplideSlide>
            </Splide>
            </ListItem> */}
        </Grid>
        <Grid xs={10}>
          <ListItem>
            <img src={LabelImage} style={{ border: "2pt solid #6513F0", width: "40em", height: "10em" }} alt="Image 2" /></ListItem>

        </Grid>

      </Grid >
    </Box >




  );
}
export default LabelCarousel;