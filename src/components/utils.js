export function checkForAdmin() {
  const roles = sessionStorage.getItem("roles")?.split(",");
  let isAdmin = false;
  roles?.map((role) => {
    //ignoring the case sensitive comparison
    if (role.localeCompare("admin", undefined, { sensitivity: "base" }) === 0) {
      isAdmin = true;
    }
  });

  return isAdmin;
}
