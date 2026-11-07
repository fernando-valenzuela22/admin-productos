describe("Admin de Productos", () => {
  // Antes de cada prueba: abrir la pagina con el navegador limpio
  // (sin sesion ni productos guardados de una prueba anterior)
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear()
      },
    })
  })

  // Pasos de login que reutilizan las demas pruebas
  function iniciarSesion() {
    cy.get("#usuario").type("admin")
    cy.get("#clave").type("1234")
    cy.get("#btn-login").click()
  }

  it("1. Inicia sesion y muestra el panel de administracion", () => {
    // Escribir usuario y contrasena, y presionar "Entrar"
    cy.get("#usuario").type("admin")
    cy.get("#clave").type("1234")
    cy.get("#btn-login").click()

    // El panel de administracion se ve y el formulario de login ya no
    cy.get("#admin").should("be.visible")
    cy.contains("h1", "Administracion de Productos").should("be.visible")
    cy.get("#login").should("not.be.visible")
  })

  it("2. Agrega un producto y aparece en la tabla", () => {
    iniciarSesion()

    // Esperar a que carguen los 5 productos iniciales
    cy.get(".fila-producto").should("have.length", 5)

    // Llenar el formulario y presionar "Agregar producto"
    cy.get("#nombre").type("Webcam")
    cy.get("#precio").type("250")
    cy.get("#stock").type("8")
    cy.get("#btn-guardar").click()

    // Ahora hay 6 productos y la ultima fila es la Webcam con sus datos
    cy.get(".fila-producto").should("have.length", 6)
    cy.get(".fila-producto").last()
      .should("contain", "Webcam")
      .and("contain", "Q250")
      .and("contain", "8")
    cy.get("#contador-productos").should("have.text", "6")
  })

  it("3. No permite agregar un producto con precio 0", () => {
    iniciarSesion()

    // Esperar a que carguen los 5 productos iniciales
    cy.get(".fila-producto").should("have.length", 5)

    // Intentar agregar un producto con precio 0
    cy.get("#nombre").type("Cable HDMI")
    cy.get("#precio").type("0")
    cy.get("#stock").type("3")
    cy.get("#btn-guardar").click()

    // Sale el mensaje de error y la tabla sigue con 5 productos
    cy.get("#form-msg")
      .should("be.visible")
      .and("have.text", "El precio debe ser un numero mayor que 0.")
    cy.get(".fila-producto").should("have.length", 5)
    cy.get("#tabla-productos").should("not.contain", "Cable HDMI")
  })
})
