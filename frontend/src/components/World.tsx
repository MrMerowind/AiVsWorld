import React, { useEffect, useState } from 'react'
import { useGameManagerStore } from '../hooks/useGameManagerStore'
import { TileComponent } from './Tile';
import { Terrain } from '../data/filePaths';
import { SingleWorld } from '../utils/singleWorld';
import { useTick } from '@pixi/react';
import { tileScale, tileSize } from '../types/global';

export function World() {

    const [bestWorldTicks, setBestWorldTicks] = useState(0);
    const ctx = useGameManagerStore();

    useTick((delta) => {
        if(ctx.bestWorld)
        {
            ctx.bestWorld.play(delta);
            setBestWorldTicks(ctx.bestWorld.tickCount);
            ctx.camera.setPlayerPosition(ctx.bestWorld.player.positionX, ctx.bestWorld.player.positionY);
            ctx.camera.centerOnPlayer();
        }
    });


  return (
    <>
        {ctx.bestWorld?.grass.map((value, index) =>
            {
                const posX = Math.floor(index % SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetX();
                const posY = Math.floor(Math.floor(index - posX) / SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetY();

                const isOutOfScreen = posX < - tileSize || posX > tileSize + ctx.screen.getWidth() || posY < - tileSize || posY > tileSize + ctx.screen.getHeight();
                if(isOutOfScreen) return null;

                return (<TileComponent key={index} path={Terrain.getPath(value)} positionX={posX} positionY={posY} scale={tileScale} width={tileSize} height={tileSize} />)
            })}
        {ctx.bestWorld?.onGrass.map((value, index) =>
            {
                const posX = Math.floor(index % SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetX();
                const posY = Math.floor(Math.floor(index - posX) / SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetY();

                const isOutOfScreen = posX < - tileSize || posX > tileSize + ctx.screen.getWidth() || posY < - tileSize || posY > tileSize + ctx.screen.getHeight();
                if(isOutOfScreen) return null;

                return (<TileComponent key={index} path={Terrain.getPath(value)} positionX={posX} positionY={posY} scale={tileScale} width={tileSize} height={tileSize} />)
            })}
    </>
  )
}
