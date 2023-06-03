import React, { useEffect, useRef, useState } from 'react'
import { useGameManagerStore } from '../hooks/useGameManagerStore'
import { TileComponent } from './Tile';
import { Terrain } from '../data/filePaths';
import { SingleWorld } from '../utils/singleWorld';
import { useTick } from '@pixi/react';
import { backgroundMovesPerPreview, tileScale, tileSize } from '../types/global';
import { Brain } from '../utils/brain';

export function World() {

    const [bestWorldTicks, setBestWorldTicks] = useState(0);
    const ctx = useGameManagerStore();


    const bestScore = useRef(0);

    useTick((delta) => {
        
        let allFinished = true;
        for(let i = 0; i < ctx.worlds.length; i++)
        {
            if(!ctx.worlds[i].isGameFinished()) allFinished = false;
        }
        if(allFinished)
        {
            ctx.copyBestBrain();
            ctx.resetWorlds();
        }

        
        for(let i = 0; i < ctx.brains.length; i++)
        {
            if(ctx.worlds[i] && ctx.brains[i])
            {
                if(!ctx.worlds[i].isGameFinished())
                {
                    for(let z = 0; z < backgroundMovesPerPreview; z++)
                        if(!ctx.worlds[i].isGameFinished())
                            if(ctx.worlds[i].play()) ctx.brains[i].makeDecision(ctx.worlds[i]);
                        else break;
                }
                else
                {
                    if(ctx.worlds[i].player.survivalPoints > bestScore.current)
                    {
                        bestScore.current = ctx.worlds[i].player.survivalPoints;
                        ctx.bestBrainCopy = new Brain(ctx.brains[i]);
                        console.log("Score: ", bestScore.current);
                    }
                }
            }
        }
        if(ctx.previewWorld && ctx.previewBrain)
        {
            if(!ctx.previewWorld.isGameFinished())
            {
                if(ctx.previewWorld.play(delta)) ctx.previewBrain.makeDecision(ctx.previewWorld);
                ctx.camera.setPlayerPosition(ctx.previewWorld.player.positionX, ctx.previewWorld.player.positionY);
                ctx.camera.centerOnPlayer();
                setBestWorldTicks(ctx.previewWorld.tickCount);
            }
            else
            {
                ctx.previewBrain = new Brain(ctx.bestBrainCopy);
                ctx.previewWorld = new SingleWorld();
            }
        }
    });


  return (
    <>
        {ctx.previewWorld?.grass.map((value, index) =>
            {
                const posX = Math.floor(index % SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetX();
                const posY = Math.floor(Math.floor(index - posX) / SingleWorld.WORLD_WIDTH) - ctx.camera.getOffsetY();

                const isOutOfScreen = posX < - tileSize || posX > tileSize + ctx.screen.getWidth() || posY < - tileSize || posY > tileSize + ctx.screen.getHeight();
                if(isOutOfScreen) return null;

                return (<TileComponent key={index} path={Terrain.getPath(value)} positionX={posX} positionY={posY} scale={tileScale} width={tileSize} height={tileSize} />)
            })}
        {ctx.previewWorld?.onGrass.map((value, index) =>
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
