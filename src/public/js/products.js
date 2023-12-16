const addToCartBtn = document.getElementById("addProduct__btn");
const pid = addToCartBtn.value;
const cid = document.getElementById("cart_id").innerHTML;

const addToCart = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.status === 200) {
      alert("Product added to cart");
    }
  } catch (error) {
    console.log(error);
  }
};

addToCartBtn.addEventListener("click", () => {
  addToCart(cid, pid);
});

const deleteToCartBtn = document.getElementById("deleteProduct__btn");
const pid2 = deleteToCartBtn.value;

const deleteProduct = async (pid2) => {
  try {
    const response = await fetch(`/api/products/${pid2}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (result.payload.deletedCount == 1) {
      alert("Product deleted");
    }
  } catch (error) {
    console.log(error);
  }
};

deleteToCartBtn.addEventListener("click", () => {
  deleteProduct(pid);
});
