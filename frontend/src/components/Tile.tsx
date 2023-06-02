/* eslint-disable react/react-in-jsx-scope */
import { Sprite } from "@pixi/react";
import { Terrain } from "../data/filePaths";

interface TileComponentProps{
    
    path: string;
    positionX: number;
    positionY: number;
    scale: number;
    width: number;
    height: number;

}

export function TileComponent(props: TileComponentProps) {

    const anchorX = 0;
    const anchorY = 0;

    const texture = Terrain.getTexture(props.path);

    if(texture === null) return null;

    return (
        <>
            <Sprite texture={texture}
                scale={props.scale}
                x={props.positionX * (props.width * props.scale)}
                y={props.positionY * (props.height * props.scale)}
                anchor={[anchorX, anchorY]}/>
        </>
    );
}