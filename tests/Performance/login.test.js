import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 15 },
        { duration: '2m', target: 30 },
        { duration: '5s', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% das requisições em até 1s
        http_req_failed: ['rate<0.01']     // até 1% de falhas
    }
};

export default function() {
    const url = 'http://localhost:3000/';
    const res = http.get(url);

    check(res, {
        'Status é 200': (r) => r.status === 200,
        'Contém HTML': (r) => r.body && r.body.includes('<html')
    });

    sleep(1);
}