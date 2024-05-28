import cluster from 'cluster';
import os from 'os';
import startServer from './index.js';

function startWorker() {
  const worker = cluster.fork();
  console.log(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
  let maxCpus = os.cpus().length;
  let minCpus = 1;
  // Оставляем одно ядро свободным
  let availableCpus = maxCpus > minCpus ? maxCpus - minCpus : minCpus;
  for (let i = 0; i < availableCpus; i++) {
    startWorker();
  }

  // log any workers that disconnect; if a worker disconnects, it
  // should then exit, so we'll wait for the exit event to spawn
  // a new worker to replace it
  cluster.on('disconnect', (worker) =>
    console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`)
  );

  // when a worker dies (exits), create a worker to replace it
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `CLUSTER: Worker ${worker.id} died with exit ` +
        `code ${code} (${signal})`
    );
    startWorker();
  });
} else {
  const port = process.env.PORT || 3000;
  // start our app on worker; see 01-server.js
  startServer(port);
}
