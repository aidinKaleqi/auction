import { Injectable } from '@nestjs/common';
const cluster = require('cluster');
@Injectable()
export class Cluster {
  static clusterize(callback: () => void): void {
    if (cluster.isPrimary) {
      const numCPUs = Number(process.env.SERVICE_CLUSTER_SIZE);
      console.log(`Primary process running on PID: ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died, restarting...`);
        cluster.fork();
      });
    } else {
      console.log(`
        Worker Process Initialized!
        ================================
        PID: ${process.pid}
        Status: Running
        Ip: ${process.env.SERVICE_IP}
        Port: ${process.env.SERVICE_PORT}
        Timestamp: ${new Date().toISOString()}
        ================================
      `);
      callback();
    }
  }
}
