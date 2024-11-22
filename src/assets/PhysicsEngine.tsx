import { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } from 'matter-js';
import React, { useEffect, useRef, useState } from 'react';

const PhysicsEngine: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [engine] = useState(() => Engine.create({ gravity: { x: 0, y: 10 } }));
  const wallThickness = 500;

  const addImage = () => {
    let imageWidth
    let imageHeight
    let texture = ''

    if (Math.round(Math.random())) {
      texture = 'fish.jpg'
      imageWidth = Math.round(861 / 8);
      imageHeight = Math.round(1280 / 8);
    } else {
      texture = 'cat.jpg'
      imageWidth = Math.round(748 / 8);
      imageHeight = Math.round(1280 / 8);
    }

    const newBody = Bodies.rectangle(
      Math.random() * window.innerWidth, // Random x position
      50, // Starting y position
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
      // Remove any body that is not static (assumes walls are static)
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

    // Initial images
    const imgBody1 = Bodies.rectangle(
      render.options.width! / 3,
      200,
      Math.round(861 / 8),
      Math.round(1280 / 8),
      {
        render: {
          sprite: {
            texture: 'fish.jpg',
            xScale: 0.2,
            yScale: 0.2,
          },
        },
      }
    );

    const imgBody2 = Bodies.rectangle(
      (render.options.width! / 3) * 2,
      200,
      Math.round(748 / 8),
      Math.round(1280 / 8),
      {
        render: {
          sprite: {
            texture: 'cat.jpg',
            xScale: 0.2,
            yScale: 0.2,
          },
        },
      }
    );

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
