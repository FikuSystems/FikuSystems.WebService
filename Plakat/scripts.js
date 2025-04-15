function openNav() {
  const sidebar = document.getElementById("mySidebar");
  const hiddenButton = document.getElementById("sideBarHidden");

  if (sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
      hiddenButton.style.display = "inline-block";
  } else {
      sidebar.classList.add("show");
      hiddenButton.style.display = "none";
  }
}
