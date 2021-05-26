import React, { Component } from 'react';
import Cpu from './cpu/Cpu';
import Memory from './memory/Memory';
import Info from './info/Info';
import './widget.css';

class Widget extends Component {
  constructor() {
    super();
    this.state = {};
  }

  getUniqeClassName(classStringStart, macA) {
    if (!isNaN(macA)) {
      return `${classStringStart}${macA}`;
    } else {
      return `${classStringStart}${macA.replace(/:/g, '')}`;
    }
  }

  render() {
    const { osType, totalMem, freeMem, usedMem, memUsage, upTime, cpuModel, numCores, cpuSpeed, cpuLoad, macA, isActive } = this.props.data;
    const cpuWidgetId = this.getUniqeClassName('cpu-widget-', macA);
    const memWidgetId = this.getUniqeClassName('mem-widget-', macA);

    return (
      <div className="row widget justify-content-center m-5">
        {!isActive ? <div className="not-active">Offline</div> : ''}
        <Cpu cpuData={{ cpuLoad, cpuWidgetId }} />
        <Memory memData={{ totalMem, freeMem, usedMem, memUsage, memWidgetId }} />
        <Info infoData={{ macA, osType, upTime, cpuModel, numCores, cpuSpeed }} />
      </div>
    );
  }
}

export default Widget;
