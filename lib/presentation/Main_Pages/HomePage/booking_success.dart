import 'package:flutter/material.dart';

class BookingSuccessScreen extends StatelessWidget {
  final String futsalName;
  final String timeSlot;
  final DateTime day;
  final double amount;
  final String transactionId;

  const BookingSuccessScreen({
    super.key,
    required this.futsalName,
    required this.timeSlot,
    required this.day,
    required this.amount,
    required this.transactionId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.green.shade50,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 48),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.check_circle, size: 100, color: Colors.green),
              const SizedBox(height: 24),
              const Text(
                "Booking Confirmed!",
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.green),
              ),
              const SizedBox(height: 12),
              Text(
                futsalName,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w600),
              ),
              const SizedBox(height: 6),
              Text(
                "${day.toLocal().toString().split(' ')[0]} • $timeSlot",
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 12),
              Text(
                "Paid NPR ${amount.toStringAsFixed(2)}",
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w500),
              ),
              const SizedBox(height: 8),
              Text(
                "Txn ID: $transactionId",
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () {
                  Navigator.popUntil(context, (route) => route.isFirst);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Back to Home", style: TextStyle(fontSize: 16)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
