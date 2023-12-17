const deleteBtn = document.getElementById("deleteUser__btn");
const uid = deleteBtn.value;

deleteBtn.addEventListener("click", () => {
  deleteUser(uid);
});

const deleteUser = async (uid) => {
  try {
    const response = await fetch(`/api/users/delete/${uid}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      alert("User deleted");
    }
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------------------------------------------

function modifyUserRole(userId) {
  const radioSeleccionado = document.querySelector(
    'input[name="role"]:checked'
  );

  if (radioSeleccionado) {
    const valorSeleccionado = radioSeleccionado.value;
    changeRole(userId, valorSeleccionado);
  }
}

const changeRole = async (userId, role) => {
  try {
    const response = await fetch(`/api/users/${userId}/role/${role}`, {
      method: "PUT",
    });

    if (response.status === 200) {
      alert("Role changed");
    }
  } catch (error) {
    console.log(error);
  }
};
