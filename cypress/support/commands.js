// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// import sqlServer from 'cypress-sql-server';
// sqlServer.loadDBCommands(); SQL SERVER

Cypress.Commands.add('getByDataCy', (selector) => {
    return cy.get(`[data-cy=${selector}]`)
})

Cypress.Commands.add('login', (usuario, password) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/login`,
        body: {
            username: usuario,
            password: password
        },
    }).then(respuesta => {
        window.localStorage.setItem('token', respuesta.body.token);
        window.localStorage.setItem('user', respuesta.body.user.username);
        window.localStorage.setItem('userId', respuesta.body.user._id);
        Cypress.env().token = respuesta.body.token;
    });
});

Cypress.Commands.add('getProductByName', (productName) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products`,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        },
        qs: {
            name: productName
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
    });
});

Cypress.Commands.add('deleteProductIfExists', (product_id) => {
    if (!product_id) {
        cy.log('No hay ningún producto para eliminar.');
        return;
    }
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/product/${product_id}`,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        },
        failOnStatusCode: false
    }).then((getResponse) => {
        if (getResponse.status === 200) {
            cy.request({
                method: "DELETE",
                url: `${Cypress.env().baseUrlAPI}/product/${product_id}`,
                headers: {
                    Authorization: `Bearer ${Cypress.env().token}`
                },
            }).then((deleteResponse) => {
                expect(deleteResponse.status).to.eq(202);
            });
        } else if (getResponse.status === 404) {
            cy.log(`El producto con ID ${product_id} no existe.`);
        } else {
            throw new Error(`Error al verificar el producto: ${getResponse.status}`);
        }
    });
});

Cypress.Commands.add('deleteProduct', (id) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "DELETE",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`,
            }
        });
    });

});

Cypress.Commands.add('createProduct', (product) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/create-product`,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        },
        body: {
            id: product.id,
            name: product.name,
            img: product.image,
            price: product.price
        },
    }).then((response) => {
        expect(response.status).to.eq(201);
    });
});

Cypress.Commands.add('editProduct', (productId, product) => {
    cy.request({
        method: "PUT",
        url: `${Cypress.env().baseUrlAPI}/product/${productId}`,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        },
        body: {
            name: product.name,
            img: product.image,
            price: product.price
        },
    }).then((response) => {
        expect(response.status).to.eq(202);
    });
});

Cypress.Commands.add('checkBillingSummary', (totalPriceProduct1, totalPriceProduct2) => {
    cy.get(totalPriceProduct1).then(totalPrice1 => {
        cy.get(totalPriceProduct2).then(totalPrice2 => {
            cy.get('[data-cy="totalPriceAmount"]').invoke('text').then(totalPriceSummary => {
                let totalPriceSummaryNumerico = parseFloat(totalPriceSummary.replace('$', ''));
                expect(totalPriceSummaryNumerico).to.be.equal(totalPrice1 + totalPrice2);
            });
        });
    });
});