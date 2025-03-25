// ignore_for_file: use_build_context_synchronously

import 'dart:convert';
import 'package:esewa_flutter_sdk/esewa_flutter_sdk.dart';
import 'package:esewa_flutter_sdk/esewa_config.dart';
import 'package:esewa_flutter_sdk/esewa_payment.dart';
import 'package:esewa_flutter_sdk/esewa_payment_success_result.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:player/common/esewa.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Esewa {
  final String futsalName;
  final DateTime selectedDay;
  final String? selectedTimeSlot;
  final double advancePayment;
  final String bookingId;
  final double totalCost;
  final String userId;

  Esewa({
    required this.futsalName,
    required this.selectedDay,
    required this.selectedTimeSlot,
    required this.advancePayment,
    required this.bookingId,
    required this.totalCost,
    required this.userId,
  });

  /// Starts the eSewa payment process.
  void pay(BuildContext context) {
    try {
      EsewaFlutterSdk.initPayment(
        esewaConfig: EsewaConfig(
          environment:
              Environment.test, // Switch to Environment.live in production
          clientId: kEsewaClientId,
          secretId: kEsewaSecretKey,
        ),
        esewaPayment: EsewaPayment(
          productId: "futsal-${DateTime.now().millisecondsSinceEpoch}",
          productName: futsalName,
          productPrice: advancePayment.toStringAsFixed(2),
          callbackUrl: '', // Optionally provide a callback URL
        ),
        onPaymentSuccess: (EsewaPaymentSuccessResult result) {
          debugPrint('Payment Success, Ref ID: ${result.refId}');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text("Payment successful. Booking confirmed.")),
          );
          // Verify the transaction with eSewa server
          verifyTransaction(context, result);
        },
        onPaymentFailure: () {
          debugPrint('Payment Failure');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Payment failed. Please try again.")),
          );
        },
        onPaymentCancellation: () {
          debugPrint('Payment Cancelled');
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Payment cancelled by user.")),
          );
        },
      );
    } catch (e) {
      debugPrint('Exception during payment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("An error occurred. Please try again.")),
      );
    }
  }

  /// Verifies the transaction using eSewa’s verification endpoint.
  Future<void> verifyTransaction(
      BuildContext context, EsewaPaymentSuccessResult result) async {
    final url = Uri.parse(
        "https://rc.esewa.com.np/mobile/transaction?txnRefId=${result.refId}");
    try {
      final response = await http.get(
        url,
        headers: {
          "merchantId": kEsewaClientId,
          "merchantSecret": kEsewaSecretKey,
          "Content-Type": "application/json",
        },
      );
      if (response.statusCode == 200) {
        debugPrint("Verification response: ${response.body}");
        final data = jsonDecode(response.body);

        // Check if the response is a list (array)
        if (data is List && data.isNotEmpty) {
          final transactionDetails = data[0]
              ["transactionDetails"]; // Extract the first item if it's an array
          if (transactionDetails is Map<String, dynamic> &&
              transactionDetails.containsKey("status")) {
            final status = transactionDetails["status"];
            debugPrint("Transaction status: $status");
            if (status == "COMPLETE") {
              // Create the booking on success
              await createBookings(context);
              await savePaymentHistory(context, result);
            } else {
              debugPrint("Payment not complete");
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Payment verification failed.")),
              );
            }
          } else {
            debugPrint(
                "Error: 'transactionDetails' is not in the expected format.");
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                  content: Text("Error processing transaction details.")),
            );
          }
        } else {
          debugPrint("Error: Response is not a valid array or empty.");
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text("Invalid response from verification.")),
          );
        }
      } else {
        debugPrint("Error verifying transaction: ${response.statusCode}");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Error verifying transaction.")),
        );
      }
    } catch (e) {
      debugPrint("Exception verifying transaction: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Exception verifying transaction.")),
      );
    }
  }

  /// Creates a new booking after payment confirmation.
  Future<void> createBookings(BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('auth_token');
    final response = await http.get(
      Uri.parse('http://10.22.21.41:5000/api/users/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
            'Bearer ${token ?? ''}', // Use empty string if token is null
      },
    );

    final Map<String, dynamic> responseBody = json.decode(response.body);
    final String userId = responseBody['_id'];

    final url = Uri.parse("http://10.22.21.41:5000/api/bookings");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "futsalName": futsalName,
          "selectedDay": selectedDay.toIso8601String(),
          "selectedTimeSlot": selectedTimeSlot,
          "status": "partiallyPaid", // Set to 'pending' initially
          "totalCost": totalCost,
          "advancePayment": advancePayment,
          
          "userId": userId,
        }),
      );
      print(response.body);
      if (response.statusCode == 201) {
        debugPrint("Booking created successfully.");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text("Booking created. Awaiting confirmation.")),
        );
      } else {
        debugPrint("Failed to create booking: ${response.statusCode}");
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Failed to create booking.")),
        );
      }
    } catch (e) {
      debugPrint("Exception creating booking: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("An error occurred while creating the booking.")),
      );
    }
  }

  /// Saves the payment history to the backend.
  Future<void> savePaymentHistory(
      BuildContext context, EsewaPaymentSuccessResult result) async {
    final url = Uri.parse("http://10.22.21.41:5000/api/savePaymentHistory");
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('auth_token');
    final response = await http.get(
      Uri.parse('http://10.22.21.41:5000/api/users/me'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization':
            'Bearer ${token ?? ''}', // Use empty string if token is null
      },
    );

    final Map<String, dynamic> responseBody = json.decode(response.body);
    final String userId = responseBody['_id'];
    try {
      final response = await http.post(
        url,
        headers: {
          "Content-Type": "application/json",
        },
      //   user,
      // booking,
      // transactionUuid,
      // amount,
      // status,
      // paymentGateway,
        body: jsonEncode({
          "user": userId,
          "transactionUuid": result.refId,
          //"a": futsalName,
          "amount": advancePayment,
          // "date": selectedDay.toIso8601String(),
          // "timeSlot": selectedTimeSlot,
          // "paymentMethod": "eSewa",
          "status": "partialPayment",
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint("✅ Payment history saved successfully.");
      } else {
        debugPrint(
            "❌ Failed to save payment history. Status code: ${response.statusCode}");
      }
    } catch (e) {
      debugPrint("⚠️ Exception while saving payment history: $e");
    }
  }
}
