interface Window {
  $message: MessageApiInjection;
  $notification: NotificationApiInjection;
  $dialog: DialogApiInjection;
  [key: string]: any
}
