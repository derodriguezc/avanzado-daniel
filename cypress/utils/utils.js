export function getSelector(dataCyValue) {
    return cy.get(`[data-cy="${dataCyValue}"]`);
}
