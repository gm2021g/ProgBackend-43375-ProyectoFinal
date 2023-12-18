const deleteUserInactBtn = document.getElementById("deleteUserInactivity__btn");
deleteUserInactBtn.addEventListener("click", () => {
  deleteUserInact();
});

const deleteUserInact = async () => {
  try {
    const response = await fetch(`/api/users/delete`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      alert("Users inactive deleted");
    }
  } catch (error) {
    console.log(error);
  }
};
