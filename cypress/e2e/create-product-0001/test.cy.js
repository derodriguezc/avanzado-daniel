const utils = require('../../utils/utils');
const directorioName = __dirname.replaceAll('\\', '/');
const module = directorioName.split(/[/]/)[2]
const scenarioName = directorioName.slice(directorioName.lastIndexOf('/') + 1).split('-').slice(0, -1).join('-');
const testCaseId = directorioName.split(/[-]/).pop();

describe(`${scenarioName} - ${module} `, () => {

    before(() => {
        cy.visit('/');
    });

    it('Deberia permitir al usuario crear  un producto', () => {
        cy.get('.chakra-image').should('be.visible');
        cy.fixture('user-login.json').then((data) => {
            utils.getSelector('registertoggle').dblclick();
            utils.getSelector('user').type(data.user);
            utils.getSelector('pass').type(data.pass);
            utils.getSelector('submitForm').click();
            cy.contains('Welcome pushingit').should('be.visible');
            cy.log('Login exitoso')
            utils.getSelector('onlineshoplink').click();
            utils.getSelector('add-product').click();
            cy.fixture('product.json').then((product) => {
                utils.getSelector('productName').type(product.productName);
                utils.getSelector('productPrice').type(product.productPrice);
                utils.getSelector('productCard').type(product.productImageUrl);
                utils.getSelector('productID').type(product.id);
                utils.getSelector('createProduct').click();
                cy.contains(product.productName + ' has been added');
                cy.get('#closeModal').click();
                cy.log('producto agregado correctamente');

                utils.getSelector('search-type').select('ID');
                utils.getSelector('search-bar').type(product.id + '{enter}');
                cy.contains(product.productName).should('be.visible');
                cy.contains(product.productPrice).should('be.visible');
                cy.log('Producto encontrado correctamente');

                utils.getSelector('delete-' + product.id).click();
                cy.contains('Deleting Product').should('be.visible');
                cy.get('#saveEdit').click();
                cy.contains(product.productName + ' has been deleted');
                cy.get('#closeModal').click();
                cy.log('Producto eliminado correctamente');

                utils.getSelector('search-bar').clear().type(product.id + '{enter}').wait(1000);
                cy.contains(product.productName).should('not.exist');
                cy.contains(product.productPrice).should('not.exist');
                cy.log('Producto no encontrado correctamente');
            });
        });
    });
});