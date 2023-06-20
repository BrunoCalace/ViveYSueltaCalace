const productos = [
    {id:1, nom: "bolso negro", precio: 7500, img:'Productos/bolso1.jpg', cant: 1,},
    {id:2, nom: "bolso marron", precio: 8500, img:'Productos/bolso2.jpg', cant: 1},
    {id:3, nom: "cartera cuero", precio: 6500, img:'Productos/cartera1.jpg', cant: 1},
    {id:4, nom: "cartera colores", precio: 10000, img:'Productos/cartera2.jpg', cant: 1},
    {id:5, nom: "cartera azul", precio: 12000, img:'Productos/cartera3.jpg', cant: 1},
    {id:6, nom: "cinto marron", precio: 2500, img:'Productos/cinto2.jpg', cant: 1},
    {id:7, nom: "cinto negro", precio: 2500, img:'Productos/cinto3.jpg', cant: 1},
    {id:8, nom: "cinturon caballo", precio: 3000, img:'Productos/cinto4.jpg', cant: 1},
    {id:9, nom: "mochila mediana", precio: 13500, img:'Productos/mochila2.jpg', cant: 1},
    {id:10, nom: "mochila purpura", precio: 14500, img:'Productos/mochila3.jpg', cant: 1},
    {id:11, nom: "panchas beige", precio: 16500, img:'Productos/panchas1.jpg', cant: 1},
    {id:12, nom: "panchas negras", precio: 15500, img:'Productos/panchas2.jpg', cant: 1},
    {id:13, nom: "sandalias rojas", precio: 12500, img:'Productos/sandalia5.jpg', cant: 1},
    {id:14, nom: "sandalias negras", precio: 12500, img:'Productos/sandalias2.jpg', cant: 1},
    {id:15, nom: "sandalias marrones", precio: 12500, img:'Productos/sandalia7.jpg', cant: 1},
]
const shopContent = document.getElementById("shopContent")
const verCarrito = document.getElementById("verCarrito")
const modalContainer = document.getElementById("modal-container")
const cantCarrito = document.getElementById("cantCarrito")

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

productos.forEach((product) =>{
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
        <img class="card-img" src="${product.img}">
        <h3 class="card-nom">${product.nom}</h3>
        <p class="card-price">$ ${product.precio}</p>
    `;

    shopContent.append(content);

    let comprar = document.createElement("button");
    comprar.innerText= "Agregar al carrito";
    comprar.className = "card-btn";

    content.append(comprar);
    
    comprar.addEventListener("click", () =>{

        const repeat = carrito.some((repeatProduct) => repeatProduct.id === product.id);
        
        if(repeat){
            
        }else {
            carrito.push({
                id: product.id,
                img: product.img,
                nom: product.nom,
                precio: product.precio,
                cant: product.cant,
            });
        }
        console.log(carrito);
        carritoCounter();
        saveLocal();
    });
});

//Carrito
const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
        <h1 class="modal-header-title">Carrito</h1>
    `;
    modalContainer.append(modalHeader);
    
    const modalButton = document.createElement("h1");
    modalButton.innerText = "X";
    modalButton.className = "modal-header-button";
    
    modalButton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    })
    
    modalHeader.append(modalButton);
    
    carrito.forEach((product) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "modal-content";
        carritoContent.innerHTML = `
        <img src="${product.img}">
        <h3>${product.nom}</h3>
        <span class="restar"> - </span>
        <p>${product.cant}</p>
        <span class="sumar"> + </span>
        <p>$ ${product.precio}</p>
        `;
    
        modalContainer.append(carritoContent);

        let restar = carritoContent.querySelector(".restar");

        restar.addEventListener("click", ()=>{
            if(product.cant > 1)
            {
                product.cant--;
                saveLocal();
                pintarCarrito();
            }
        })

        let sumar = carritoContent.querySelector(".sumar");

        sumar.addEventListener("click", ()=>{
            product.cant++;
            saveLocal();
            pintarCarrito();
        })
    
        let eliminar = document.createElement("span");
        eliminar.innerHTML = `<img src="Productos/tachoDeBasura.png">`;
        eliminar.className = "delete-product";
        carritoContent.append(eliminar);
    
        eliminar.addEventListener("click", eliminarProducto);
    });
    
    const total = carrito.reduce((acc, el) => acc + (el.precio*el.cant), 0);
    
    const totalCompra = document.createElement("div");
    totalCompra.className = "total-content";
    totalCompra.innerHTML = `Total a pagar: $ ${total}`;
    modalContainer.append(totalCompra);
};

verCarrito.addEventListener("click", pintarCarrito);

//Eliminar producto de carrito
const eliminarProducto = () => {
    const foundId = carrito.find((element) => element.id);
    console.log(foundId)

    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId;
    });

    saveLocal();
    carritoCounter();
    pintarCarrito();
};

//Numero carrito
const carritoCounter = () => {
    if(carrito.length > 0){
        cantCarrito.style.display = "block"
        cantCarrito.innerText = carrito.length;
    }else{
        cantCarrito.style.display = "none"
    }
}

//Cuando carga pagina que aparezcan todos los productos

window.onload = () => {
    filtrarProducto("todo");
};

//Funcion filtro
function filtrarProducto(value) {
    let buttons = document.querySelectorAll(".boton-filtro");
    buttons.forEach(button => {
        if(value.toUpperCase() == button.innerText.toUpperCase()){
            button.classList.add("active");
        }
        else{
            button.classList.remove("active");
        }
    });

    let elements = document.querySelectorAll(".card");

    elements.forEach((element) => {
        if(value == "todo"){
            element.classList.remove("hide");
        }
        else{
            if(element.classList.contains(value)){
                element.classList.remove("hide");
            }
            else{
                element.classList.add("hide");
            }
        }
    });
}

//Set item
const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

carritoCounter();