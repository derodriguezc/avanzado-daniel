const directorioName = __dirname.replaceAll('\\', '/');
const module = directorioName.split(/[/]/)[2]
const scenarioName = directorioName.slice(directorioName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const testCaseId = directorioName.split(/[-]/).pop();

import { ProductsPage } from "../../support/page/productsPage.js";

describe(`${scenarioName} - ${module} `, () => {

    const productsPage = new ProductsPage();


    before(() => {
        cy.login(Cypress.env().usuario, Cypress.env().password);
        cy.fixture(`${scenarioName}-${testCaseId}/product`).as('data')
    });

    it('Deberia permitir verificacion en la BD', function () {

        const productsToCreate = [this.data.product1, this.data.product2];
        cy.wrap(productsToCreate).each(product => {
            console.log("producto", product);
            cy.deleteProduct(product.id);
            cy.createProduct(product)
        });
        cy.visit('');
        cy.getByDataCy('onlineshoplink').click();
        cy.getByDataCy('search-type').select('ID');
        cy.getByDataCy('search-bar').type(this.data.product1.id + '{enter}');
        cy.contains(this.data.product1.name).should('be.visible');
        cy.contains(this.data.product1.price).should('be.visible');
        cy.get('[data-cy^="add-to-cart-"]').eq(0).click();
        cy.get('[data-cy="closeModal"]').click();
        cy.get('[data-cy^="add-to-cart-"]').eq(0).click();
        cy.get('[data-cy="closeModal"]').click();
        cy.getByDataCy('search-bar').clear();
        cy.getByDataCy('search-bar').type(this.data.product2.id + '{enter}');
        cy.contains(this.data.product2.name).should('be.visible');
        cy.contains(this.data.product2.price).should('be.visible');
        cy.get('[data-cy^="add-to-cart-"]').eq(0).click();
        cy.get('[data-cy="closeModal"]').click();
        cy.get('[data-cy^="add-to-cart-"]').eq(0).click();
        cy.get('[data-cy="closeModal"]').click();
        cy.get('[data-cy="goShoppingCart"]').click();
        cy.get('[data-cy="productAmount"]').eq(0).invoke('text').then(quantity => {
            expect(parseInt(quantity)).to.be.equal(2);
        });
        cy.get('[data-cy="productName"]').eq(0).invoke('text').then(function (producto) {
            expect(producto).to.be.equal(this.data.product1.name);
        })
        cy.get('[data-cy="unitPrice"]').eq(0).invoke('text').then(function (precio) {
            expect(precio).to.be.equal(`$${this.data.product1.price}`);
        });
        cy.get('[data-cy="totalPrice"]').eq(0).eq(0).invoke('text').then(function (precio) {
            let precioNumerico = parseFloat(precio.replace('$', ''));
            cy.wrap(precioNumerico).as('totalPrice1');
            expect(precioNumerico).to.be.equal(2 * this.data.product1.price);
        });
        cy.get('[data-cy="productAmount"]').eq(1).invoke('text').then(quantity => {
            expect(parseInt(quantity)).to.be.equal(2);
        });
        cy.get('[data-cy="productName"]').eq(1).invoke('text').then(function (producto) {
            expect(producto).to.be.equal(this.data.product2.name);
        })
        cy.get('[data-cy="unitPrice"]').eq(1).invoke('text').then(function (precio) {
            expect(precio).to.be.equal(`$${this.data.product2.price}`);
        });
        cy.get('[data-cy="totalPrice"]').eq(1).eq(0).invoke('text').then(function (precio) {
            let precioNumerico = parseFloat(precio.replace('$', ''));
            cy.wrap(precioNumerico).as('totalPrice2');
            expect(precioNumerico).to.be.equal(2 * this.data.product2.price);
        });
        cy.get('[data-cy="goBillingSummary"]').click();
        cy.checkBillingSummary('@totalPrice1', '@totalPrice2');
        cy.get('[data-cy="goCheckout"]').click();
        cy.get('[data-cy="firstName"]').type('Daniel');
        cy.get('[data-cy="lastName"]').type('Rodriguez');
        cy.get('[data-cy="cardNumber"]').type('1234567890123456');
        cy.intercept('POST', '**/*').as('apiRequest');
        cy.get('[data-cy="purchase"]').click();
        cy.contains('Purchase has been completed successfully').should('be.visible');
        cy.get('[data-cy="thankYou"]').click();
        cy.wait('@apiRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
            const orden = interception.response.body.product.sellid;
            const query = `SELECT pp.*, s.* FROM public."purchaseProducts" AS pp JOIN sells AS s ON pp.sell_id = s.id WHERE s.id = '${orden}';`;
            cy.task("connectDB", query).then(result => {
                console.log("result",result);
                expect(result[0].sell_id).to.be.equal(orden);
            });
        });
        cy.log('Productos comprados y orden verificada en la BD');
    });
});