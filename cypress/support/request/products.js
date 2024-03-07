/*
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
*/