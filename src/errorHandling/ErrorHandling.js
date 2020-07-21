import toastr from "toastr";

export const handleError = (error, position, timeout, type) => {
  toastr.options = { positionClass: position, timeOut: timeout };
  toastr[type](error);
};
