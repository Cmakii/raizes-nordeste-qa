import http from 'k6/http';
import { check, sleep } from 'k6';

// config o crescimento agressivo de carga para simular o pico da lanchonete
export const options = {
  stages: [
    { duration: '1m', target: 50 },  // sobe para 50 usuários simultâneos em 1 min
    { duration: '3m', target: 200 }, // estressa o sistema com 200 usuários em pico
    { duration: '1m', target: 0 },   // desce a carga para avaliar a recuperação
  ],
};

export default function () {
  const url = 'https://api.raizesdonordeste.com.br/v1/pedidos';
  const payload = JSON.stringify({
    lojaId: 'REC-01',
    canal: 'TOTEM',
    itens: [{ produtoId: 'TAP-004', quantidade: 1 }]
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // simula a requisição de criação de pedido concorrente
  const res = http.post(url, payload, params);

  // valida o requisito n funcional
  check(res, {
    'status é 201 (criado)': (r) => r.status === 201,
    'tempo de resposta inferior a 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}