angular.module('inboxServices').factory('ResourceIcons', [
  'DB',
  function(DB) {
    return DB.get()
      .get('resources', { attachments: true });
  }
]);
