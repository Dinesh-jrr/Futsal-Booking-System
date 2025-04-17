import 'package:flutter/material.dart';
import 'package:another_flushbar/flushbar.dart';

void showToast({
  required BuildContext context,
  required String message,
  Color backgroundColor = Colors.green,
  IconData icon = Icons.check_circle,
}) {
  // ignore: avoid_single_cascade_in_expression_statements
  Flushbar(
    message: message,
    duration: const Duration(seconds: 3),
    backgroundColor: backgroundColor,
    icon: Icon(icon, color: Colors.white),
    margin: const EdgeInsets.all(8),
    borderRadius: BorderRadius.circular(8),
    flushbarPosition: FlushbarPosition.TOP,
    animationDuration: const Duration(milliseconds: 300),
  )..show(context);
}
