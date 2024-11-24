import { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';

const PhysicsEngine: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 5 } }));
  const wallThickness = 500;

  const addImage = () => {
    let imageWidth: number = 100
    let imageHeight: number = 100
    let texture = ''

    const randomCase = Math.ceil(Math.random() * 3);
    switch (randomCase) {
      case 1:
        texture = 'fish.jpg'
        imageWidth = Math.round(861 / 8);
        imageHeight = Math.round(1280 / 8);
        break
      case 2:
        texture = 'cat.jpg'
        imageWidth = Math.round(748 / 8);
        imageHeight = Math.round(1280 / 8);
        break
      case 3:
        texture = 'hat.jpg'
        imageWidth = Math.round(720 / 8);
        imageHeight = Math.round(705 / 8);
        break
    }

    const newBody = Bodies.rectangle(
      Math.random() * window.innerWidth,
      0,
      imageWidth,
      imageHeight,
      {
        render: {
          sprite: {
            texture,
            xScale: 0.125,
            yScale: 0.125,
          },
        },
      }
    );

    Composite.add(engine.world, newBody);
  };

  const removeImages = () => {
    Composite.allBodies(engine.world).forEach((body) => {
      if (!body.isStatic) {
        Composite.remove(engine.world, body);
      }
    });
  };

  useEffect(() => {
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });

    const runner = Runner.create();

    const ground = Bodies.rectangle(
      render.options.width! / 2,
      render.options.height! + wallThickness / 2,
      render.options.width!,
      wallThickness,
      { isStatic: true }
    );

    const walls = [
      Bodies.rectangle(
        render.options.width! / 2,
        -wallThickness / 2,
        render.options.width!,
        wallThickness,
        { isStatic: true }
      ),
      Bodies.rectangle(
        render.options.width! + wallThickness / 2,
        render.options.height! / 2,
        wallThickness,
        render.options.height!,
        { isStatic: true }
      ),
      Bodies.rectangle(
        -wallThickness / 2,
        render.options.height! / 2,
        wallThickness,
        render.options.height!,
        { isStatic: true }
      ),
    ];

    Composite.add(engine.world, [ground, ...walls]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);

    Runner.run(runner, engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [engine]);

  return (
    <>
      <div ref={sceneRef} />
      <button className='add' onClick={() => addImage()}>ААААААААААААА</button>
      <button className='remove' onClick={() => removeImages()}>Украсть</button>
    </>
  );
};

export default PhysicsEngine;
