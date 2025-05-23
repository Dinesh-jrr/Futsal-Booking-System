// ignore_for_file: avoid_print, use_build_context_synchronously

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/core/config/constants.dart';
import 'package:player/presentation/Main_Pages/HomePage/esewa.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Model classes for eSewa response (if needed later)
class EsewaPaymentSuccessResponse {
  final String productId;
  final String productName;
  final String totalAmount;
  final String code;
  final Message message;
  final TransactionDetails transactionDetails;
  final String merchantName;

  EsewaPaymentSuccessResponse({
    required this.productId,
    required this.productName,
    required this.totalAmount,
    required this.code,
    required this.message,
    required this.transactionDetails,
    required this.merchantName,
  });

  factory EsewaPaymentSuccessResponse.fromJson(Map<String, dynamic> json) {
    return EsewaPaymentSuccessResponse(
      productId: json['productId'],
      productName: json['productName'],
      totalAmount: json['totalAmount'],
      code: json['code'],
      message: Message.fromJson(json['message']),
      transactionDetails: TransactionDetails.fromJson(json['transactionDetails']),
      merchantName: json['merchantName'],
    );
  }
}
//success messsage

class Message {
  final String technicalSuccessMessage;
  final String successMessage;

  Message({required this.technicalSuccessMessage, required this.successMessage});

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      technicalSuccessMessage: json['technicalSuccessMessage'],
      successMessage: json['successMessage'],
    );
  }
}

class TransactionDetails {
  final String date;
  final String referenceId;
  final String status;

  TransactionDetails({
    required this.date,
    required this.referenceId,
    required this.status,
  });

  factory TransactionDetails.fromJson(Map<String, dynamic> json) {
    return TransactionDetails(
      date: json['date'],
      referenceId: json['referenceId'],
      status: json['status'],
    );
  }
}

class BookNow extends StatelessWidget {
  final String futsalName;
  final DateTime selectedDay;
  final String? selectedTimeSlot;
  final double totalCost;
  final String futsalId;
  // final String userId;

  const BookNow({
    super.key,
    required this.futsalName,
    required this.selectedDay,
    required this.selectedTimeSlot,
    required this.totalCost,
    required this.futsalId,
    // required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    double advancePayment = totalCost * 0.2;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Booking Details"),
        backgroundColor: Colors.green,
        elevation: 0,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                _buildSectionHeader('Futsal Information'),
                _buildInfoCard(
                  title: 'Futsal: $futsalName',
                  subtitle: 'Date: ${selectedDay.toLocal().toString().split(' ')[0]}',
                  content: 'Time: $selectedTimeSlot',
                ),
                const SizedBox(height: 16),
                _buildSectionHeader('Cost Breakdown'),
                _buildCostCard(
                  totalCost: totalCost,
                  advancePayment: advancePayment,
                ),
                const SizedBox(height: 16),
                _buildSectionHeader('Payment'),
                _buildPaymentConfirmation(context, advancePayment),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.bold,
          color: Colors.green,
        ),
      ),
    );
  }

  Widget _buildInfoCard({required String title, required String subtitle, required String content}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(subtitle, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text(content, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }

  Widget _buildCostCard({required double totalCost, required double advancePayment}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      color: Colors.green[50],
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('Total Cost: NPR ${totalCost.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text('Advance Payment (20%): NPR ${advancePayment.toStringAsFixed(2)}', style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }

 Widget _buildPaymentConfirmation(BuildContext context, double advancePayment) {
  return Card(
    elevation: 4,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    child: Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Text('You are paying', style: TextStyle(fontSize: 16)),
          const SizedBox(height: 8),
          Text(
            'NPR ${advancePayment.toStringAsFixed(2)}',
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () async {
                // ✅ Get user ID from SharedPreferences
                // final prefs = await SharedPreferences.getInstance();
                // final userId = prefs.getString('user_id');

                // if (userId != null) {
                //   ScaffoldMessenger.of(context).showSnackBar(
                //     const SnackBar(content: Text("User not logged in")),
                //   );
                //   return;
                // }

                // You might want to generate a booking ID here (if needed) or send to backend to get it
                // final bookingId = "booking-${DateTime.now().millisecondsSinceEpoch}";
                SharedPreferences prefs = await SharedPreferences.getInstance();
                String? token = prefs.getString('auth_token');
                print("calling/users/me");

              final response = await http.get(
                Uri.parse('${AppConfig.baseUrl}/api/users/me'),
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ${token ?? ''}',  // Use empty string if token is null
                },
              );


                final Map<String, dynamic> responseBody = json.decode(response.body);
                final String userId = responseBody['_id'];

                // ✅ Now proceed with payment
                Esewa esewa = Esewa(
                  // bookingId: bookingId,
                  futsalName: futsalName,
                  selectedDay: selectedDay,
                  selectedTimeSlot: selectedTimeSlot,
                  advancePayment: advancePayment,
                  userId: userId,
                  futsalId:futsalId,
                  totalCost: totalCost,
                  // userId: userId,
                );

                esewa.pay(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 24.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
              ),
              child: const Text(
                "Pay with eSewa",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

}
