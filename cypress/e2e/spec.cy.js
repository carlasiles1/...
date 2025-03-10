describe('MarvelHome Page', () => {

  // Prueba para verificar que la página carga correctamente
  it('debe cargar la página MarvelHome ', () => {
    cy.visit('http://localhost:5173/'); // Visita la página principal
    
  });

  // Verifica que el footer inicialmente no es visible
  it('El footer debe estar oculto al cargar la página', () => {
    cy.visit('http://localhost:5173/'); // Visita la página principal
    cy.get('footer').should('not.have.class', 'footer--show'); // Verifica que el footer no tenga la clase 'footer--show' (oculto inicialmente)
  });

  // Verifica que el footer aparece cuando el ratón se mueve hacia abajo
  it('El footer debe aparecer cuando el ratón se mueve hacia abajo', () => {
    cy.visit('http://localhost:5173/');
    
    // Simula mover el ratón hacia la parte inferior de la página (a 100px del fondo)
    cy.get('body').trigger('mousemove', { clientY: 800 }); // Ajusta el valor si es necesario
    
    // Verifica que el footer tenga la clase 'footer--show' (debería aparecer)
    cy.get('footer').should('have.class', 'footer--show');
  });

  // Verifica que el footer desaparece si el ratón se mueve lejos de la parte inferior
  it('El footer debe desaparecer cuando el ratón se aleja de la parte inferior', () => {
    cy.visit('http://localhost:5173/');
    
    // Simula mover el ratón hacia arriba (fuera del área donde se activa el footer)
    cy.get('body').trigger('mousemove', { clientY: 200 }); // Ajusta el valor si es necesario

    // Verifica que el footer no tenga la clase 'footer--show' (debería desaparecer)
    cy.get('footer').should('not.have.class', 'footer--show');
  });

});
