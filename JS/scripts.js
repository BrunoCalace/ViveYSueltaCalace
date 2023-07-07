const shopContent = document.getElementById("shopContent")
const verCarrito = document.getElementById("verCarrito")
const modalContainer = document.getElementById("modal-container")
const cantCarrito = document.getElementById("cantCarrito")

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch('data.json')
.then( (res) => res.json())
.then( (data) => {
    
    data.forEach((product) =>{
        let content = document.createElement("div");
        content.className = "card";
        let cat = product.cat;
        content.classList.add(cat);
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
            carritoCounter();
            saveLocal();
        });
    });
})

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
            <span class="delete-product"><img src="Productos/tachoDeBasura.png"></span>
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

        let eliminar = carritoContent.querySelector(".delete-product");

        eliminar.addEventListener("click", () => {
            eliminarProducto(product.id);
        })
    });
    
    const total = carrito.reduce((acc, el) => acc + (el.precio*el.cant), 0);
    
    const totalCompra = document.createElement("div");
    totalCompra.className = "total-content";
    totalCompra.innerHTML = `
    <p>Total a pagar: $ ${total}</p>
    <button class="comprarFin">Comprar</button>
    `;

    modalContainer.append(totalCompra);

    const comprarFinButton = document.querySelector(".comprarFin");

    comprarFinButton.addEventListener("click", () => {
        
        Swal.fire({
            title: "¡Gracias por tu compra!",
            text: "El pedido se ha procesado correctamente.",
            icon: "success",
            confirmButtonColor: "rgb(248, 129, 129)",
            confirmButtonText: "Aceptar",
        });    
        carrito = [];
        saveLocal();
        carritoCounter();
        pintarCarrito();
        modalContainer.style.display = "none";
    });
};

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id);

    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId;
    });

    saveLocal();
    carritoCounter();
    pintarCarrito();
};

const carritoCounter = () => {
    if(carrito.length > 0){
        cantCarrito.style.display = "block"
        cantCarrito.innerText = carrito.length;
    }else{
        cantCarrito.style.display = "none"
    }
}

window.onload = () => {
    filtrarProducto("todo");
};

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

const saveLocal = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

carritoCounter();