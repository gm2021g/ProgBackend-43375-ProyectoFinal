const deleteBtns = Array.from(
  document.querySelectorAll("#cart__product--deleteBtn")
);

const deleteProduct = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.status === 200) {
      alert("Producto eliminado correctamente");
    }
  } catch (error) {
    console.log(error);
  }
};

const cid = document.getElementById("purchase__btn").value;

deleteBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const pid = btn.value;

    deleteProduct(cid, pid);
    location.reload();
  });
});

const purchaseBtn = document.getElementById("purchase__btn");

purchaseBtn.addEventListener("click", () => {
  purchaseCart(cid);
});

const purchaseCart = async (cid) => {
  try {
    const response = await fetch(`/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.status === 200) {
      alert(`Successful purchase with the ticket ${result.payload.code}`);
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};

const emptyBtn = document.getElementById("empty__btn");

emptyBtn.addEventListener("click", () => {
  emptyCart(cid);
});

const emptyCart = async (cid) => {
  try {
    console.log(cid);
    const response = await fetch(
      `
    
    /${cid}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      alert(`The cart is empty`);
      location.reload();
    }
  } catch (error) {
    console.log(error);
  }
};
