import React from 'react';
import drawCircle from '../../utilities/canvas-load-animation';
import bytesToGigabytes from '../../utilities/bytes-to-gigabytes';

function Memory(props) {
  let { totalMem, freeMem, memUsage } = props.memData;
  memUsage = Math.floor(memUsage * 100);
  const canvas = document.querySelector(`.${props.memData.memWidgetId}`);
  drawCircle(canvas, memUsage);

  return (
    <div className="col-sm3 mem element">
      <h3>Memory Usage</h3>
      <div className="canvas-wrapper">
        <canvas className={props.memData.memWidgetId}></canvas>
        <div className="mem-text">{memUsage}%</div>
      </div>
      <div>Total Memory: {bytesToGigabytes(totalMem)}GB</div>
      <div>Free Memory: {bytesToGigabytes(freeMem)}GB</div>
    </div>
  );
}

export default Memory;
