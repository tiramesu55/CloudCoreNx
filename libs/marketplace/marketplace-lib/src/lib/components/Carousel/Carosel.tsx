import { Box, IconButton, Button, Typography } from "@mui/material"
import { useState } from "react"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IFileDetails } from "../Configuration/LabelSettings/LabelCarousel";
import { changeIndex, LabelSettingsReducer } from "libs/redux-store/src/lib/marketplace/labelSettings/LabelSettingsSlice";
import {
    marketplaceStore,
} from '@cloudcore/redux-store';
export interface ICarosel {
    data: IFileDetails[];
    currentContent: number;
}

//IMPORTANT NOTE: This component is based off this article: https://letsbuildui.dev/articles/building-a-vertical-carousel-component-in-react

const Carosel = (props: ICarosel) => {
    const { data, currentContent } = props
    const { useAppDispatch, useAppSelector } = marketplaceStore;
    const dispatch = useAppDispatch()
    const halfwayIndex = Math.ceil(data.length / 2)
    const itemHeight = 104
    const shuffleThreshold = halfwayIndex * itemHeight
    const visibleStyleThreshold = shuffleThreshold / 2

    const handleClick = (direction: string) => {
        if (direction === "prev") {
            dispatch(changeIndex(currentContent - 1 < 0 ? data.length - 1 : currentContent - 1))
            //currentContent - 1 < 0 ? data.length - 1 : currentContent - 1
        }
        else {
            dispatch(changeIndex(currentContent + 1 > data.length - 1 ? 0 : currentContent + 1))
        }

    }

    const determinePlacement = (itemIndex: number) => {
        // Position item in the center of list
        if (currentContent === itemIndex) return 0;

        // Targeting items in the second part of the list
        if (itemIndex >= halfwayIndex) {
            // If moving backwards from index 0 to the last item, move the value downwards
            if (currentContent > (itemIndex - halfwayIndex)) {
                return (itemIndex - currentContent) * itemHeight;
            } else {
                // Negative value moves upwards towards the top of the list
                return -((data.length + currentContent) - itemIndex) * itemHeight;
            }
        }

        // Spacing for items after the current index
        if (itemIndex > currentContent) {
            return (itemIndex - currentContent) * itemHeight;
        }

        // Spacing for items before the current index
        if (itemIndex < currentContent) {
            // If passing the negative threshold, move into a positive positioning
            if ((currentContent - itemIndex) * itemHeight >= shuffleThreshold) {
                return (data.length - (currentContent - itemIndex)) * itemHeight;
            } else {
                // Move into a negative positioning
                return -(currentContent - itemIndex) * itemHeight;
            }
        }

        return null
    }

    const determineActive = (itemIndex: number) => {
        if (itemIndex === currentContent) return "2px solid #6513F0"
        return ""
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <IconButton
                sx={{
                    display: "flex",
                    alignSelf: "center",
                    padding: "10px",
                    maxWidth: "50px",
                    borderRadius: "30px"
                }}
                onClick={() => handleClick("prev")}
            >
                <ArrowDropUpIcon sx={{ color: "black" }} />
            </IconButton>
            {/* Slides CSS */}
            <Box
                id="slides"
                sx={{
                    alignSelf: "flex-end",
                    flex: 1,
                    width: "100%",
                    overflow: "hidden",

                }}>
                {/* Carousel Inner CSS */}
                <Box
                    id="carousel-inner"
                    sx={{
                        position: "relative",
                        maxHeight: '400px',
                        height: '400px',
                        overflow: "hidden"
                    }}>
                    {data.map((item, i) => {
                        return (
                            <Box
                                sx={{
                                    position: "absolute",
                                    border: "none;",
                                    padding: 0,
                                    margin: 0,
                                    // marginLeft: '35%',
                                    transition: "transform 0.4s ease, opacity 0.4s ease",
                                    top: "112px",
                                    height: '104px',
                                    width: '100%',

                                    transform: `translateY(${determinePlacement(i)}px)`,
                                    '&::before': {
                                        zIndex: 1,
                                        position: "absolute",
                                        width: "100%",
                                        height: "110px",
                                        pointerEvents: "none",
                                        top: 0,
                                        background: "linear-gradient(0deg, hsla(0, 0%, 100%, 0) 0%, hsla(27, 100%, 48%, 1) 100%)"
                                    },
                                    '&::after': {
                                        zIndex: 1,
                                        position: "absolute",
                                        width: "100%",
                                        height: "110px",
                                        pointerEvents: "none",
                                        bottom: 0,
                                        background: "linear-gradient(0deg, hsla(27, 100%, 48%, 1) 0%, hsla(0, 0%, 100%, 0) 100%)"

                                    }
                                }}>
                                <Button
                                    onClick={() => dispatch(changeIndex(i))}
                                    key={item.labelType}
                                    sx={{
                                        // eslint-disable-next-line no-template-curly-in-string
                                        backgroundImage: `url(data:image/png;base64,${item.fileStream})`,
                                        backgroundSize: "cover",
                                        height: "60px",
                                        marginLeft: '35%',
                                        border: `${determineActive(i)}`,

                                    }}
                                >
                                </Button>
                                <Typography sx={{ fontWeight: "bold", fontSize: "12pt", textAlign: "center" }}>{item.labelType}</Typography>
                            </Box>

                        )
                    })}
                </Box>
            </Box>

            <IconButton
                sx={{
                    display: "flex",
                    alignSelf: "center",
                    padding: "10px",
                    maxWidth: "50px",
                    borderRadius: "30px"
                }}
                onClick={() => handleClick("next")}
            >
                <ArrowDropDownIcon sx={{ color: "black" }} />
            </IconButton>
        </Box >
    )
}

export default Carosel