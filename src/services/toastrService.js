import toastr from 'toastr';

// Configure toastr options
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};

export const toastrService = {
  success: (message, title = '') => {
    toastr.success(message, title);
  },

  error: (message, title = 'Error') => {
    toastr.error(message, title);
  },

  warning: (message, title = 'Warning') => {
    toastr.warning(message, title);
  },

  info: (message, title = 'Info') => {
    toastr.info(message, title);
  },

  clear: () => {
    toastr.clear();
  }
};