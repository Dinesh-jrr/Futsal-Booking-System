import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';

class MyPaymentsScreen extends StatefulWidget {
  const MyPaymentsScreen({super.key});

  @override
  State<MyPaymentsScreen> createState() => _MyPaymentsScreenState();
}

class _MyPaymentsScreenState extends State<MyPaymentsScreen> {
  List<Payment> payments = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchPayments();
  }

  Future<void> fetchPayments() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');
      if (token == null) throw Exception("Token not found");

      final userRes = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/users/me"),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (userRes.statusCode != 200) throw Exception("Failed to fetch user");
      final user = jsonDecode(userRes.body);
      final userId = user['_id'];

      final paymentRes = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/payment/user/$userId"),
      );

      if (paymentRes.statusCode == 200) {
        final jsonData = jsonDecode(paymentRes.body);
        final List<dynamic> paymentList = jsonData['payments'];

        setState(() {
          payments = paymentList.map((p) {
            print("Payment status from API: ${p['status']}");
            final booking = p['booking'];
            return Payment(
              futsalName: booking?['futsalName'] ?? 'Unknown',
              date: p['createdAt'].toString().split('T')[0],
              amount: double.tryParse(p['amount'].toString()) ?? 0,
              method: p['paymentGateway'] ?? 'Cash',
              status: _mapStatus(p['status']),
            );
          }).toList();
          isLoading = false;
        });
      } else {
        throw Exception("Failed to fetch payments");
      }
    } catch (e) {
      print("Error: $e");
      setState(() => isLoading = false);
    }
  }

  PaymentStatus _mapStatus(String? status) {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'pending': // ✅ Treat both as "Complete"
        return PaymentStatus.success;
      case 'failed':
        return PaymentStatus.failed;
      default:
        return PaymentStatus.success;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Payments'),
        backgroundColor: Colors.green,
        centerTitle: true,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : payments.isEmpty
              ? const Center(
                  child: Text(
                    'No payments found',
                    style: TextStyle(fontSize: 18, color: Colors.grey),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: payments.length,
                  itemBuilder: (context, index) {
                    return PaymentCard(payment: payments[index]);
                  },
                ),
    );
  }
}

// -- Payment Model and UI --
class Payment {
  final String futsalName;
  final String date;
  final double amount;
  final String method;
  final PaymentStatus status;

  const Payment({
    required this.futsalName,
    required this.date,
    required this.amount,
    required this.method,
    required this.status,
  });
}

enum PaymentStatus { success, pending, failed }

class PaymentCard extends StatelessWidget {
  final Payment payment;

  const PaymentCard({required this.payment, super.key});

  Color getStatusColor() {
    switch (payment.status) {
      case PaymentStatus.success:
        return Colors.green;
      case PaymentStatus.pending:
        return Colors.orange;
      case PaymentStatus.failed:
        return Colors.red;
    }
  }

  IconData getStatusIcon() {
    switch (payment.status) {
      case PaymentStatus.success:
        return Icons.check_circle;
      case PaymentStatus.pending:
        return Icons.hourglass_top;
      case PaymentStatus.failed:
        return Icons.cancel;
    }
  }

  String getStatusText() {
    switch (payment.status) {
      case PaymentStatus.success:
        return 'Complete'; // ✅ Show "Complete" always for success/pending
      case PaymentStatus.pending:
        return 'Pending';
      case PaymentStatus.failed:
        return 'Failed';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 10),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(payment.futsalName,
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(payment.date,
                    style: const TextStyle(fontSize: 14, color: Colors.grey)),
                const Spacer(),
                Text('Rs ${payment.amount.toStringAsFixed(0)}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.green)),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.payment, size: 16, color: Colors.grey),
                    const SizedBox(width: 6),
                    Text(payment.method,
                        style: const TextStyle(fontSize: 14, color: Colors.black87)),
                  ],
                ),
                Chip(
                  backgroundColor: getStatusColor().withOpacity(0.15),
                  label: Row(
                    children: [
                      Icon(getStatusIcon(), color: getStatusColor(), size: 18),
                      const SizedBox(width: 6),
                      Text(getStatusText(),
                          style: TextStyle(
                              color: getStatusColor(), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
