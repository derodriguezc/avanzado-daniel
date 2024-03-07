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
        cy.fixture('create-product-0001/user-login.json').then((data) => {
            cy.getByDataCy('registertoggle').dblclick();
            cy.getByDataCy('user').type(data.user);
            cy.getByDataCy('pass').type(data.pass);
            cy.getByDataCy('submitForm').click();
            cy.contains('Welcome pushingit').should('be.visible');
            cy.log('Login exitoso')
            cy.getByDataCy('onlineshoplink').click();
            cy.getByDataCy('add-product').click();
            cy.fixture('create-product-0001/product.json').then((product) => {
                cy.getByDataCy('productName').type(product.productName);
                cy.getByDataCy('productPrice').type(product.productPrice);
                cy.getByDataCy('productCard').type(product.productImageUrl);
                cy.getByDataCy('productID').type(product.id);
                cy.getByDataCy('createProduct').click();
                cy.contains(product.productName + ' has been added');
                cy.get('#closeModal').click();
                cy.log('producto agregado correctamente');

                cy.getByDataCy('search-type').select('ID');
                cy.getByDataCy('search-bar').type(product.id + '{enter}');
                cy.contains(product.productName).should('be.visible');
                cy.contains(product.productPrice).should('be.visible');
                cy.log('Producto encontrado correctamente');

                cy.getByDataCy('delete-' + product.id).click();
                cy.contains('Deleting Product').should('be.visible');
                cy.get('#saveEdit').click();
                cy.contains(product.productName + ' has been deleted');
                cy.get('#closeModal').click();
                cy.log('Producto eliminado correctamente');

                cy.getByDataCy('search-bar').clear().type(product.id + '{enter}').wait(1000);
                cy.contains(product.productName).should('not.exist');
                cy.contains(product.productPrice).should('not.exist');
                cy.log('Producto no encontrado correctamente');
            });
        });
    });
});