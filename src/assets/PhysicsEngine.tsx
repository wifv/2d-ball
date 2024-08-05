import { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } from 'matter-js';
import React, { useEffect, useRef } from 'react';

const PhysicsEngine: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  let wallThickness = 500

  useEffect(() => {

    const engine = Engine.create({
      gravity: {
        x: 0,
        y: 10,
      },
    });

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

    const matter = Bodies.circle(render.options.width! / 2, 200, 80);
    const ground = Bodies.rectangle(render.options.width! / 2, render.options.height! + (wallThickness / 2), render.options.width!, wallThickness, { isStatic: true });
    const roof = Bodies.rectangle(render.options.width! / 2, (wallThickness / 2 * -1), render.options.width!, wallThickness, { isStatic: true });
    const RightWall = Bodies.rectangle(render.options.width! + (wallThickness / 2), render.options.height! / 2, wallThickness, render.options.height!, { isStatic: true });
    const leftWall = Bodies.rectangle((wallThickness / 2 * -1), render.options.height! / 2, wallThickness, render.options.height!, { isStatic: true });

    Composite.add(engine.world, [matter, ground, RightWall, leftWall, roof]);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
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
  }, []);

  return <div ref={sceneRef} />;
};

export default PhysicsEngine;
