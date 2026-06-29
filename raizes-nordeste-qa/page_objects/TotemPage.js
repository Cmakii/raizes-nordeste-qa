class TotemPage {
  acessarUnidade(idLoja) {
    cy.visit(`/totem?loja=${idLoja}`);
  }

  selecionarCategoria(categoria) {
    cy.get(`#cardapio-${categoria}`).click();
  }

  adicionarProdutoAoCarrinho(codProduto) {
    cy.get(`[data-produto="${codProduto}"]`).click();
  }

  identificarClienteFidelidade(cpf) {
    cy.get('#input-cpf-fidelidade').type(cpf);
    cy.get('#btn-confirmar-cpf').click();
  }

  avancarParaFechamento() {
    cy.get('#botao-avancar').click();
    cy.get('#opcao-retirada-rapida').click();
  }

  escolherFormaPagamento(metodo) {
    cy.get(`#pagamento-${metodo}`).click();
  }

  finalizarPedido() {
    cy.get('#botao-finalizar-pagamento').click();
  }

  validarMensagemSucesso() {
    cy.get('#status-pedido', { timeout: 2000 }).should('contain', 'Pedido Confirmado');
  }

  validarAlertaErro(mensagem) {
    cy.get('.alerta-erro').should('be.visible').and('contain', mensagem);
  }
}

export default new TotemPage();