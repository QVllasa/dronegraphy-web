import {Product} from "@/types";
import ReactPlayer from "react-player";
import Router from "next/router";
import routes from "@/config/routes";
import React, {useRef, useState} from "react";

const VideoPlayer = React.forwardRef(({video}: { video: Product }, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const defaultUrl = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8";

    const playerRef = useRef(null);

    React.useImperativeHandle(ref, () => ({
        play, stop, reset
    }))

    const play = () => {
        console.log("play")
        setIsLoaded(true);
        setIsPlaying(true);
    }

    const stop = () => {
        console.log("stop")
        setIsPlaying(false);
    }

    const reset = () => {
        console.log("reset")
        setIsPlaying(false);
        // @ts-ignore
        playerRef?.current?.seekTo(0);
    }

    const goToDetailsPage = (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        e.stopPropagation();
        Router.push(routes.productUrl(video.slug));
    };

    return (
        <div onClick={goToDetailsPage} className={'pt-[56.25%] relative w-full h-full'}>
            <ReactPlayer playing={isPlaying}
                         ref={playerRef}
                         className={'absolute top-0 left-0 '}
                         width={'100%'}
                         height={'100%'}
                         url={defaultUrl}
                         controls={false} muted/>
        </div>
    )
});

export default VideoPlayer;
