// ignore_for_file: sort_child_properties_last

import 'package:flutter/material.dart';

class CashPaymentScreen extends StatelessWidget {
  final double amount; // amount to pay, optional to display

  const CashPaymentScreen({required this.amount, Key? key}) : super(key: key);

  void _showConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Cash Payment'),
        content: Text('Are you sure you want to pay \$${amount.toStringAsFixed(2)} by cash?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cash payment confirmed')),
              );
              Navigator.pop(context); // Go back or wherever you want
            },
            child: const Text('Yes'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cash Payment')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Please pay the remaining amount of \NPR ${amount.toStringAsFixed(2)} in cash to the futsal owner.',
              style: const TextStyle(fontSize: 18),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () => _showConfirmationDialog(context),
              child: const Text('Confirm Cash Payment'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
