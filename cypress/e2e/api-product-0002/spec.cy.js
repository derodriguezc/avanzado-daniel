const directorioName = __dirname.replaceAll('\\', '/');
const module = directorioName.split(/[/]/)[2]
const scenarioName = directorioName.slice(directorioName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const testCaseId = directorioName.split(/[-]/).pop();

import { ProductsPage } from "../../support/page/productsPage.js";

describe(`${scenarioName} - ${module} `, () => {

    let productNew = {};
    const productsPage = new ProductsPage();

    before(() => {
        cy.login(Cypress.env().usuario, Cypress.env().password);
        cy.fixture(`${scenarioName}-${testCaseId}/product`).as('data')
        cy.then(function () {
            cy.getProductByName(this.data.productEdit.name).as('response');
        });
    });

    it('Deberia permitir la edicion de un producto', function () {
        const product = Cypress._.find(this.response.body.products.docs, { name: this.data.productEdit.name })

        if (product && product._id) {
            cy.deleteProductIfExists(product._id);
        } else {
            cy.log('No se pudo encontrar el ID del producto para eliminar.');
        }
        cy.createProduct(this.data.productNew).then(response => {
            productNew.responseBody = response.body;
            cy.editProduct(productNew.responseBody.product._id, this.data.productEdit);
        });
        cy.visit('');
        cy.getByDataCy('onlineshoplink').click();
        cy.getByDataCy('search-type').select('ID');
        cy.getByDataCy('search-bar').type(this.data.productNew.id + '{enter}');
        cy.contains(this.data.productEdit.name).should('be.visible');
        cy.contains(this.data.productEdit.price).should('be.visible');
        cy.log('Producto encontrado correctamente');

    });
});