import TotemPage from '../page_objects/TotemPage';

describe('CT-NEG-001 — Bloqueio de Item Sem Estoque Local', () => {
  it('Deve impedir a adição de um item quando o estoque da unidade estiver zerado', () => {
    // simula resposta de estoque zerado para a unidade de Fortaleza (FOR-02)
    cy.intercept('GET', '**/api/v1/estoque/FOR-02/BOL-002', {
      statusCode: 200,
      body: { produtoId: 'BOL-002', quantidadeDisponivel: 0 }
    }).as('estoqueZerado');

    TotemPage.acessarUnidade('FOR-02');
    cy.wait('@estoqueZerado');

    // forca a tentativa de submissao do item esgotado
    TotemPage.selecionarCategoria('bolos');
    TotemPage.adicionarProdutoAoCarrinho('BOL-002');
    
    TotemPage.validarAlertaErro('Produto indisponível no estoque desta unidade');
  });
});