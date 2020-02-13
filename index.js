
const os = require('os')
const cluster = require('cluster')
const uuid = require('uuid')
var instance_id = uuid.v4();

const PORT = 8080

/* <---worker 생성---> */
//총 cpu갯수
const cpuCount = os.cpus().length
//앱 구동 시 사용할 cpu 갯수
const workerCount = Math.ceil(cpuCount / 2)


if (cluster.isMaster) {
    console.log('서버 ID : ' + instance_id);
    console.log('서버 CPU 수 : ' + cpuCount);
    console.log('생성할 워커 수 : ' + workerCount);
    console.log(workerCount + '개의 워커가 생성됩니다\n');
    for (var i = 0; i < workerCount; i++) {
        console.log("워커 생성 [" + (i + 1) + "/" + workerCount + "]");
        const worker = cluster.fork();
    }

    cluster.on('online', (worker) => {
        console.log('워커 온라인 - 워커 ID : [' + worker.process.pid + ']');
    })

    cluster.on('exit', function (worker) {
        console.log('워커 사망 - 사망한 워커 ID : [' + worker.process.pid + ']');
        console.log('다른 워커를 생성합니다.');

        var worker = cluster.fork();
    });
} else if (cluster.isWorker) {
    const express = require('express')
    const app = express()
    const worker_id = cluster.worker.id


    app.get('/', (req, res) => {
        res.send('안녕하세요 저는<br>워커 [' + worker_id + '] 입니다.')
    })

    app.listen(PORT, () => {
        console.log("Express 서버가 " + PORT + "번 포트에서 Listen중입니다.");
    })

    app.get('/workerKiller', (req, res) => {
        cluster.worker.kill()
        res.send('워커킬러호출됨')
    })
}

