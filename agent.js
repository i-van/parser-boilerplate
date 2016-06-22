'use strict';

let os = require('os')
  , statsd = require('./lib/statsd');

const SERVER_NAME = process.env.SERVER_NAME || 'localhost';
const INTERVAL = Number(process.env.INTERVAL) || 10000;
const TOTAL_MEMORY = os.totalmem();

let previousCpuInfo = cpuInfo();
setInterval(function() {
  let currentCpuInfo = cpuInfo();
  let cpuUsage = currentCpuInfo.map(function(currentCpu, index) {
    let previousCpu = previousCpuInfo[index];
    return 1 - (currentCpu.idle - previousCpu.idle) / (currentCpu.total - previousCpu.total);
  });

  previousCpuInfo = currentCpuInfo;

  statsd.gauge(SERVER_NAME + '.usedMemory', TOTAL_MEMORY - os.freemem());
  statsd.gauge(SERVER_NAME + '.cpu.avg', cpuUsage.reduce((res, value) => res + value, 0) / cpuUsage.length * 100);
  cpuUsage.forEach(function(value, index) {
    statsd.gauge(SERVER_NAME + '.cpu.' + index, value * 100);
  });
}, INTERVAL);

/**
 * @returns {Array}
 */
function cpuInfo() {
  return os.cpus().map(function(cpu) {
    return {
      idle: cpu.times.idle,
      total: cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq
    };
  });
}
