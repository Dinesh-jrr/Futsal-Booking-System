import 'package:flutter/material.dart';

class MyPaymentsScreen extends StatelessWidget {
  const MyPaymentsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Payments'),
        backgroundColor: Colors.green,
      ),
      body: const Center(
        child: Text('My Payments Page'),
      ),
    );
  }
}
