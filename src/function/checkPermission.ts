interface RoleAction {
  check_action: number;
  action_code: string;
}

const CheckPermission = (permission: RoleAction[], action: string) => {
  console.log(permission, action);
  const thisPermission = permission.find((p) => p.action_code === action);

  if (thisPermission?.check_action == 1) {
    return false;
  } else {
    return true;
  }
};

export default CheckPermission;
