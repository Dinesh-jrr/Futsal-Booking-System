import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:esewa_flutter_sdk/esewa_flutter_sdk.dart'; // Corrected import
import 'package:esewa_flutter_sdk/esewa_config.dart';
import 'package:esewa_flutter_sdk/esewa_payment.dart';
import 'package:esewa_flutter_sdk/esewa_payment_success_result.dart';
import 'package:http/http.dart' as http;

// Define the response structure for eSewa transaction verification
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

  // Method to parse the JSON response
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

  const BookNow({
    Key? key,
    required this.futsalName,
    required this.selectedDay,
    required this.selectedTimeSlot,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    double totalCost = 1000.00; // Example cost
    double advancePayment = totalCost * 0.2;

    return Scaffold(
      appBar: AppBar(
        title: Text("Booking Details"),
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
                SizedBox(height: 16),
                _buildSectionHeader('Cost Breakdown'),
                _buildCostCard(
                  totalCost: totalCost,
                  advancePayment: advancePayment,
                ),
                SizedBox(height: 16),
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
        style: TextStyle(
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
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(subtitle, style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text(content, style: TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }

  Widget _buildCostCard({required double totalCost, required double advancePayment}) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      color: Colors.green[50],
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('Total Cost: NPR ${totalCost.toStringAsFixed(2)}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Advance Payment (20%): NPR ${advancePayment.toStringAsFixed(2)}', style: TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentConfirmation(BuildContext context, double advancePayment) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text('You are paying', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('NPR ${advancePayment.toStringAsFixed(2)}', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  handlePayment(context, advancePayment);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  padding: const EdgeInsets.symmetric(vertical: 24.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                child: const Text(
                  "Pay with eSewa",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> handlePayment(BuildContext context, double amount) async {
    try {
      // Initialize eSewa SDK with your client ID, secret key, and environment
      EsewaFlutterSdk.initPayment(
        esewaConfig: EsewaConfig(
          environment: Environment.test, // Use Environment.live for production
          clientId: "YourClientID", // Replace with your client ID
          secretId: "YourSecretKey", // Replace with your secret key
        ),
        esewaPayment: EsewaPayment(
          productId: "1d71jd81", // Unique booking ID
          productName: "Futsal Booking",
          productPrice: amount.toString(),
          callbackUrl: "https://your-backend.com/payment/callback",
        ),
        onPaymentSuccess: (EsewaPaymentSuccessResult data) {
          debugPrint(":::SUCCESS::: => $data");
          verifyTransactionStatus(data);
        },
        onPaymentFailure: (data) {
          debugPrint(":::FAILURE::: => $data");
        },
        onPaymentCancellation: (data) {
          debugPrint(":::CANCELLATION::: => $data");
        },
      );
    } on Exception catch (e) {
      debugPrint("EXCEPTION : ${e.toString()}");
    }
  }

  void verifyTransactionStatus(EsewaPaymentSuccessResult result) async {
    try {
      var response = await callVerificationApi(result);

      if (response.statusCode == 200) {
        var map = jsonDecode(response.body);
        final sucResponse = EsewaPaymentSuccessResponse.fromJson(map);

        debugPrint("Response Code => ${sucResponse.code}");
        debugPrint("Merchant Name => ${sucResponse.merchantName}");
        debugPrint("Transaction Status => ${sucResponse.transactionDetails.status}");

        if (sucResponse.transactionDetails.status == 'COMPLETE') {
          await updateBookingStatus();
        } else {
          debugPrint("Payment Verification Failed");
        }
      } else {
        debugPrint("Transaction Verification API failed with status: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("Transaction Verification Failed: $e");
    }
  }

  Future<http.Response> callVerificationApi(EsewaPaymentSuccessResult result) async {
    final url = Uri.parse('https://rc.esewa.com.np/mobile/transaction?txnRefId=${result.refId}');

    final response = await http.get(
      url,
      headers: {
        "merchantId": "your_merchant_id", // Your actual merchant ID
        "merchantSecret": "your_merchant_secret", // Your actual merchant secret
        "Content-Type": "application/json",
      },
    );

    return response;
  }

  Future<void> updateBookingStatus() async {
    final url = Uri.parse("http://localhost:5000/api/bookings/update"); // Replace with your backend URL
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "futsalName": futsalName,
        "date": selectedDay.toIso8601String(),
        "timeSlot": selectedTimeSlot,
        "paymentStatus": "confirmed",
      }),
    );

    if (response.statusCode == 200) {
      print("Booking status updated successfully.");
    } else {
      print("Failed to update booking status.");
    }
  }
}
