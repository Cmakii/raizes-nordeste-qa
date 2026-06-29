import TotemPage from '../page_objects/TotemPage';

describe('CT-POS-002 — Acúmulo Automatizado de Pontos de Fidelidade', () => {
  it('Deve identificar o cliente e acumular pontos baseados no perfil regulamentado pela LGPD', () => {

    cy.intercept('GET', '**/api/v1/fidelidade/cliente/12345678900', {
      statusCode: 200,
      body: { nome: 'Anonimizado', perfil: 'Frequente', saldoAtual: 150 }
    }).as('consultaFidelidade');

    cy.intercept('POST', '**/api/v1/pedidos', (req) => {
      expect(req.body.cliente.cpf).to.equal('12345678900');
    });

    TotemPage.acessarUnidade('REC-01');
    TotemPage.identificarClienteFidelidade('12345678900');
    cy.wait('@consultaFidelidade');
    
    TotemPage.selecionarCategoria('cuscuz');
    TotemPage.adicionarProdutoAoCarrinho('CUS-002');
    TotemPage.avancarParaFechamento();
    TotemPage.escolherFormaPagamento('balcao');
    TotemPage.finalizarPedido();
  });
});