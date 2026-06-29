import TotemPage from '../page_objects/TotemPage';

describe('CT-POS-001 — Processamento de Pedido com Sucesso no Totem', () => {
  it('Deve realizar um pedido de Tapioca de Carne de Sol com sucesso e pagamento aprovado', () => {
    // interceptta e simula aprovação do gateway externo de pagamento
    cy.intercept('POST', '**/api/v1/pagamentos/processar', {
      statusCode: 200,
      body: { status: 'APROVADO', transacaoId: 'TX-998877' }
    }).as('pagamentoSucesso');

    TotemPage.acessarUnidade('REC-01');
    TotemPage.selecionarCategoria('tapiocas');
    TotemPage.adicionarProdutoAoCarrinho('TAP-004');
    TotemPage.avancarParaFechamento();
    TotemPage.escolherFormaPagamento('cartao-credito');
    TotemPage.finalizarPedido();

    cy.wait('@pagamentoSucesso');
    TotemPage.validarMensagemSucesso();
  });
});