const os = require('os');

async function performanceData() {
  return new Promise(async (resolve, reject) => {
    const osType = (os.type() === 'Darwin' ? 'Mac' : os.type()) === 'Windows_NT' ? 'Windows' : os.type();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;
    const upTime = os.uptime();
    const cpuModel = os.cpus()[0].model;
    const numCores = os.cpus().length;
    const cpuSpeed = os.cpus()[0].speed;
    const cpuLoad = await getCpuLoad();

    resolve({ osType, totalMem, freeMem, usedMem, memUsage, upTime, cpuModel, numCores, cpuSpeed, cpuLoad });
  });
}

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;
  cpus.forEach((core) => {
    for (type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;
      resolve(100 - Math.floor((100 * idleDifference) / totalDifference));
    }, 100);
  });
}

performanceData().then((allPerformanceData) => {
  console.log(allPerformanceData);
});
