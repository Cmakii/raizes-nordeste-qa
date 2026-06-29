import TotemPage from '../page_objects/TotemPage';

describe('CT-NEG-002 — Recusa do Gateway Externo de Pagamento', () => {
  it('Deve tratar a resposta de saldo insuficiente do gateway de forma assíncrona', () => {
    // mock simulando falha/recusa do serviço desacoplado de pagamento
    cy.intercept('POST', '**/api/v1/pagamentos/processar', {
      statusCode: 402,
      body: { status: 'RECUSADO', motivo: 'Saldo Insuficiente' }
    }).as('pagamentoRecusado');

    TotemPage.acessarUnidade('REC-01');
    TotemPage.selecionarCategoria('sucos');
    TotemPage.adicionarProdutoAoCarrinho('SUC-001');
    TotemPage.avancarParaFechamento();
    TotemPage.escolherFormaPagamento('cartao-credito');
    TotemPage.finalizarPedido();

    cy.wait('@pagamentoRecusado');
    TotemPage.validarAlertaErro('Transação Recusada. Por favor, tente outro cartão.');
  });
});