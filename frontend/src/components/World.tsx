import React, { useEffect, useState } from 'react'
import { useGameManagerStore } from '../hooks/useGameManagerStore'
import { TileComponent } from './Tile';
import { Terrain } from '../data/filePaths';
import { SingleWorld } from '../utils/singleWorld';
import { useTick } from '@pixi/react';

export function World() {

    const [bestWorldTicks, setBestWorldTicks] = useState(0);
    const ctx = useGameManagerStore();

    const tileScale = 0.4;
    const tileSize = 128;

    useTick((delta) => {
        ctx.bestWorld?.play(delta);
        setBestWorldTicks(ctx.bestWorld ? ctx.bestWorld.tickCount : 0);
    });


  return (
    <>
        {ctx.bestWorld?.grass.map((value, index) =>
            {
                const posX = Math.floor(index % SingleWorld.WORLD_WIDTH);
                const posY = Math.floor(Math.floor(index - posX) / SingleWorld.WORLD_WIDTH);
                return (<TileComponent key={index} path={Terrain.getPath(value)} positionX={posX + ctx.camera.getOffsetX()} positionY={posY + ctx.camera.getOffsetY()} scale={tileScale} width={tileSize} height={tileSize} />)
            })}
    </>
  )
}
