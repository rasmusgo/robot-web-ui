import React, { useRef, useState } from "react";

const TAU = Math.PI * 2;
const degrees_from_radians = 360 / TAU;

const RotatedRect: React.SFC<{
  cx: number,
  cy: number,
  width: number,
  height: number,
  theta: number,
  fill: string,
}> = props => (
  <rect
    x={props.cx}
    y={props.cy}
    width={props.width}
    height={props.height}
    style={{
      fill: props.fill,
      strokeWidth: 1,
      stroke: 'black',
    }}
    transform={`
      rotate(${degrees_from_radians * props.theta}, ${props.cx}, ${props.cy})
      translate(${-props.width / 2}, ${-props.height / 2})
    `}
  />
);

const normalized = ([x, y]: [number, number]): [number, number] => {
  const length = Math.sqrt(x*x + y*y);
  return isFinite(length) ?
    [x / length, y / length] : [0, 0];
}

// Returns theta: -PI ≤ theta ≤ PI
const normalizedAngle = (theta: number) => {
  return ((theta % TAU + TAU + Math.PI) % TAU) - Math.PI;
}

// Returns theta: 0 ≤ theta ≤ PI
const angleDifference = (alfa: number, beta: number) => {
  return Math.abs(normalizedAngle(alfa - beta));
}

interface Wheel {
  ax:           number;
  ay:           number;
  wx:           number;
  wy:           number;
  theta:        number;
  neutralTheta: number;
}

const createWheel = ({
  ax,
  ay,
  px,
  py,
  wheelOffset,
  neutralTheta,
}: {
  ax: number,
  ay: number,
  px: number,
  py: number,
  wheelOffset: number,
  neutralTheta: number,
}): Wheel => {
  const [dx, dy] = normalized([px - ax, py - ay]);
  const rawTheta = Math.atan2(dy, dx);
  const [wx, wy, theta] = angleDifference(rawTheta, neutralTheta) > TAU / 4 ?
    [ax - dx * wheelOffset, ay - dy * wheelOffset, rawTheta + TAU / 2] :
    [ax + dx * wheelOffset, ay + dy * wheelOffset, rawTheta];
  return {
    ax,
    ay,
    wx,
    wy,
    theta,
    neutralTheta,
  };
}

export const Arc = () => {
  const b = 122 / 2;
  const [cx, cy] = [500, 500];
  const [px, updatePx] = useState(110);
  const [py, updatePy] = useState(400);
  const svgElement = useRef<SVGSVGElement>(null);

  const wheelOffset = 30;
  const wheels: Wheel[] = [
    createWheel({ax: cx - b, ay: cy - b, px, py, wheelOffset, neutralTheta: TAU / 2}),
    createWheel({ax: cx + b, ay: cy - b, px, py, wheelOffset, neutralTheta: 0}),
    createWheel({ax: cx - b, ay: cy + b, px, py, wheelOffset, neutralTheta: TAU / 2}),
    createWheel({ax: cx + b, ay: cy + b, px, py, wheelOffset, neutralTheta: 0}),
  ];

  const updateTarget = (clientX: number, clientY: number) => {
    if (svgElement.current == null) {
      return;
    }
    const svgRect = svgElement.current.getBoundingClientRect();
    updatePx((clientX - svgRect.left) / svgRect.width * 1000);
    updatePy((clientY - svgRect.top) / svgRect.height * 1000);
  }

  const onTouch: React.TouchEventHandler<SVGSVGElement> = (event) => {
    updateTarget(event.touches[0].clientX, event.touches[0].clientY);
  };

  const onMouse: React.MouseEventHandler<SVGSVGElement> = (event) => {
    if (event.buttons == 0) {
      return;
    }
    updateTarget(event.clientX, event.clientY);
  };

  return (
    <svg
      viewBox="0 0 1000 1000"
      width={300}
      height={300}
      style={{
        border: '1px solid black',
        fill: 'white',
        position: 'relative',
      }}
      onTouchStartCapture={ onTouch }
      onTouchMoveCapture={ onTouch }
      onMouseDown={ onMouse }
      onMouseMove={ onMouse }
      ref={svgElement}
    >
      { wheels.map((wheel, index) => (
        <RotatedRect
          key={`wheel-${index}`}
          cx={wheel.wx}
          cy={wheel.wy}
          width={12}
          height={52}
          theta={wheel.theta}
          fill="gray"
        />
      )) }
      { wheels.map((wheel, index) => (
        <RotatedRect
          key={`wheel-${index}`}
          cx={wheel.ax}
          cy={wheel.ay}
          width={38}
          height={25}
          theta={wheel.theta}
          fill="silver"
        />
      )) }
      <RotatedRect
        cx={cx}
        cy={cy}
        width={168}
        height={70}
        theta={0}
        fill="wheat"
      />
      { wheels.map((wheel, index) => (
        <circle
          key={`axis-${index}`}
          cx={wheel.ax}
          cy={wheel.ay}
          r={2.5}
          style={{
            fill: 'lightblue',
            strokeWidth: 1,
            stroke: 'black',
          }}
        />
      )) }
      <circle
        cx={px}
        cy={py}
        r={2.5}
        style={{
          fill: 'red',
          strokeWidth: 1,
          stroke: 'black',
        }}
      />
      { wheels.map((wheel, index) => (
        <line
          key={`line-${index}`}
          x1={px}
          y1={py}
          x2={wheel.ax}
          y2={wheel.ay}
          style={{
            stroke: 'black',
            strokeWidth: 1,
          }}
        />
      )) }
    </svg>
  );
}
